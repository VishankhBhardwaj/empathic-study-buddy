import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useEmotionDetection } from './EmotionDetectionContext';

const StudySessionContext = createContext();

export function useStudySession() {
  return useContext(StudySessionContext);
}

export function StudySessionProvider({ children }) {
  const { user } = useAuth();
  const { currentEmotion } = useEmotionDetection();
  const [activeSession, setActiveSession] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    totalTimeStudied: 0,
    topicsExplored: 0,
    quizzesTaken: 0,
    questionsAnswered: 0,
    correctAnswers: 0
  });
  const [learningStyle, setLearningStyle] = useState('visual'); // visual, auditory, reading, kinesthetic
  const [difficultyLevel, setDifficultyLevel] = useState('medium'); // easy, medium, hard
  const [studyStreak, setStudyStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState(null);

  // Load user's learning preferences and stats on mount
  useEffect(() => {
    if (user) {
      loadUserPreferences();
      loadSessionHistory();
      checkStudyStreak();
    }
  }, [user]);

  // Load user preferences from Supabase
  const loadUserPreferences = async () => {
    try {
      // In a real implementation, you would fetch this from your Supabase database
      // For now, we'll simulate with default values
      setLearningStyle('visual');
      setDifficultyLevel('medium');
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  // Load session history from Supabase
  const loadSessionHistory = async () => {
    try {
      // In a real implementation, you would fetch this from your Supabase database
      // For now, we'll simulate with an empty array
      setSessionHistory([]);
    } catch (error) {
      console.error('Error loading session history:', error);
    }
  };

  // Check and update study streak
  const checkStudyStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // In a real implementation, you would fetch the last study date from your database
    // For now, we'll simulate with a default value
    const lastDate = '2025-04-12'; // Yesterday
    setLastStudyDate(lastDate);
    
    const lastDateObj = new Date(lastDate);
    const todayObj = new Date(today);
    const diffDays = Math.floor((todayObj - lastDateObj) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // User studied yesterday, increment streak
      setStudyStreak(prev => prev + 1);
    } else if (diffDays > 1) {
      // User missed a day, reset streak
      setStudyStreak(0);
    }
    // If diffDays === 0, user already studied today, keep streak the same
  };

  // Start a new study session
  const startSession = async (topic) => {
    if (!user) return;
    
    const newSession = {
      id: Date.now().toString(),
      userId: user.id,
      topic: topic,
      startTime: new Date(),
      endTime: null,
      emotionLog: [],
      activities: []
    };
    
    setActiveSession(newSession);
    setCurrentTopic(topic);
    
    // In a real implementation, you would save this to your Supabase database
    // await supabase.from('study_sessions').insert([newSession]);
    
    return newSession;
  };

  // End the active study session
  const endSession = async () => {
    if (!activeSession) return;
    
    const endedSession = {
      ...activeSession,
      endTime: new Date(),
      duration: calculateDuration(activeSession.startTime, new Date())
    };
    
    setSessionHistory(prev => [endedSession, ...prev]);
    setActiveSession(null);
    
    // Update last study date and check streak
    const today = new Date().toISOString().split('T')[0];
    setLastStudyDate(today);
    checkStudyStreak();
    
    // In a real implementation, you would update this in your Supabase database
    // await supabase.from('study_sessions').update(endedSession).eq('id', endedSession.id);
    
    return endedSession;
  };

  // Log an emotion during a study session
  const logSessionEmotion = async (emotion, confidence) => {
    if (!activeSession) return;
    
    const emotionLog = {
      emotion,
      confidence,
      timestamp: new Date()
    };
    
    setActiveSession(prev => ({
      ...prev,
      emotionLog: [...(prev.emotionLog || []), emotionLog]
    }));
    
    // In a real implementation, you would update this in your Supabase database
    // await supabase.from('session_emotions').insert([{
    //   session_id: activeSession.id,
    //   emotion,
    //   confidence,
    //   timestamp: new Date()
    // }]);
  };

  // Log a study activity (quiz, reading, video, etc.)
  const logActivity = async (activityType, details) => {
    if (!activeSession) return;
    
    const activity = {
      type: activityType,
      details,
      timestamp: new Date()
    };
    
    setActiveSession(prev => ({
      ...prev,
      activities: [...(prev.activities || []), activity]
    }));
    
    // Update stats based on activity
    updateStats(activityType, details);
    
    // In a real implementation, you would update this in your Supabase database
    // await supabase.from('session_activities').insert([{
    //   session_id: activeSession.id,
    //   activity_type: activityType,
    //   details,
    //   timestamp: new Date()
    // }]);
  };

  // Update session stats based on activity
  const updateStats = (activityType, details) => {
    const newStats = { ...sessionStats };
    
    switch (activityType) {
      case 'quiz':
        newStats.quizzesTaken += 1;
        newStats.questionsAnswered += details.questionsAnswered || 0;
        newStats.correctAnswers += details.correctAnswers || 0;
        break;
      case 'topic':
        newStats.topicsExplored += 1;
        break;
      case 'study':
        newStats.totalTimeStudied += details.duration || 0;
        break;
      default:
        break;
    }
    
    setSessionStats(newStats);
  };

  // Calculate duration between two dates in minutes
  const calculateDuration = (startTime, endTime) => {
    return Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60));
  };

  // Get adaptive content based on user's learning style and current emotion
  const getAdaptiveContent = (topic) => {
    // Adjust content based on learning style
    const styleAdjustedContent = getContentForLearningStyle(topic, learningStyle);
    
    // Further adjust based on detected emotion
    return adjustContentForEmotion(styleAdjustedContent, currentEmotion);
  };

  // Get content tailored to learning style
  const getContentForLearningStyle = (topic, style) => {
    switch (style) {
      case 'visual':
        return {
          primary: 'diagram',
          secondary: 'video',
          elements: [
            { type: 'image', title: `${topic} visual diagram` },
            { type: 'graph', title: `${topic} relationship graph` },
            { type: 'video', title: `${topic} explainer video` }
          ]
        };
      case 'auditory':
        return {
          primary: 'lecture',
          secondary: 'discussion',
          elements: [
            { type: 'audio', title: `${topic} audio lecture` },
            { type: 'discussion', title: `${topic} guided discussion` },
            { type: 'qa', title: `${topic} Q&A session` }
          ]
        };
      case 'reading':
        return {
          primary: 'text',
          secondary: 'case-study',
          elements: [
            { type: 'article', title: `${topic} comprehensive article` },
            { type: 'book', title: `${topic} recommended reading` },
            { type: 'notes', title: `${topic} study notes` }
          ]
        };
      case 'kinesthetic':
        return {
          primary: 'interactive',
          secondary: 'project',
          elements: [
            { type: 'simulation', title: `${topic} interactive simulation` },
            { type: 'exercise', title: `${topic} practical exercise` },
            { type: 'project', title: `${topic} hands-on project` }
          ]
        };
      default:
        return {
          primary: 'mixed',
          secondary: 'text',
          elements: [
            { type: 'article', title: `${topic} overview` },
            { type: 'video', title: `${topic} explainer video` },
            { type: 'quiz', title: `${topic} practice quiz` }
          ]
        };
    }
  };

  // Adjust content based on detected emotion
  const adjustContentForEmotion = (content, emotion) => {
    const adjustedContent = { ...content };
    
    switch (emotion) {
      case 'frustrated':
        // Simplify content, add encouragement
        adjustedContent.elements.unshift({ 
          type: 'encouragement', 
          title: 'You can do this!',
          description: 'Let\'s break this down into smaller steps.'
        });
        break;
      case 'bored':
        // Add more engaging, challenging content
        adjustedContent.elements.unshift({ 
          type: 'challenge', 
          title: 'Challenge yourself!',
          description: 'Try this engaging activity to deepen your understanding.'
        });
        break;
      case 'confused':
        // Add simpler explanations, examples
        adjustedContent.elements.unshift({ 
          type: 'explanation', 
          title: 'Let\'s clarify',
          description: 'Here\'s a simpler way to understand this concept.'
        });
        break;
      case 'engaged':
      case 'happy':
        // Add more advanced content
        adjustedContent.elements.push({ 
          type: 'advanced', 
          title: 'Dive deeper',
          description: 'Since you\'re engaged, explore these advanced concepts.'
        });
        break;
      default:
        // No adjustments needed
        break;
    }
    
    return adjustedContent;
  };

  const value = {
    activeSession,
    sessionHistory,
    currentTopic,
    sessionStats,
    learningStyle,
    setLearningStyle,
    difficultyLevel,
    setDifficultyLevel,
    studyStreak,
    lastStudyDate,
    startSession,
    endSession,
    logSessionEmotion,
    logActivity,
    getAdaptiveContent
  };

  return (
    <StudySessionContext.Provider value={value}>
      {children}
    </StudySessionContext.Provider>
  );
}

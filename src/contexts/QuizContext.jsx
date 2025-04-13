
import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useStudySession } from './StudySessionContext';

const QuizContext = createContext();

export function useQuiz() {
  return useContext(QuizContext);
}

export function QuizProvider({ children }) {
  const { user } = useAuth();
  const { logActivity } = useStudySession();
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizBattles, setQuizBattles] = useState([]);
  const [activeBattle, setActiveBattle] = useState(null);

  // Generate a quiz based on the topic and difficulty
  const generateQuiz = async (topic, difficulty = 'medium', questionCount = 5) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, you would call your backend API or AI service to generate questions
      // For now, we'll simulate with sample questions
      const generatedQuiz = {
        id: Date.now().toString(),
        topic,
        difficulty,
        createdAt: new Date(),
        questions: generateSampleQuestions(topic, difficulty, questionCount)
      };
      
      setActiveQuiz(generatedQuiz);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setQuizResult(null);
      
      // In a real implementation, you might save this to your database
      // await supabase.from('quizzes').insert([generatedQuiz]);
      
      return generatedQuiz;
    } catch (error) {
      console.error('Error generating quiz:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a quiz from uploaded content (PDF, image, text)
  const generateQuizFromContent = async (content, contentType, questionCount = 5) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, you would extract text from the content and use AI to generate questions
      // For now, we'll simulate with generic questions
      const topic = contentType === 'text' 
        ? content.substring(0, 20) + '...' 
        : 'Uploaded ' + contentType;
      
      const generatedQuiz = {
        id: Date.now().toString(),
        topic,
        difficulty: 'medium',
        createdAt: new Date(),
        questions: generateSampleQuestions(topic, 'medium', questionCount)
      };
      
      setActiveQuiz(generatedQuiz);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setQuizResult(null);
      
      return generatedQuiz;
    } catch (error) {
      console.error('Error generating quiz from content:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Answer the current question and move to the next
  const answerQuestion = (answerId) => {
    if (!activeQuiz) return;
    
    const newAnswers = [...userAnswers, { 
      questionId: activeQuiz.questions[currentQuestionIndex].id, 
      answerId 
    }];
    
    setUserAnswers(newAnswers);
    
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of quiz, calculate results
      finishQuiz(newAnswers);
    }
  };

  // Calculate and save quiz results
  const finishQuiz = async (answers) => {
    if (!activeQuiz || !user) return;
    
    const correctAnswers = answers.filter(answer => {
      const question = activeQuiz.questions.find(q => q.id === answer.questionId);
      return question.correctAnswerId === answer.answerId;
    });
    
    const score = (correctAnswers.length / answers.length) * 100;
    
    const result = {
      quizId: activeQuiz.id,
      userId: user.id,
      score,
      totalQuestions: answers.length,
      correctAnswers: correctAnswers.length,
      completedAt: new Date(),
      answers
    };
    
    setQuizResult(result);
    setQuizHistory(prev => [result, ...prev]);
    
    // Log activity in study session
    logActivity('quiz', {
      quizId: activeQuiz.id,
      topic: activeQuiz.topic,
      questionsAnswered: answers.length,
      correctAnswers: correctAnswers.length,
      score
    });
    
    // In a real implementation, you would save this to your database
    // await supabase.from('quiz_results').insert([result]);
    
    return result;
  };

  // Reset the active quiz
  const resetQuiz = () => {
    setActiveQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizResult(null);
  };

  // Create a quiz battle
  const createQuizBattle = async (topic, difficulty = 'medium', maxParticipants = 4) => {
    try {
      if (!user) return null;
      
      const battle = {
        id: Date.now().toString(),
        creatorId: user.id,
        topic,
        difficulty,
        status: 'waiting', // waiting, active, completed
        createdAt: new Date(),
        maxParticipants,
        participants: [{ id: user.id, name: user.user_metadata?.full_name || 'User' }],
        quiz: null
      };
      
      setQuizBattles(prev => [battle, ...prev]);
      setActiveBattle(battle);
      
      // In a real implementation, you would save this to your database
      // await supabase.from('quiz_battles').insert([battle]);
      
      return battle;
    } catch (error) {
      console.error('Error creating quiz battle:', error);
      return null;
    }
  };

  // Join a quiz battle
  const joinQuizBattle = async (battleId) => {
    try {
      if (!user) return false;
      
      const battle = quizBattles.find(b => b.id === battleId);
      if (!battle) return false;
      
      if (battle.participants.length >= battle.maxParticipants) {
        throw new Error('Battle is full');
      }
      
      const updatedBattle = {
        ...battle,
        participants: [
          ...battle.participants,
          { id: user.id, name: user.user_metadata?.full_name || 'User' }
        ]
      };
      
      setQuizBattles(prev => prev.map(b => b.id === battleId ? updatedBattle : b));
      setActiveBattle(updatedBattle);
      
      // In a real implementation, you would update this in your database
      // await supabase.from('quiz_battles').update(updatedBattle).eq('id', battleId);
      
      return true;
    } catch (error) {
      console.error('Error joining quiz battle:', error);
      return false;
    }
  };

  // Start a quiz battle
  const startQuizBattle = async (battleId) => {
    try {
      const battle = quizBattles.find(b => b.id === battleId);
      if (!battle) return false;
      
      if (battle.status !== 'waiting') {
        throw new Error('Battle has already started or ended');
      }
      
      // Generate a quiz for the battle
      const quiz = {
        id: Date.now().toString(),
        topic: battle.topic,
        difficulty: battle.difficulty,
        createdAt: new Date(),
        questions: generateSampleQuestions(battle.topic, battle.difficulty, 10)
      };
      
      const updatedBattle = {
        ...battle,
        status: 'active',
        quiz,
        startedAt: new Date()
      };
      
      setQuizBattles(prev => prev.map(b => b.id === battleId ? updatedBattle : b));
      setActiveBattle(updatedBattle);
      
      // In a real implementation, you would update this in your database
      // await supabase.from('quiz_battles').update(updatedBattle).eq('id', battleId);
      
      return updatedBattle;
    } catch (error) {
      console.error('Error starting quiz battle:', error);
      return false;
    }
  };

  // Generate sample questions for testing (in a real app, this would come from your AI backend)
  const generateSampleQuestions = (topic, difficulty, count) => {
    const questions = [];
    
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `q${Date.now()}-${i}`,
        text: `Sample question ${i + 1} about ${topic} (${difficulty} difficulty)`,
        answers: [
          { id: `a${i}-1`, text: `Answer option 1 for question ${i + 1}` },
          { id: `a${i}-2`, text: `Answer option 2 for question ${i + 1}` },
          { id: `a${i}-3`, text: `Answer option 3 for question ${i + 1}` },
          { id: `a${i}-4`, text: `Answer option 4 for question ${i + 1}` }
        ],
        correctAnswerId: `a${i}-${Math.floor(Math.random() * 4) + 1}`
      });
    }
    
    return questions;
  };

  const value = {
    activeQuiz,
    currentQuestionIndex,
    userAnswers,
    quizResult,
    quizHistory,
    isLoading,
    quizBattles,
    activeBattle,
    generateQuiz,
    generateQuizFromContent,
    answerQuestion,
    resetQuiz,
    createQuizBattle,
    joinQuizBattle,
    startQuizBattle
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

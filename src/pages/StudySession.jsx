
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useStudySession } from '../contexts/StudySessionContext';
import { useEmotionDetection } from '../contexts/EmotionDetectionContext';
import { useVoiceAssistant } from '../contexts/VoiceAssistantContext';
import { BookOpen, Clock, HeartPulse, Mic, Video, File, FileText, Sparkles } from 'lucide-react';

const StudySession = () => {
  const { topicId } = useParams();
  const { startSession, endSession, activeSession, currentTopic, getAdaptiveContent } = useStudySession();
  const { currentEmotion, isDetecting } = useEmotionDetection();
  const { speak } = useVoiceAssistant();
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [adaptiveContent, setAdaptiveContent] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  
  // Available topics to study if no specific topic is selected
  const availableTopics = [
    { id: '1', name: 'Introduction to AI', difficulty: 'beginner' },
    { id: '2', name: 'Linear Algebra Basics', difficulty: 'intermediate' },
    { id: '3', name: 'Quantum Physics', difficulty: 'advanced' },
    { id: '4', name: 'World History', difficulty: 'beginner' },
    { id: '5', name: 'Organic Chemistry', difficulty: 'intermediate' },
  ];
  
  // Start a session if topic is provided via URL
  useEffect(() => {
    if (topicId && !activeSession) {
      const topic = availableTopics.find(t => t.id === topicId);
      if (topic) {
        handleStartSession(topic);
      }
    }
  }, [topicId]);

  // Timer for study session
  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setSessionTimer(seconds => seconds + 1);
      }, 1000);
    } else if (!isTimerActive && sessionTimer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, sessionTimer]);
  
  // Update adaptive content based on emotion changes
  useEffect(() => {
    if (activeSession && currentTopic) {
      const content = getAdaptiveContent(currentTopic);
      setAdaptiveContent(content);
    }
  }, [currentEmotion, activeSession, currentTopic]);
  
  const handleStartSession = async (topic) => {
    await startSession(topic.name);
    setIsTimerActive(true);
    setSessionTimer(0);
    const content = getAdaptiveContent(topic.name);
    setAdaptiveContent(content);
    
    // Welcome message with voice assistant
    speak(`Starting study session on ${topic.name}. I'll adapt content based on your learning style and emotional state.`);
  };
  
  const handleEndSession = async () => {
    await endSession();
    setIsTimerActive(false);
    setAdaptiveContent(null);
    setSelectedContent(null);
    speak("Study session ended. Great job!");
  };
  
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleContentSelect = (content) => {
    setSelectedContent(content);
    speak(`Opening ${content.title}. Let me know if you have any questions.`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Study Session</h1>
        {activeSession && (
          <div className="flex items-center gap-4">
            <div className="flex items-center px-4 py-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              <span className="font-semibold">{formatTime(sessionTimer)}</span>
            </div>
            <Button variant="outline" onClick={handleEndSession}>End Session</Button>
          </div>
        )}
      </div>
      
      {!activeSession ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Select a Topic to Study</CardTitle>
              <CardDescription>Choose a subject to start your personalized learning experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTopics.map((topic) => (
                  <Card key={topic.id} className="cursor-pointer hover:shadow-md transition" onClick={() => handleStartSession(topic)}>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{topic.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{topic.difficulty} level</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Active study session */}
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{currentTopic}</CardTitle>
                {isDetecting && (
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-sm">
                    <HeartPulse className="w-4 h-4 text-primary" />
                    <span className="capitalize">{currentEmotion}</span>
                  </div>
                )}
              </div>
              <CardDescription>
                Personalized content adapted to your learning style and emotional state
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedContent ? (
                <div className="space-y-4">
                  <Button variant="outline" size="sm" onClick={() => setSelectedContent(null)}>
                    Back to materials
                  </Button>
                  
                  <div className="p-4 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-4">{selectedContent.title}</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                      <div className="text-center p-8">
                        <p className="text-muted-foreground">
                          In a full implementation, this would display the actual content such as videos, 
                          interactive simulations, text materials, or other learning content.
                        </p>
                        <p className="text-muted-foreground mt-2">
                          The content would be tailored to your {currentEmotion} emotional state
                          and {adaptiveContent?.primary} learning style.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="recommended">
                  <TabsList className="mb-4">
                    <TabsTrigger value="recommended">Recommended</TabsTrigger>
                    <TabsTrigger value="all">All Materials</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recommended">
                    <div className="space-y-4">
                      {adaptiveContent?.elements?.map((content, index) => (
                        <div 
                          key={index} 
                          className="p-4 rounded-lg border flex items-start hover:bg-gray-50 cursor-pointer transition"
                          onClick={() => handleContentSelect(content)}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4 ${
                            content.type === 'video' ? 'bg-blue-100 text-blue-600' :
                            content.type === 'image' || content.type === 'diagram' ? 'bg-green-100 text-green-600' :
                            content.type === 'article' || content.type === 'notes' ? 'bg-purple-100 text-purple-600' :
                            content.type === 'simulation' || content.type === 'interactive' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {content.type === 'video' ? <Video className="w-5 h-5" /> :
                             content.type === 'article' || content.type === 'notes' ? <FileText className="w-5 h-5" /> :
                             content.type === 'image' || content.type === 'diagram' ? <File className="w-5 h-5" /> :
                             content.type === 'explanation' ? <Mic className="w-5 h-5" /> :
                             content.type === 'simulation' || content.type === 'interactive' ? <Sparkles className="w-5 h-5" /> :
                             <BookOpen className="w-5 h-5" />}
                          </div>
                          
                          <div>
                            <h3 className="font-medium">{content.title}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{content.type}</p>
                            {content.description && (
                              <p className="text-sm mt-1">{content.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="all">
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">
                        In a full implementation, this would display all available learning materials 
                        for the current topic, regardless of adaptive recommendations.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default StudySession;

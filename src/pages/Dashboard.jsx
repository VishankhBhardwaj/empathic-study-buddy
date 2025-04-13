
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { useStudySession } from '../contexts/StudySessionContext';
import { useEmotionDetection } from '../contexts/EmotionDetectionContext';
import { BookOpen, Trophy, Calendar, Upload, BarChart3, Clock, Sparkles, Brain, HeartPulse, Video, MessageSquare, PlusCircle, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { sessionStats, learningStyle, studyStreak, getAdaptiveContent } = useStudySession();
  const { currentEmotion, isDetecting, getRecommendationsForEmotion } = useEmotionDetection();
  const [recentTopics, setRecentTopics] = useState([
    { id: '1', name: 'Introduction to AI', progress: 75, lastStudied: '2 hours ago' },
    { id: '2', name: 'Linear Algebra Basics', progress: 40, lastStudied: '1 day ago' },
    { id: '3', name: 'Quantum Physics', progress: 20, lastStudied: '3 days ago' },
  ]);
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([
    { id: '1', title: 'AI Fundamentals', date: '2025-04-15T14:00:00', difficulty: 'medium' },
    { id: '2', title: 'Linear Algebra Quiz', date: '2025-04-17T10:00:00', difficulty: 'hard' },
  ]);
  const [studyTime, setStudyTime] = useState({
    today: 120, // minutes
    week: 540, // minutes
    total: 4800, // minutes
  });
  
  useEffect(() => {
    // In a real app, these would come from the backend
    // Here we're just simulating recommended content based on learning style
    const recommendations = [
      { id: '1', type: 'video', title: 'Visual Explanation of Neural Networks', duration: '12 min', match: 95 },
      { id: '2', type: 'interactive', title: 'Interactive Simulation: Building an AI Model', duration: '15 min', match: 92 },
      { id: '3', type: 'article', title: 'Understanding the Math Behind Machine Learning', duration: '8 min', match: 88 },
      { id: '4', type: 'quiz', title: 'Test Your AI Knowledge', duration: '10 min', match: 85 },
    ];
    
    // Prioritize content that matches the user's learning style
    const sortedRecommendations = recommendations.sort((a, b) => {
      // This is a simplified example
      const aMatchesStyle = (a.type === 'video' && learningStyle === 'visual') || 
                          (a.type === 'article' && learningStyle === 'reading') ||
                          (a.type === 'interactive' && learningStyle === 'kinesthetic');
      
      const bMatchesStyle = (b.type === 'video' && learningStyle === 'visual') || 
                          (b.type === 'article' && learningStyle === 'reading') ||
                          (b.type === 'interactive' && learningStyle === 'kinesthetic');
      
      if (aMatchesStyle && !bMatchesStyle) return -1;
      if (!aMatchesStyle && bMatchesStyle) return 1;
      return b.match - a.match;
    });
    
    setRecommendedContent(sortedRecommendations);
  }, [learningStyle]);
  
  // Get emotion-based recommendations
  const emotionRecommendations = isDetecting 
    ? getRecommendationsForEmotion()
    : { message: "Enable emotion detection for personalized recommendations based on your emotional state.", actions: [] };
  
  // Format minutes into hours and minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <div className="space-y-6">
      {/* Greeting header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.user_metadata?.full_name || 'Student'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Your personalized learning dashboard. Here's an overview of your progress.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          {studyStreak > 0 && (
            <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
              <Sparkles className="w-4 h-4 mr-1" />
              <span>{studyStreak} day streak</span>
            </div>
          )}
          <Button asChild>
            <Link to="/study">
              Start Studying
              <BookOpen className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Stats overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(studyTime.today)}</div>
            <p className="text-xs text-muted-foreground">
              {formatTime(studyTime.week)} this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Explored</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionStats.topicsExplored || 3}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessionStats.questionsAnswered 
                ? Math.round((sessionStats.correctAnswers / sessionStats.questionsAnswered) * 100) 
                : 78}%
            </div>
            <p className="text-xs text-muted-foreground">
              {sessionStats.quizzesTaken || 5} quizzes taken
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Style</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{learningStyle}</div>
            <p className="text-xs text-muted-foreground">
              Content adapted to your style
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Emotion-based recommendations if emotion detection is enabled */}
      {isDetecting && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <HeartPulse className="w-5 h-5 mr-2 text-primary" />
                Emotion-Aware Recommendations
              </CardTitle>
              <div className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium capitalize">
                {currentEmotion}
              </div>
            </div>
            <CardDescription>
              {emotionRecommendations.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {emotionRecommendations.actions.map((action, index) => (
                <Button key={index} variant="outline" size="sm" className="bg-white hover:bg-primary/10">
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Recent Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Topics</CardTitle>
              <CardDescription>Continue where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTopics.map((topic) => (
                  <div key={topic.id} className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{topic.name}</span>
                      <span className="text-sm text-muted-foreground">{topic.progress}%</span>
                    </div>
                    <Progress value={topic.progress} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Last studied {topic.lastStudied}</span>
                      <Link 
                        to={`/study/${topic.id}`} 
                        className="text-xs text-primary hover:underline flex items-center"
                      >
                        Continue <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/study">
                  View All Topics
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Upcoming Quizzes */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Quizzes</CardTitle>
              <CardDescription>Scheduled assessments and battles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingQuizzes.map((quiz) => {
                  const quizDate = new Date(quiz.date);
                  const isToday = new Date().toDateString() === quizDate.toDateString();
                  const formattedDate = isToday 
                    ? `Today at ${quizDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                    : quizDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
                      ` at ${quizDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                  
                  return (
                    <div key={quiz.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          quiz.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                          quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-medium">{quiz.title}</div>
                          <div className="text-sm text-muted-foreground">{formattedDate}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/quiz/${quiz.id}`}>
                          Prepare
                        </Link>
                      </Button>
                    </div>
                  );
                })}
                
                {upcomingQuizzes.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No upcoming quizzes</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/quiz">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create New Quiz
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Progress</CardTitle>
              <CardDescription>Your learning journey visualized</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Detailed progress charts would appear here in the full implementation,
                    showing study time, quiz scores, and topic mastery over time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommended" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>Based on your learning style and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {recommendedContent.map((content) => (
                  <div key={content.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      content.type === 'video' ? 'bg-blue-100 text-blue-600' :
                      content.type === 'article' ? 'bg-purple-100 text-purple-600' :
                      content.type === 'interactive' ? 'bg-green-100 text-green-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {content.type === 'video' ? <Video className="w-5 h-5" /> :
                       content.type === 'article' ? <BookOpen className="w-5 h-5" /> :
                       content.type === 'interactive' ? <Sparkles className="w-5 h-5" /> :
                       <MessageSquare className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{content.title}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{content.duration}</span>
                        <span className="mx-1">•</span>
                        <span className="capitalize">{content.type}</span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <div className="text-xs text-primary font-medium">{content.match}% match</div>
                        <Progress value={content.match} className="h-1 flex-1 ml-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Recommendations
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { useStudySession } from '../contexts/StudySessionContext';
import { useEmotionDetection } from '../contexts/EmotionDetectionContext';
import { 
  BarChart3, Brain, Trophy, FileText, User, Lock, Mail, Languages, 
  Bell, MessageSquare, Cog, LogOut, Check, Clock, Calendar, ChevronRight, 
  CheckCircle, Users, Book, HeartPulse, Mic, Camera
} from 'lucide-react';
import { toast } from '../components/ui/use-toast';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { learningStyle, setLearningStyle, sessionStats, studyStreak } = useStudySession();
  const { isDetecting, toggleDetection } = useEmotionDetection();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('english');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const [achievementData, setAchievementData] = useState([]);
  
  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
      
      // Simulated achievement data - in a real app, this would come from the database
      setAchievementData([
        { id: '1', name: 'Study Streak', description: '5 days in a row', progress: studyStreak > 0 ? (studyStreak / 10) * 100 : 50, value: studyStreak > 0 ? studyStreak : 5, target: 10, icon: <Calendar className="w-5 h-5" /> },
        { id: '2', name: 'Quiz Master', description: 'Complete 15 quizzes', progress: 60, value: 9, target: 15, icon: <Trophy className="w-5 h-5" /> },
        { id: '3', name: 'Knowledge Explorer', description: 'Study 10 different subjects', progress: 40, value: 4, target: 10, icon: <Book className="w-5 h-5" /> },
        { id: '4', name: 'Time Dedicated', description: '20 hours of focused study', progress: 75, value: 15, target: 20, icon: <Clock className="w-5 h-5" /> },
        { id: '5', name: 'Social Learner', description: 'Win 5 quiz battles', progress: 20, value: 1, target: 5, icon: <Users className="w-5 h-5" /> },
      ]);
    }
  }, [user, studyStreak]);
  
  const handleUpdateProfile = async () => {
    if (!fullName) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }, 1000);
  };
  
  const handleLearningStyleChange = (value) => {
    setLearningStyle(value);
    
    toast({
      title: "Learning style updated",
      description: `Your content will now be adapted to your ${value} learning style.`,
    });
  };
  
  const handleToggleEmotionDetection = () => {
    toggleDetection();
    
    toast({
      title: isDetecting ? "Emotion detection disabled" : "Emotion detection enabled",
      description: isDetecting 
        ? "Your learning experience will no longer adapt to your emotions." 
        : "Your learning experience will now adapt based on your emotional state.",
    });
  };
  
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <span>Learning Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>Statistics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your account details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Your email address is used for login and cannot be changed.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
              <Button onClick={handleUpdateProfile} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Study Reminders</div>
                  <div className="text-sm text-muted-foreground">
                    Receive reminders for scheduled study sessions
                  </div>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Quiz Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified about new quizzes and battles
                  </div>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">AI Voice Assistant</div>
                  <div className="text-sm text-muted-foreground">
                    Enable voice feedback from the AI assistant
                  </div>
                </div>
                <Switch
                  checked={aiVoiceEnabled}
                  onCheckedChange={setAiVoiceEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Style</CardTitle>
              <CardDescription>
                Set your preferred learning style to personalize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  className={`rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors ${
                    learningStyle === 'visual' ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleLearningStyleChange('visual')}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold">Visual</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn through diagrams, charts, and videos
                    </p>
                    {learningStyle === 'visual' && (
                      <div className="bg-primary text-white px-2 py-1 rounded-full text-xs flex items-center mt-2">
                        <Check className="w-3 h-3 mr-1" /> Selected
                      </div>
                    )}
                  </div>
                </div>
                
                <div 
                  className={`rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors ${
                    learningStyle === 'auditory' ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleLearningStyleChange('auditory')}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Mic className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Auditory</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn through listening and discussions
                    </p>
                    {learningStyle === 'auditory' && (
                      <div className="bg-primary text-white px-2 py-1 rounded-full text-xs flex items-center mt-2">
                        <Check className="w-3 h-3 mr-1" /> Selected
                      </div>
                    )}
                  </div>
                </div>
                
                <div 
                  className={`rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors ${
                    learningStyle === 'reading' ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleLearningStyleChange('reading')}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold">Reading/Writing</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn through reading and taking notes
                    </p>
                    {learningStyle === 'reading' && (
                      <div className="bg-primary text-white px-2 py-1 rounded-full text-xs flex items-center mt-2">
                        <Check className="w-3 h-3 mr-1" /> Selected
                      </div>
                    )}
                  </div>
                </div>
                
                <div 
                  className={`rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors ${
                    learningStyle === 'kinesthetic' ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleLearningStyleChange('kinesthetic')}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Cog className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold">Kinesthetic</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn through hands-on activities and practice
                    </p>
                    {learningStyle === 'kinesthetic' && (
                      <div className="bg-primary text-white px-2 py-1 rounded-full text-xs flex items-center mt-2">
                        <Check className="w-3 h-3 mr-1" /> Selected
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4 bg-primary/5">
                <h3 className="font-semibold flex items-center">
                  <Brain className="w-5 h-5 text-primary mr-2" />
                  What This Means
                </h3>
                <p className="text-sm mt-2">
                  Based on your selected learning style, our AI will prioritize 
                  {learningStyle === 'visual' && ' visual content like diagrams, charts, and videos.'}
                  {learningStyle === 'auditory' && ' audio content like lectures, discussions, and verbal explanations.'}
                  {learningStyle === 'reading' && ' text-based content like articles, books, and written exercises.'}
                  {learningStyle === 'kinesthetic' && ' interactive content like simulations, hands-on exercises, and practical applications.'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Advanced Learning Features</CardTitle>
              <CardDescription>
                Enable or disable special learning assistant features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium flex items-center">
                    <HeartPulse className="w-4 h-4 text-red-500 mr-2" />
                    Emotion-Aware Learning
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Detect and adapt to your emotional state to optimize learning
                  </div>
                </div>
                <Switch
                  checked={isDetecting}
                  onCheckedChange={handleToggleEmotionDetection}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium flex items-center">
                    <Languages className="w-4 h-4 text-blue-500 mr-2" />
                    Multilingual Support
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Translate and explain content in your preferred language
                  </div>
                </div>
                <Switch checked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium flex items-center">
                    <Camera className="w-4 h-4 text-purple-500 mr-2" />
                    Image & Diagram Analysis
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Extract and explain text and concepts from images
                  </div>
                </div>
                <Switch checked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>
                Track your learning progress and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievementData.map((achievement) => (
                  <div key={achievement.id} className="rounded-lg border p-4">
                    <div className="flex items-start">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        achievement.progress >= 100 ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
                      }`}>
                        {achievement.progress >= 100 ? <CheckCircle className="w-5 h-5" /> : achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{achievement.name}</h3>
                          <span className="text-sm font-semibold">
                            {achievement.value}/{achievement.target}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Achievements
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Learning Badges</CardTitle>
              <CardDescription>
                Special recognitions for your accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                    <Trophy className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="text-sm font-medium">Quiz Champion</div>
                </div>
                
                <div className="text-center opacity-40">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-sm font-medium">30-Day Streak</div>
                </div>
                
                <div className="text-center opacity-40">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                    <Book className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-sm font-medium">Knowledge Master</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-sm font-medium">Early Adopter</div>
                </div>
                
                <div className="text-center opacity-40">
                  <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-2">
                    <Users className="w-8 h-8 text-pink-600" />
                  </div>
                  <div className="text-sm font-medium">Social Scholar</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-primary/5 text-center">
                <p className="text-sm text-muted-foreground">
                  Continue learning to unlock more badges and achievements!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
              <CardDescription>
                A summary of your learning activities and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-600 font-medium">Study Time</div>
                      <div className="text-2xl font-bold">{sessionStats.totalTimeStudied || 12}h</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Book className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-green-600 font-medium">Topics Explored</div>
                      <div className="text-2xl font-bold">{sessionStats.topicsExplored || 5}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-yellow-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-sm text-yellow-600 font-medium">Quizzes Completed</div>
                      <div className="text-2xl font-bold">{sessionStats.quizzesTaken || 9}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-6">
                <h3 className="font-semibold mb-4 flex items-center justify-between">
                  <span>Study Time Distribution</span>
                  <span className="text-sm text-muted-foreground">Last 30 days</span>
                </h3>
                
                <div className="h-60 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      In a full implementation, this would display interactive charts 
                      showing your study habits, performance trends, and progress over time.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Download Complete Statistics
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;

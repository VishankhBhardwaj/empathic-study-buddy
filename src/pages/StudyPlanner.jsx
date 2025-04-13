
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { useStudySession } from '../contexts/StudySessionContext';
import { useVoiceAssistant } from '../contexts/VoiceAssistantContext';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Trash2, Clock, Brain, BrainCircuit, Sparkles, SquarePen, Calendar as CalendarSimple, CheckCircle, LoaderCircle } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

const StudyPlanner = () => {
  const { speak } = useVoiceAssistant();
  const { learningStyle } = useStudySession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());
  const [studyPlan, setStudyPlan] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [studyHours, setStudyHours] = useState(2);
  const [examDate, setExamDate] = useState(null);
  
  // Predefined learning goals
  const predefinedGoals = [
    "Master calculus fundamentals",
    "Complete organic chemistry review",
    "Understand quantum physics concepts",
    "Prepare for history exam",
    "Learn programming fundamentals",
    "Research thesis preparation"
  ];
  
  // Simulate loading subjects from backend
  useEffect(() => {
    setSubjects([
      { id: '1', name: 'Calculus II', priority: 'high', exam: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      { id: '2', name: 'Organic Chemistry', priority: 'medium', exam: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
      { id: '3', name: 'World History', priority: 'low', exam: null },
    ]);
  }, []);
  
  const handleGeneratePlan = () => {
    if (subjects.length === 0) {
      toast({
        title: "No subjects added",
        description: "Please add at least one subject to generate a study plan.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    speak("Generating your personalized study plan based on your subjects, learning style, and time availability.");
    
    // Simulate plan generation delay
    setTimeout(() => {
      // Generate a simulated AI study plan
      const generatedPlan = generateAIStudyPlan(subjects, learningStyle, studyHours);
      setStudyPlan(generatedPlan);
      setIsGenerating(false);
      
      toast({
        title: "Study plan generated",
        description: "Your personalized study plan has been created based on your preferences and learning style.",
      });
    }, 2500);
  };
  
  const handleAddSubject = () => {
    if (!newSubject.trim()) {
      toast({
        title: "Subject name required",
        description: "Please enter a subject name.",
        variant: "destructive",
      });
      return;
    }
    
    const newSubjectObj = {
      id: Date.now().toString(),
      name: newSubject.trim(),
      priority: selectedPriority,
      exam: examDate
    };
    
    setSubjects([...subjects, newSubjectObj]);
    setNewSubject('');
    setSelectedPriority('medium');
    setExamDate(null);
    
    toast({
      title: "Subject added",
      description: `${newSubject.trim()} has been added to your subjects.`,
    });
  };
  
  const handleRemoveSubject = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    
    toast({
      title: "Subject removed",
      description: "The subject has been removed from your list.",
    });
  };
  
  const handleUseGoal = (goal) => {
    setNewSubject(goal);
  };
  
  // Generate a simulated AI study plan (this would be replaced with AI backend in full implementation)
  const generateAIStudyPlan = (subjects, learningStyle, dailyHours) => {
    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const schedule = [];
    
    // Sort subjects by priority
    const sortedSubjects = [...subjects].sort((a, b) => {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      return priorityValues[b.priority] - priorityValues[a.priority];
    });
    
    // Generate a 7-day schedule
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      const dayName = daysOfWeek[day.getDay()];
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      
      // Allocate more time on weekends
      const hoursToday = isWeekend ? dailyHours * 1.5 : dailyHours;
      
      // Create sessions for this day based on subjects
      const daySessions = [];
      let remainingHours = hoursToday;
      
      // Prioritize subjects with exams coming up
      sortedSubjects.forEach(subject => {
        if (remainingHours <= 0) return;
        
        const hasUpcomingExam = subject.exam && (subject.exam - day) / (1000 * 60 * 60 * 24) < 10;
        const sessionDuration = hasUpcomingExam ? Math.min(remainingHours, 1.5) : Math.min(remainingHours, 1);
        
        if (sessionDuration > 0) {
          // Create learning activities based on learning style
          const activities = [];
          
          if (learningStyle === 'visual') {
            activities.push({
              type: 'video',
              title: `Watch ${subject.name} concept video`,
              duration: Math.round(sessionDuration * 0.4 * 60)
            });
            activities.push({
              type: 'diagram',
              title: `Create visual mind maps for ${subject.name}`,
              duration: Math.round(sessionDuration * 0.3 * 60)
            });
            activities.push({
              type: 'practice',
              title: `Visual problem practice for ${subject.name}`,
              duration: Math.round(sessionDuration * 0.3 * 60)
            });
          } else if (learningStyle === 'auditory') {
            activities.push({
              type: 'audio',
              title: `Listen to ${subject.name} lecture`,
              duration: Math.round(sessionDuration * 0.5 * 60)
            });
            activities.push({
              type: 'discussion',
              title: `Verbal recap of ${subject.name} concepts`,
              duration: Math.round(sessionDuration * 0.2 * 60)
            });
            activities.push({
              type: 'practice',
              title: `Audio-guided practice for ${subject.name}`,
              duration: Math.round(sessionDuration * 0.3 * 60)
            });
          } else if (learningStyle === 'kinesthetic') {
            activities.push({
              type: 'interactive',
              title: `Interactive simulation for ${subject.name}`,
              duration: Math.round(sessionDuration * 0.4 * 60)
            });
            activities.push({
              type: 'project',
              title: `Hands-on project for ${subject.name}`,
              duration: Math.round(sessionDuration * 0.4 * 60)
            });
            activities.push({
              type: 'practice',
              title: `Practice problems for ${subject.name}`,
              duration: Math.round(sessionDuration * 0.2 * 60)
            });
          } else { // reading/writing or default
            activities.push({
              type: 'reading',
              title: `Read ${subject.name} textbook chapter`,
              duration: Math.round(sessionDuration * 0.4 * 60)
            });
            activities.push({
              type: 'notes',
              title: `Take notes on ${subject.name} concepts`,
              duration: Math.round(sessionDuration * 0.3 * 60)
            });
            activities.push({
              type: 'practice',
              title: `Written exercises for ${subject.name}`,
              duration: Math.round(sessionDuration * 0.3 * 60)
            });
          }
          
          daySessions.push({
            id: `session-${day.toISOString()}-${subject.id}`,
            subject: subject.name,
            duration: sessionDuration,
            timeSlot: isWeekend ? '10:00 AM - 11:30 AM' : '6:00 PM - 7:30 PM',
            activities: activities,
            priority: subject.priority
          });
          
          remainingHours -= sessionDuration;
        }
      });
      
      schedule.push({
        date: format(day, 'yyyy-MM-dd'),
        day: dayName,
        isToday: i === 0,
        sessions: daySessions
      });
    }
    
    return {
      id: Date.now().toString(),
      createdAt: new Date(),
      learningStyle,
      dailyStudyHours: dailyHours,
      subjects: subjects.length,
      schedule
    };
  };
  
  const formatMinutes = (minutes) => {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'video':
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      case 'audio':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'reading':
        return <SquarePen className="w-4 h-4 text-green-500" />;
      case 'diagram':
        return <BrainCircuit className="w-4 h-4 text-indigo-500" />;
      case 'notes':
        return <SquarePen className="w-4 h-4 text-pink-500" />;
      case 'interactive':
        return <Sparkles className="w-4 h-4 text-yellow-500" />;
      case 'project':
        return <BrainCircuit className="w-4 h-4 text-orange-500" />;
      case 'discussion':
        return <Sparkles className="w-4 h-4 text-cyan-500" />;
      case 'practice':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Smart Study Planner</h1>
      <p className="text-muted-foreground">
        Create a personalized study schedule based on your subjects, priorities, and learning style.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Subject Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>Add Subjects</CardTitle>
              <CardDescription>
                Enter the subjects you want to include in your study plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Name</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Calculus, Physics, History"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exam-date">Exam Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {examDate ? format(examDate, 'PPP') : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={examDate}
                        onSelect={setExamDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Quick Add</Label>
                <div className="flex flex-wrap gap-2">
                  {predefinedGoals.slice(0, 3).map((goal, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleUseGoal(goal)}
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleAddSubject}>
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </CardFooter>
          </Card>
          
          {/* Subject List Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Subjects</CardTitle>
              <CardDescription>
                {subjects.length > 0 
                  ? `${subjects.length} subject${subjects.length > 1 ? 's' : ''} added`
                  : 'No subjects added yet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subjects.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Add subjects to create your study plan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">{subject.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${getPriorityColor(subject.priority)}`}>
                            {subject.priority}
                          </span>
                          {subject.exam && (
                            <span className="text-xs text-muted-foreground flex items-center">
                              <CalendarSimple className="w-3 h-3 mr-1" />
                              Exam: {format(subject.exam, 'MMM d')}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveSubject(subject.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Plan Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Settings</CardTitle>
              <CardDescription>
                Customize your study schedule preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="study-hours">Daily Study Hours</Label>
                <Select value={String(studyHours)} onValueChange={(value) => setStudyHours(Number(value))}>
                  <SelectTrigger id="study-hours">
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="5">5 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="learning-style">Your Learning Style</Label>
                <div className="p-3 rounded-lg bg-primary/5 flex items-center">
                  <Brain className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <div className="font-medium capitalize">{learningStyle}</div>
                    <div className="text-xs text-muted-foreground">
                      Personalized based on your profile
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleGeneratePlan}
                disabled={subjects.length === 0 || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Generate Study Plan
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Study Plan Display */}
        <div className="lg:col-span-2">
          {studyPlan ? (
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Your Personalized Study Plan</CardTitle>
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => setShowCalendar(!showCalendar)}>
                      {showCalendar ? 'Hide Calendar' : 'Show Calendar'} 
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Created {format(studyPlan.createdAt, 'PPP')} • 
                  {studyPlan.subjects} subjects • 
                  {studyPlan.dailyStudyHours} hours daily • 
                  {studyPlan.learningStyle} learning style
                </CardDescription>
              </CardHeader>
              
              {showCalendar ? (
                <CardContent className="pt-6">
                  <div className="text-center p-12">
                    <CalendarSimple className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      In a full implementation, a calendar view of your study schedule would be displayed here,
                      showing all your planned sessions across the month with the ability to adjust and reschedule sessions.
                    </p>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {studyPlan.schedule.map((day, dayIndex) => (
                      <div key={dayIndex} className={`rounded-lg ${day.isToday ? 'border border-primary/50 bg-primary/5' : 'border'}`}>
                        <div className={`px-4 py-3 flex items-center justify-between border-b ${day.isToday ? 'border-primary/20' : ''}`}>
                          <div className="flex items-center">
                            {day.isToday && (
                              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                            )}
                            <span className={`font-medium ${day.isToday ? 'text-primary' : ''}`}>{day.day}</span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              {format(new Date(day.date), 'MMM d')}
                            </span>
                          </div>
                          <div className="text-sm">
                            {day.sessions.length} session{day.sessions.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        
                        {day.sessions.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            No study sessions planned for this day
                          </div>
                        ) : (
                          <div className="divide-y">
                            {day.sessions.map((session, sessionIndex) => (
                              <div key={sessionIndex} className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="font-medium flex items-center">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${
                                      session.priority === 'high' ? 'bg-red-500' :
                                      session.priority === 'medium' ? 'bg-yellow-500' :
                                      'bg-green-500'
                                    }`}></span>
                                    {session.subject}
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {session.timeSlot}
                                  </div>
                                </div>
                                
                                <div className="space-y-1 ml-4">
                                  {session.activities.map((activity, activityIndex) => (
                                    <div key={activityIndex} className="flex items-center text-sm">
                                      {getActivityIcon(activity.type)}
                                      <span className="ml-2">{activity.title}</span>
                                      <span className="ml-auto text-xs text-muted-foreground">
                                        {formatMinutes(activity.duration)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
              
              <CardFooter className="border-t flex justify-between">
                <Button variant="outline" onClick={() => setStudyPlan(null)}>
                  Create New Plan
                </Button>
                <Button>
                  Save & Export Plan
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="shadow-lg h-full flex flex-col justify-center">
              <CardContent className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <BrainCircuit className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-3">Create Your Study Plan</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Add your subjects, set priorities, and customize your preferences to generate a 
                  personalized AI-powered study schedule.
                </p>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-3 max-w-sm w-full">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">1</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Add your subjects</h3>
                      <p className="text-sm text-muted-foreground">Enter the subjects you want to study</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 max-w-sm w-full">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">2</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Set priorities</h3>
                      <p className="text-sm text-muted-foreground">Mark which subjects need more focus</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 max-w-sm w-full">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">3</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Generate your plan</h3>
                      <p className="text-sm text-muted-foreground">Get a personalized study schedule</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;

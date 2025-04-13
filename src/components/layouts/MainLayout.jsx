
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useVoiceAssistant } from '../../contexts/VoiceAssistantContext';
import { useEmotionDetection } from '../../contexts/EmotionDetectionContext';
import { Mic, MicOff, Activity, BookOpen, Trophy, Upload, Calendar, User, Menu, X, LogOut, BrainCircuit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import AIAssistant from '../AIAssistant';

const MainLayout = () => {
  const { user, signOut } = useAuth();
  const { isListening, startListening, stopListening } = useVoiceAssistant();
  const { currentEmotion, isDetecting, toggleDetection } = useEmotionDetection();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const toggleAssistant = () => {
    setIsAssistantOpen(!isAssistantOpen);
  };
  
  const navItems = [
    { path: '/dashboard', icon: <Activity className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/study', icon: <BookOpen className="w-5 h-5" />, label: 'Study' },
    { path: '/quiz', icon: <Trophy className="w-5 h-5" />, label: 'Quiz' },
    { path: '/upload', icon: <Upload className="w-5 h-5" />, label: 'Upload' },
    { path: '/planner', icon: <Calendar className="w-5 h-5" />, label: 'Planner' },
    { path: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm border-b">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="w-6 h-6" />
        </Button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl animate-gradient-text">EmpathLearn</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleAssistant}>
          <BrainCircuit className="w-6 h-6 text-primary" />
        </Button>
      </header>
      
      {/* Sidebar (desktop always visible, mobile depends on state) */}
      <div className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } lg:w-64 w-64 bg-white border-r`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="p-4 flex items-center justify-between border-b">
            <Link to="/dashboard" className="flex items-center gap-2">
              <BrainCircuit className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl animate-gradient-text">EmpathLearn</span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Navigation links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.user_metadata?.full_name || 'User'}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex-1" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>
        <div className="container mx-auto p-4">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* AI Assistant and controls */}
      <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-4">
        {/* Voice assistant button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full h-12 w-12 ${isListening ? 'bg-primary text-white voice-pulse' : ''}`}
                onClick={isListening ? stopListening : startListening}
              >
                {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isListening ? 'Stop listening' : 'Start voice assistant'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Emotion detector indicator */}
        {isDetecting && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-white shadow-lg rounded-full p-2 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    currentEmotion === 'happy' ? 'bg-green-500' :
                    currentEmotion === 'sad' ? 'bg-blue-500' :
                    currentEmotion === 'angry' || currentEmotion === 'frustrated' ? 'bg-red-500' :
                    currentEmotion === 'confused' ? 'bg-yellow-500' :
                    currentEmotion === 'bored' ? 'bg-gray-500' :
                    'bg-purple-500'
                  }`}></div>
                  <span className="text-xs capitalize">{currentEmotion}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Current detected emotion</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* AI Assistant toggle button */}
        <Button
          variant="default"
          size="icon"
          className="rounded-full h-14 w-14 bg-primary text-white shadow-lg"
          onClick={toggleAssistant}
        >
          <BrainCircuit className="h-6 w-6" />
        </Button>
      </div>
      
      {/* AI Assistant panel */}
      {isAssistantOpen && <AIAssistant onClose={toggleAssistant} />}
    </div>
  );
};

export default MainLayout;

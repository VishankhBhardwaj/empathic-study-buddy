
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BrainCircuit, Sparkles, Mic, HeartPulse, Trophy, BookOpen, Video, Languages, LayoutGrid } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-brand-purple via-brand-indigo to-brand-blue">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-white" />
              <span className="font-bold text-2xl text-white">EmpathLearn</span>
            </div>
            <div className="space-x-2">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-12">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Learn Smarter with AI that <span className="text-yellow-300">Understands You</span>
              </h1>
              <p className="text-xl mb-8 text-white/90">
                The first AI-powered learning assistant that adapts to your emotions,
                learning style, and pace. Study smarter, not harder.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/20">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block relative">
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-pink-500/30 blur-3xl"></div>
              <div className="absolute -z-10 top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 animate-float">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Learning Assistant</h3>
                    <p className="text-xs text-white/70">Adapts to your emotions & learning style</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-white/80 text-sm">"I'm detecting some confusion. Let me explain this concept differently..."</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-white/80 text-sm">"Based on your visual learning style, here's a diagram that explains this clearly."</p>
                  </div>
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-red-300" />
                      <p className="text-white/80 text-sm">Current emotion: Engaged</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why EmpathLearn Is Revolutionary</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered learning assistant combines cutting-edge technology with educational science.
            </p>
          </div>
          
          <Tabs defaultValue="emotion" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="emotion" className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4" />
                <span>Emotion-Aware</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                <span>Voice Assistant</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Quiz Battles</span>
              </TabsTrigger>
              <TabsTrigger value="multi" className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                <span>Multimodal</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="emotion" className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-red-500" />
                  Emotion-Aware Learning
                </h3>
                <p className="text-gray-600 mb-4">
                  Our AI detects your emotions through facial expressions and adapts the learning experience in real-time.
                  Feeling frustrated? We'll simplify. Bored? We'll make it more engaging.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium mb-1">When Frustrated</div>
                    <p className="text-sm text-gray-600">Offers encouragement and breaks concepts into simpler steps.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium mb-1">When Confused</div>
                    <p className="text-sm text-gray-600">Provides alternate explanations using different analogies.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium mb-1">When Engaged</div>
                    <p className="text-sm text-gray-600">Introduces more challenging material to maintain interest.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="voice" className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Mic className="w-5 h-5 text-purple-500" />
                  Voice-Enabled AI Assistant
                </h3>
                <p className="text-gray-600 mb-4">
                  Have natural conversations with your AI tutor. Ask questions, get explanations, and navigate the app—all with your voice.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium mb-1">Voice Commands</div>
                    <p className="text-sm text-gray-600">"Create a quiz about photosynthesis" or "Explain quantum physics simply"</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium mb-1">Natural Conversation</div>
                    <p className="text-sm text-gray-600">Ask follow-up questions naturally, just like talking to a real tutor.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium mb-1">Accessible Learning</div>
                    <p className="text-sm text-gray-600">Perfect for auditory learners and hands-free studying.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="quiz" className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Real-Time Quiz Battles
                </h3>
                <p className="text-gray-600 mb-4">
                  Challenge friends or other students to live quiz competitions. Our AI generates questions on the fly based on your study materials.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium mb-1">Live Competitions</div>
                    <p className="text-sm text-gray-600">Compete in real-time with other students to answer questions fastest.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium mb-1">AI-Generated Questions</div>
                    <p className="text-sm text-gray-600">Fresh questions generated from your uploaded materials for each quiz.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium mb-1">Leaderboards & Rewards</div>
                    <p className="text-sm text-gray-600">Track progress, earn achievements, and climb the ranks.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="multi" className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-blue-500" />
                  Multimodal Learning
                </h3>
                <p className="text-gray-600 mb-4">
                  Everyone learns differently. Our AI adapts content to your preferred learning style—visual, auditory, reading, or kinesthetic.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium mb-1">Visual Learners</div>
                    <p className="text-sm text-gray-600">Diagrams, infographics, and video explanations.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium mb-1">Auditory Learners</div>
                    <p className="text-sm text-gray-600">Spoken explanations, discussions, and audio summaries.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium mb-1">Reading/Writing & Kinesthetic</div>
                    <p className="text-sm text-gray-600">Detailed notes or interactive exercises and simulations.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* More Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features That Transform Learning</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              EmpathLearn combines AI, psychology, and educational expertise to create the ultimate personalized learning experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="mb-4 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Image & Diagram Analysis</h3>
              <p className="text-gray-600">
                Upload images from textbooks or notes. Our AI reads, explains, and breaks down complex diagrams step-by-step.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="mb-4 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Study Scheduler</h3>
              <p className="text-gray-600">
                AI creates personalized study plans based on your deadlines, learning pace, and knowledge gaps.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Puzzle-Based Learning</h3>
              <p className="text-gray-600">
                Turn studying into a game with AI-generated puzzles, word scrambles, and mystery missions based on your topics.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Languages className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multilingual Support</h3>
              <p className="text-gray-600">
                Learn in your preferred language with real-time translation and explanation for non-English speakers.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-cyan">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of students who are learning faster, understanding deeper, and enjoying the process with EmpathLearn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                Start Learning For Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/20">
                Login To Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="h-6 w-6" />
                <span className="font-bold text-xl">EmpathLearn</span>
              </div>
              <p className="text-gray-400">
                The AI-powered learning assistant that understands you.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Emotion-Aware Learning</li>
                <li>Voice Assistant</li>
                <li>Quiz Battles</li>
                <li>Multimodal Learning</li>
                <li>Study Scheduler</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Blog</li>
                <li>Tutorials</li>
                <li>API Documentation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} EmpathLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

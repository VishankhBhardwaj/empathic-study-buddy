
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { VoiceAssistantProvider } from "./contexts/VoiceAssistantContext";
import { EmotionDetectionProvider } from "./contexts/EmotionDetectionContext";
import { StudySessionProvider } from "./contexts/StudySessionContext";
import { QuizProvider } from "./contexts/QuizContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudySession from "./pages/StudySession";
import QuizPage from "./pages/QuizPage";
import QuizBattle from "./pages/QuizBattle";
import ContentUpload from "./pages/ContentUpload";
import StudyPlanner from "./pages/StudyPlanner";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Layout and Routes
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/layouts/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <VoiceAssistantProvider>
          <EmotionDetectionProvider>
            <StudySessionProvider>
              <QuizProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected routes */}
                    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/study/:topicId?" element={<StudySession />} />
                      <Route path="/quiz/:topicId?" element={<QuizPage />} />
                      <Route path="/quiz-battle/:battleId?" element={<QuizBattle />} />
                      <Route path="/upload" element={<ContentUpload />} />
                      <Route path="/planner" element={<StudyPlanner />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </QuizProvider>
            </StudySessionProvider>
          </EmotionDetectionProvider>
        </VoiceAssistantProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

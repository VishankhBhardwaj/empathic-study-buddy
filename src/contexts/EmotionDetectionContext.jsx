
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const EmotionDetectionContext = createContext();

export function useEmotionDetection() {
  return useContext(EmotionDetectionContext);
}

export function EmotionDetectionProvider({ children }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [emotionConfidence, setEmotionConfidence] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // Request camera permission
  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      return false;
    }
  };

  // Start emotion detection
  const startDetection = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    
    setIsDetecting(true);
    
    // In a real implementation, you would use a computer vision model here
    // For now, we'll simulate emotion detection with random emotions
    detectionIntervalRef.current = setInterval(() => {
      simulateEmotionDetection();
    }, 3000);
  };

  // Stop emotion detection
  const stopDetection = () => {
    setIsDetecting(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Toggle emotion detection on/off
  const toggleDetection = () => {
    if (isDetecting) {
      stopDetection();
    } else {
      startDetection();
    }
  };

  // Toggle visibility of video preview
  const toggleVideoPreview = () => {
    setShowVideo(prev => !prev);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  // Simulate emotion detection (in a real app, this would use a computer vision API)
  const simulateEmotionDetection = () => {
    const emotions = ['happy', 'sad', 'neutral', 'confused', 'frustrated', 'bored', 'engaged'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const randomConfidence = Math.random() * 0.5 + 0.5; // Between 0.5 and 1.0
    
    setCurrentEmotion(randomEmotion);
    setEmotionConfidence(randomConfidence);
    
    // Log emotion to database (in a real app)
    logEmotion(randomEmotion, randomConfidence);
  };

  // Log emotion to Supabase (simulated for now)
  const logEmotion = async (emotion, confidence) => {
    try {
      // In a real implementation, you would save this to your Supabase database
      console.log('Logging emotion to database:', emotion, confidence);
      
      // Simulate the API call
      // await supabase.from('emotion_logs').insert([
      //   { 
      //     user_id: user.id,
      //     emotion: emotion,
      //     confidence: confidence,
      //     timestamp: new Date()
      //   }
      // ]);
    } catch (error) {
      console.error('Error logging emotion:', error);
    }
  };

  // Get learning recommendations based on detected emotion
  const getRecommendationsForEmotion = () => {
    switch (currentEmotion) {
      case 'frustrated':
        return {
          message: "I notice you might be feeling frustrated. Let's take a short break or try a different approach.",
          actions: [
            { label: "Take a 5-minute break", action: "break" },
            { label: "Try a simpler explanation", action: "simplify" },
            { label: "Switch to a different topic", action: "switch" }
          ]
        };
      case 'bored':
        return {
          message: "You seem a bit bored. Let's make this more engaging!",
          actions: [
            { label: "Try a quick quiz game", action: "quiz" },
            { label: "Watch an interactive demo", action: "demo" },
            { label: "Apply this to a real-world example", action: "apply" }
          ]
        };
      case 'confused':
        return {
          message: "I sense you might be confused. Let me help clarify things.",
          actions: [
            { label: "View step-by-step explanation", action: "steps" },
            { label: "See a visual diagram", action: "visual" },
            { label: "Try a simpler example", action: "simple" }
          ]
        };
      case 'sad':
        return {
          message: "You seem a bit down. Let's find something to brighten your day while learning.",
          actions: [
            { label: "Try a fun learning game", action: "game" },
            { label: "Watch an inspiring story", action: "inspire" },
            { label: "Set a small achievable goal", action: "goal" }
          ]
        };
      case 'happy':
      case 'engaged':
        return {
          message: "You're in a great learning state! Let's keep the momentum going.",
          actions: [
            { label: "Tackle a challenging problem", action: "challenge" },
            { label: "Explore an advanced concept", action: "advance" },
            { label: "Help explain to others", action: "teach" }
          ]
        };
      default:
        return {
          message: "Ready to continue learning? Let me know how I can help.",
          actions: [
            { label: "Suggest a study topic", action: "suggest" },
            { label: "Create a practice quiz", action: "quiz" },
            { label: "Summarize what we've learned", action: "summary" }
          ]
        };
    }
  };

  const value = {
    isEnabled,
    setIsEnabled,
    hasPermission,
    currentEmotion,
    emotionConfidence,
    isDetecting,
    showVideo,
    videoRef,
    requestPermission,
    startDetection,
    stopDetection,
    toggleDetection,
    toggleVideoPreview,
    getRecommendationsForEmotion
  };

  return (
    <EmotionDetectionContext.Provider value={value}>
      {children}
    </EmotionDetectionContext.Provider>
  );
}


import React, { createContext, useContext, useState, useEffect } from 'react';

const VoiceAssistantContext = createContext();

export function useVoiceAssistant() {
  return useContext(VoiceAssistantContext);
}

export function VoiceAssistantProvider({ children }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Speech recognition setup
  useEffect(() => {
    let recognition = null;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setTranscript(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }

    // Get available voices for text-to-speech
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Select a default voice - prefer a female voice if available
        const defaultVoice = availableVoices.find(voice => 
          voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Google UK English Female')
        ) || availableVoices[0];
        setSelectedVoice(defaultVoice);
      }
    };

    if (window.speechSynthesis) {
      loadVoices();
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setTranscript(transcript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        // Process the final transcript here or in a separate function
        if (transcript) {
          processVoiceCommand(transcript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      console.error('Speech recognition not supported in this browser');
    }
  };

  const stopListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported in this browser');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => {
      setSpeaking(true);
    };
    
    utterance.onend = () => {
      setSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error', event);
      setSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
    setResponse(text);
  };

  // This would be expanded to handle various voice commands
  const processVoiceCommand = async (command) => {
    const lowerCommand = command.toLowerCase();
    
    // Simple command examples - in a real app, you'd implement NLP or connect to an AI service
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      speak("Hello there! How can I help you with your learning today?");
    } else if (lowerCommand.includes('quiz') || lowerCommand.includes('test me')) {
      speak("I'll create a quiz for you based on your recent topics. Would you like easy, medium, or hard difficulty?");
    } else if (lowerCommand.includes('explain')) {
      speak("I'd be happy to explain that concept. Could you provide more details about what you'd like me to explain?");
    } else if (lowerCommand.includes('schedule') || lowerCommand.includes('plan')) {
      speak("I can help you create a study schedule. What subjects are you currently studying?");
    } else {
      // In a real app, you'd send the command to your AI backend
      speak("I heard your request. In a fully implemented version, I would connect to an AI model to process your question: " + command);
    }
  };

  const value = {
    isListening,
    transcript,
    response,
    speaking,
    voices,
    selectedVoice,
    setSelectedVoice,
    startListening,
    stopListening,
    speak,
    processVoiceCommand
  };

  return (
    <VoiceAssistantContext.Provider value={value}>
      {children}
    </VoiceAssistantContext.Provider>
  );
}

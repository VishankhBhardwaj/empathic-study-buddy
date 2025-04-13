
import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, MicOff, Send, Image, Upload, Sparkles, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useVoiceAssistant } from '../contexts/VoiceAssistantContext';
import { useEmotionDetection } from '../contexts/EmotionDetectionContext';
import { toast } from './ui/use-toast';

const AIAssistant = ({ onClose }) => {
  const { isListening, transcript, response, speaking, startListening, stopListening, speak } = useVoiceAssistant();
  const { currentEmotion, isDetecting, toggleDetection } = useEmotionDetection();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I\'m your AI learning assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Update input field when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);
  
  // Add AI response to messages when it speaks
  useEffect(() => {
    if (response && !messages.some(m => m.role === 'assistant' && m.content === response)) {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }
  }, [response]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    
    // Simulate AI thinking
    setIsThinking(true);
    
    // In a real implementation, you would call your backend AI service
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      const responseOptions = [
        "I understand your question about " + userMessage.substring(0, 20) + "... Let me explain this concept.",
        "That's a great question! Here's what you need to know about " + userMessage.substring(0, 15) + "...",
        "I can help you with that. Based on your learning style and current emotion, here's a personalized explanation.",
        "Let me break this down into simpler steps that will be easier to understand.",
        "Would you like me to create a quiz to test your understanding of this topic?",
        "I notice you might be feeling " + currentEmotion + ". Let's approach this in a way that works best for you right now."
      ];
      
      const aiResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      speak(aiResponse);
      setIsThinking(false);
    }, 1500);
  };
  
  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const handleEmotionToggle = () => {
    toggleDetection();
    toast({
      title: isDetecting ? "Emotion detection turned off" : "Emotion detection turned on",
      description: isDetecting 
        ? "Your learning experience will no longer adapt to your emotions." 
        : "Your learning experience will now adapt based on your emotional state.",
      duration: 3000,
    });
  };
  
  const handleImageUpload = () => {
    toast({
      title: "Image upload",
      description: "In a full implementation, you could upload an image of text, diagrams, or problems for AI analysis.",
      duration: 3000,
    });
  };
  
  const handleFileUpload = () => {
    toast({
      title: "File upload",
      description: "In a full implementation, you could upload PDF files, notes, or other study materials for AI to extract and explain content.",
      duration: 3000,
    });
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className={`fixed bottom-20 right-4 bg-white rounded-xl shadow-xl border border-gray-200 transition-all duration-300 ${
      isExpanded ? 'w-[90vw] h-[80vh] md:w-[600px] md:h-[70vh]' : 'w-[90vw] h-96 md:w-[400px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">AI Learning Assistant</h2>
          {currentEmotion && isDetecting && (
            <div className="px-2 py-1 rounded-full text-xs bg-gray-100 capitalize">
              {currentEmotion}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleExpand}>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 130px)' }}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-gray-100 rounded-tl-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-lg rounded-tl-none p-3 max-w-[80%]">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              placeholder="Ask me anything about your studies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleVoiceToggle}
              className={isListening ? 'bg-primary text-white' : ''}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Button type="submit" size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-1 hover:text-primary"
              onClick={handleImageUpload}
            >
              <Image className="w-3 h-3" />
              <span>Image</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1 hover:text-primary"
              onClick={handleFileUpload}
            >
              <Upload className="w-3 h-3" />
              <span>File</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1 hover:text-primary"
              onClick={handleEmotionToggle}
            >
              <Play className="w-3 h-3" />
              <span>{isDetecting ? 'Emotion: On' : 'Emotion: Off'}</span>
            </button>
          </div>
          <div>
            <span className="text-xs text-gray-400">Powered by AI</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AIAssistant;

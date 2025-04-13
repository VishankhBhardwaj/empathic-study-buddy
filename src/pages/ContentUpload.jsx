
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useQuiz } from '../contexts/QuizContext';
import { useVoiceAssistant } from '../contexts/VoiceAssistantContext';
import { useStudySession } from '../contexts/StudySessionContext';
import { FileUploader, Upload, File, FileText, Image, Camera, AlertTriangle, Loader2, Check, BookOpen } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

const ContentUpload = () => {
  const { generateQuizFromContent } = useQuiz();
  const { speak } = useVoiceAssistant();
  const { startSession } = useStudySession();
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedContent, setProcessedContent] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  
  const handleTextUpload = async () => {
    if (!textContent.trim() || !title.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    speak("Processing your text content. I'll analyze it and prepare study materials and quizzes.");
    
    // Simulate processing delay
    setTimeout(() => {
      setProcessedContent({
        title,
        subject: subject || 'General',
        contentType: 'text',
        wordCount: textContent.split(/\s+/).length,
        estimatedReadTime: Math.ceil(textContent.split(/\s+/).length / 200), // Rough estimate: 200 words per minute
        keyTopics: extractKeyTopics(textContent),
        content: textContent
      });
      setIsProcessing(false);
      
      toast({
        title: "Content processed successfully",
        description: "Your text has been analyzed and is ready for study.",
      });
    }, 2000);
  };
  
  const handleFileUpload = (type) => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      
      toast({
        title: "Demo mode",
        description: `In a full implementation, you would be able to upload ${type} files for analysis.`,
      });
    }, 1500);
  };
  
  const handleCreateQuiz = async () => {
    if (!processedContent) return;
    
    speak(`Creating a quiz based on your ${processedContent.title} content.`);
    generateQuizFromContent(processedContent.content, processedContent.contentType);
    
    toast({
      title: "Quiz created",
      description: "Your quiz has been generated from the uploaded content.",
    });
  };
  
  const handleStartStudy = async () => {
    if (!processedContent) return;
    
    speak(`Starting a study session for ${processedContent.title}.`);
    await startSession(processedContent.title);
    
    toast({
      title: "Study session started",
      description: "Your personalized study session has been created.",
    });
  };
  
  // Extract key topics (simplified simulation for demo)
  const extractKeyTopics = (text) => {
    const words = text.split(/\s+/);
    const topics = [];
    
    // Simple algorithm to extract "important" words based on length and frequency
    // In a real implementation, this would use NLP and topic modeling
    const wordCounts = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 5) {
        wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
      }
    });
    
    // Sort by frequency and take top 5
    const sortedWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
    
    return sortedWords.length > 0 ? sortedWords : ['No key topics identified'];
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Upload Content</h1>
      <p className="text-muted-foreground">
        Upload your study materials to generate personalized quizzes and study sessions.
      </p>
      
      {!processedContent ? (
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="file">Document Upload</TabsTrigger>
            <TabsTrigger value="image">Image Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Text Input</CardTitle>
                <CardDescription>
                  Paste text content like notes, articles, or any study material
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a title for this content"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject (Optional)</Label>
                    <Input
                      id="subject"
                      placeholder="E.g., Physics, History, Math"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Study Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Paste your study notes, articles, or any text content here..."
                    className="min-h-32"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleTextUpload}
                  disabled={isProcessing || !textContent.trim() || !title.trim()}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Content...
                    </>
                  ) : (
                    <>
                      Process Content
                      <FileText className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="file">
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>
                  Upload PDF, Word, or text files for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <div className="mx-auto flex flex-col items-center max-w-xs">
                    <File className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Upload documents</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Drag and drop, or click to select PDF, DOCX, or TXT files
                    </p>
                    <Button onClick={() => handleFileUpload('document')}>
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 w-4 h-4" />
                          Select File
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Max file size: 10MB
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 rounded-lg bg-yellow-50 p-4 flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Demo Mode</h4>
                    <p className="text-sm text-yellow-600">
                      In the full implementation, this would allow you to upload actual document files
                      for AI analysis, content extraction, and quiz generation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="image">
            <Card>
              <CardHeader>
                <CardTitle>Image Upload</CardTitle>
                <CardDescription>
                  Upload images of text, diagrams, or handwritten notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center">
                      <Image className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Upload Images</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop, or click to select images
                      </p>
                      <Button onClick={() => handleFileUpload('image')}>
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 w-4 h-4" />
                            Select Images
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center">
                      <Camera className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Use Camera</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Capture images of notes or diagrams
                      </p>
                      <Button onClick={() => handleFileUpload('camera')}>
                        <Camera className="mr-2 w-4 h-4" />
                        Open Camera
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 rounded-lg bg-yellow-50 p-4 flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Demo Mode</h4>
                    <p className="text-sm text-yellow-600">
                      In the full implementation, this would use computer vision to extract text,
                      analyze diagrams, and process handwritten notes from images.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{processedContent.title}</CardTitle>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                <Check className="w-4 h-4 mr-1" />
                Processed
              </div>
            </div>
            <CardDescription>
              {processedContent.subject} • {processedContent.wordCount} words • 
              ~{processedContent.estimatedReadTime} min read
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium text-lg mb-3">Key Topics Identified</h3>
                <div className="flex flex-wrap gap-2">
                  {processedContent.keyTopics.map((topic, index) => (
                    <div key={index} className="bg-primary/10 px-3 py-1 rounded-full text-sm capitalize">
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="font-medium text-lg mb-3">Available Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" onClick={handleCreateQuiz}>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Quiz from Content
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleStartStudy}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Studying this Material
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-medium text-lg mb-3">Content Preview</h3>
              <div className="max-h-64 overflow-y-auto p-3 bg-gray-50 rounded-md text-sm">
                {processedContent.content.substring(0, 500)}
                {processedContent.content.length > 500 && '...'}
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setProcessedContent(null)}>
              Upload Another Document
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ContentUpload;


import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useQuiz } from '../contexts/QuizContext';
import { useVoiceAssistant } from '../contexts/VoiceAssistantContext';
import { CheckCircle, XCircle, ChevronRight, FileText, Trophy, Clock, Upload, AlertCircle } from 'lucide-react';

const QuizPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { 
    activeQuiz, 
    currentQuestionIndex, 
    userAnswers,
    quizResult,
    generateQuiz,
    generateQuizFromContent,
    answerQuestion,
    resetQuiz,
    isLoading
  } = useQuiz();
  const { speak } = useVoiceAssistant();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [uploadType, setUploadType] = useState('text');
  const [uploadContent, setUploadContent] = useState('');
  
  // Available topics for quizzes
  const availableTopics = [
    { id: '1', name: 'Introduction to AI' },
    { id: '2', name: 'Linear Algebra Basics' },
    { id: '3', name: 'Quantum Physics' },
    { id: '4', name: 'World History' },
    { id: '5', name: 'Organic Chemistry' },
  ];
  
  const handleStartQuiz = async () => {
    if (!selectedTopic) return;
    
    await generateQuiz(selectedTopic, difficulty, questionCount);
    speak(`Starting a ${difficulty} quiz on ${selectedTopic} with ${questionCount} questions. Good luck!`);
  };
  
  const handleGenerateFromContent = async () => {
    if (!uploadContent.trim()) return;
    
    await generateQuizFromContent(uploadContent, uploadType, questionCount);
    speak(`I've generated a quiz based on your uploaded content. Let's begin!`);
  };
  
  const handleSelectAnswer = (answerId) => {
    setSelectedAnswerId(answerId);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedAnswerId) {
      answerQuestion(selectedAnswerId);
      setSelectedAnswerId(null);
      
      // Check if it's the last question
      if (currentQuestionIndex === activeQuiz?.questions.length - 1) {
        speak("That's the final question! Let's see your results.");
      } else {
        speak("Answer recorded. Next question.");
      }
    }
  };
  
  const handleResetQuiz = () => {
    resetQuiz();
    setSelectedTopic('');
  };
  
  const handleStartNewQuiz = () => {
    resetQuiz();
  };
  
  const handleCreateBattle = () => {
    navigate('/quiz-battle');
  };
  
  const renderQuizOptions = () => (
    <Tabs defaultValue="topics" className="w-full">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="topics">Select Topic</TabsTrigger>
        <TabsTrigger value="upload">Upload Content</TabsTrigger>
      </TabsList>
      
      <TabsContent value="topics">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Quiz</CardTitle>
            <CardDescription>
              Select a topic and difficulty level to create a personalized quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Topic</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableTopics.map((topic) => (
                  <Button
                    key={topic.id}
                    variant={selectedTopic === topic.name ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedTopic(topic.name)}
                  >
                    {topic.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty Level</label>
              <div className="flex space-x-2">
                {['easy', 'medium', 'hard'].map((level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? "default" : "outline"}
                    onClick={() => setDifficulty(level)}
                    className="flex-1 capitalize"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Questions</label>
              <div className="flex space-x-2">
                {[5, 10, 15].map((count) => (
                  <Button
                    key={count}
                    variant={questionCount === count ? "default" : "outline"}
                    onClick={() => setQuestionCount(count)}
                    className="flex-1"
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleStartQuiz}
              disabled={!selectedTopic || isLoading}
            >
              {isLoading ? 'Generating Quiz...' : 'Start Quiz'}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Generate Quiz From Your Content</CardTitle>
            <CardDescription>
              Upload text, notes, or study materials to create a customized quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
              <div className="flex space-x-2">
                {[
                  { id: 'text', label: 'Text' },
                  { id: 'pdf', label: 'PDF' },
                  { id: 'image', label: 'Image' }
                ].map((type) => (
                  <Button
                    key={type.id}
                    variant={uploadType === type.id ? "default" : "outline"}
                    onClick={() => setUploadType(type.id)}
                    className="flex-1"
                    disabled={type.id !== 'text'} // Only enable text for demo
                  >
                    {type.label}
                    {type.id !== 'text' && <span className="text-xs ml-1">(Demo)</span>}
                  </Button>
                ))}
              </div>
            </div>
            
            {uploadType === 'text' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Paste Your Content</label>
                <textarea
                  className="w-full min-h-32 p-3 border rounded-md"
                  placeholder="Paste your study notes, articles, or any text content here..."
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                ></textarea>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md p-10 text-center">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {uploadType === 'pdf' ? 'Upload PDF files' : 'Upload image of text or diagrams'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  (Demo only - file upload would be implemented in the full version)
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Questions</label>
              <div className="flex space-x-2">
                {[5, 10, 15].map((count) => (
                  <Button
                    key={count}
                    variant={questionCount === count ? "default" : "outline"}
                    onClick={() => setQuestionCount(count)}
                    className="flex-1"
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleGenerateFromContent}
              disabled={!uploadContent.trim() || isLoading}
            >
              {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
  
  const renderActiveQuiz = () => {
    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    
    return (
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>{activeQuiz.topic}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
            </div>
          </div>
          <Progress value={(currentQuestionIndex / activeQuiz.questions.length) * 100} className="h-2" />
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">{currentQuestion.text}</h3>
            <div className="space-y-3">
              {currentQuestion.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedAnswerId === answer.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectAnswer(answer.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border ${
                      selectedAnswerId === answer.id ? 'border-primary' : ''
                    } flex items-center justify-center mr-3`}>
                      {selectedAnswerId === answer.id && (
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <span>{answer.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t flex justify-between">
          <Button variant="outline" onClick={handleResetQuiz}>
            Cancel Quiz
          </Button>
          <Button 
            onClick={handleSubmitAnswer} 
            disabled={!selectedAnswerId}
            className="flex items-center"
          >
            Submit Answer
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  const renderQuizResults = () => {
    const correctCount = quizResult.correctAnswers;
    const totalCount = quizResult.totalQuestions;
    const percentage = quizResult.score;
    
    return (
      <Card className="shadow-lg">
        <CardHeader className="text-center border-b">
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>{activeQuiz.topic} - {activeQuiz.difficulty} difficulty</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="w-28 h-28 rounded-full border-8 border-primary/10 flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl font-bold">{Math.round(percentage)}%</div>
            </div>
            <div className="font-semibold text-lg">
              {correctCount} out of {totalCount} correct
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {percentage >= 80 ? 'Excellent work!' : 
               percentage >= 60 ? 'Good job!' : 
               percentage >= 40 ? 'Keep practicing!' : 
               'You\'ll get it next time!'}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span>Correct answers</span>
              </div>
              <span className="font-semibold">{correctCount}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-3" />
                <span>Incorrect answers</span>
              </div>
              <span className="font-semibold">{totalCount - correctCount}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-3" />
                <span>Time spent</span>
              </div>
              <span className="font-semibold">Approx. {totalCount * 30}s</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t flex justify-between">
          <Button variant="outline" onClick={handleStartNewQuiz}>
            New Quiz
          </Button>
          <Button onClick={handleCreateBattle}>
            <Trophy className="mr-2 w-4 h-4" />
            Challenge Friends
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Main render
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Quiz</h1>
      
      {isLoading ? (
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Generating Your Quiz</h2>
            <p className="text-center text-muted-foreground mb-6">
              Our AI is creating personalized questions based on your selection...
            </p>
            <Progress value={65} className="w-full max-w-xs h-2" />
          </CardContent>
        </Card>
      ) : activeQuiz ? (
        quizResult ? renderQuizResults() : renderActiveQuiz()
      ) : (
        renderQuizOptions()
      )}
    </div>
  );
};

export default QuizPage;


import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Users, Copy, ArrowRight, Loader2, Play, ArrowLeft, PlusCircle, Crown } from 'lucide-react';

const QuizBattle = () => {
  const { battleId } = useParams();
  const { user } = useAuth();
  const { 
    createQuizBattle, 
    joinQuizBattle, 
    startQuizBattle,
    quizBattles,
    activeBattle,
    isLoading
  } = useQuiz();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [battleCode, setBattleCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  // Quiz topic suggestions
  const topicSuggestions = [
    'World History', 'Mathematics', 'Science', 'Literature',
    'Geography', 'Computer Science', 'Physics', 'Biology'
  ];
  
  const handleCreateBattle = async () => {
    if (!topic) return;
    await createQuizBattle(topic, difficulty);
  };
  
  const handleJoinBattle = async () => {
    if (!battleCode) return;
    await joinQuizBattle(battleCode);
  };
  
  const handleStartBattle = async () => {
    if (!activeBattle) return;
    await startQuizBattle(activeBattle.id);
  };
  
  const handleCopyBattleCode = () => {
    if (!activeBattle) return;
    navigator.clipboard.writeText(activeBattle.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const getRandomParticipantColor = () => {
    const colors = ['bg-red-100 text-red-600', 'bg-blue-100 text-blue-600', 
                    'bg-green-100 text-green-600', 'bg-yellow-100 text-yellow-600',
                    'bg-purple-100 text-purple-600', 'bg-pink-100 text-pink-600'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Render waiting room
  const renderWaitingRoom = () => (
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Quiz Battle: {activeBattle.topic}</CardTitle>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm rounded-full">
            Waiting for players
          </div>
        </div>
        <CardDescription>Share the code with friends to invite them</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex-1">
              <Input
                value={activeBattle.id}
                readOnly
                className="bg-gray-50 font-mono"
              />
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyBattleCode}>
              {isCopied ? <span className="text-xs px-2">Copied!</span> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="space-y-2 mb-8">
            <div className="text-sm font-medium">Players ({activeBattle.participants.length}/{activeBattle.maxParticipants})</div>
            <div className="grid grid-cols-2 gap-2">
              {activeBattle.participants.map((participant, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg border">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getRandomParticipantColor()}`}>
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {participant.name}
                      {index === 0 && (
                        <Crown className="w-4 h-4 text-yellow-500 inline ml-1" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {index === 0 ? 'Host' : 'Joined'}
                    </div>
                  </div>
                </div>
              ))}
              
              {Array.from({ length: activeBattle.maxParticipants - activeBattle.participants.length }).map((_, index) => (
                <div key={`empty-${index}`} className="flex items-center p-3 rounded-lg border border-dashed">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-400">Waiting for player...</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-lg bg-primary/5 p-4">
            <h3 className="font-medium flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-primary" />
              Battle Details
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-muted-foreground">Topic:</div>
              <div className="font-medium">{activeBattle.topic}</div>
              
              <div className="text-muted-foreground">Difficulty:</div>
              <div className="font-medium capitalize">{activeBattle.difficulty}</div>
              
              <div className="text-muted-foreground">Questions:</div>
              <div className="font-medium">10</div>
              
              <div className="text-muted-foreground">Mode:</div>
              <div className="font-medium">Real-time battle</div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t flex justify-between">
        <Button variant="outline" asChild>
          <Link to="/quiz">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Leave Battle
          </Link>
        </Button>
        
        {activeBattle.participants[0].id === user?.id && (
          <Button 
            onClick={handleStartBattle} 
            disabled={activeBattle.participants.length < 2}
          >
            <Play className="mr-2 w-4 h-4" />
            Start Battle
          </Button>
        )}
      </CardFooter>
    </Card>
  );
  
  // Render battle arena (would be replaced with the actual quiz battle UI)
  const renderBattleArena = () => (
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Quiz Battle: {activeBattle.topic}</CardTitle>
          <div className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full">
            Battle in progress
          </div>
        </div>
        <CardDescription>Real-time battle - answer questions fast to win!</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="text-center p-12">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-3">Battle Started!</h2>
          <p className="text-muted-foreground mb-6">
            In a full implementation, this would display the real-time quiz battle interface with:
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-sm">
            <div className="p-3 bg-primary/5 rounded-lg">Live question display</div>
            <div className="p-3 bg-primary/5 rounded-lg">Real-time player scores</div>
            <div className="p-3 bg-primary/5 rounded-lg">Timer countdown</div>
            <div className="p-3 bg-primary/5 rounded-lg">Power-ups and bonuses</div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/quiz">
            Leave Battle
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
  
  // Main render
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quiz Battle</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to="/quiz">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quizzes
          </Link>
        </Button>
      </div>
      
      {activeBattle ? (
        activeBattle.status === 'waiting' ? renderWaitingRoom() : renderBattleArena()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Battle Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlusCircle className="w-5 h-5 mr-2" />
                Create a Battle
              </CardTitle>
              <CardDescription>
                Set up a quiz battle and invite friends to join
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Battle Topic</label>
                <Input
                  placeholder="Enter a quiz topic..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {topicSuggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setTopic(suggestion)}
                    >
                      {suggestion}
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
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleCreateBattle}
                disabled={!topic || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Battle
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Join Battle Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Join a Battle
              </CardTitle>
              <CardDescription>
                Enter a battle code to join an existing game
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Battle Code</label>
                <Input
                  placeholder="Enter the battle code..."
                  value={battleCode}
                  onChange={(e) => setBattleCode(e.target.value)}
                />
              </div>
              
              <div className="rounded-lg bg-primary/5 p-4">
                <h3 className="font-medium flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-primary" />
                  How Quiz Battles Work
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary mr-2 flex-shrink-0 mt-0.5">1</span>
                    <span>Join or create a battle room with friends</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary mr-2 flex-shrink-0 mt-0.5">2</span>
                    <span>Answer questions as quickly as possible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary mr-2 flex-shrink-0 mt-0.5">3</span>
                    <span>Score points for correct answers and speed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary mr-2 flex-shrink-0 mt-0.5">4</span>
                    <span>Use power-ups to gain advantages</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleJoinBattle}
                disabled={!battleCode || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    Join Battle
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuizBattle;

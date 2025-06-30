import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Clock, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Calendar,
  ArrowLeft,
  Play,
  RotateCcw,
  Lightbulb,
  Trophy
} from 'lucide-react';

interface DailyChallenge {
  id: string;
  type: 'debug' | 'theory' | 'code';
  title: string;
  description: string;
  question: string;
  code?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  xpReward: number;
  difficulty: 'NOVICE' | 'APPRENTICE' | 'EXPERT' | 'MASTER';
  timeLimit: number; // in seconds
}

interface DailyChallengesProps {
  onBack: () => void;
}

const dailyChallenges: DailyChallenge[] = [
  {
    id: 'debug-1',
    type: 'debug',
    title: 'SYNTAX_ERROR.JS',
    description: 'FIND AND FIX THE BUG IN THIS CODE',
    question: 'The following code should log "Hello World" but contains an error. Fix it:',
    code: `function greet() {\n  console.log("Hello World"\n}\n\ngreet();`,
    correctAnswer: `function greet() {\n  console.log("Hello World");\n}\n\ngreet();`,
    explanation: 'Missing closing parenthesis and semicolon in console.log statement',
    xpReward: 150,
    difficulty: 'NOVICE',
    timeLimit: 300
  },
  {
    id: 'theory-1',
    type: 'theory',
    title: 'CLOSURE_CONCEPT.JS',
    description: 'TEST YOUR UNDERSTANDING OF JAVASCRIPT CLOSURES',
    question: 'What will the following code output?',
    code: `function outer() {\n  let x = 10;\n  return function inner() {\n    console.log(x);\n  }\n}\n\nconst fn = outer();\nfn();`,
    options: ['undefined', '10', 'Error', 'null'],
    correctAnswer: 1,
    explanation: 'The inner function has access to the outer function\'s variable through closure',
    xpReward: 200,
    difficulty: 'APPRENTICE',
    timeLimit: 180
  },
  {
    id: 'code-1',
    type: 'code',
    title: 'ARRAY_MANIPULATION.JS',
    description: 'IMPLEMENT A FUNCTION TO SOLVE THIS PROBLEM',
    question: 'Write a function that returns the sum of all even numbers in an array:',
    code: `function sumEvenNumbers(arr) {\n  // YOUR CODE HERE\n}\n\n// Test: sumEvenNumbers([1, 2, 3, 4, 5, 6]) should return 12`,
    correctAnswer: `function sumEvenNumbers(arr) {\n  return arr.filter(num => num % 2 === 0).reduce((sum, num) => sum + num, 0);\n}`,
    explanation: 'Filter even numbers, then reduce to sum them up',
    xpReward: 250,
    difficulty: 'EXPERT',
    timeLimit: 600
  }
];

const DailyChallenges: React.FC<DailyChallengesProps> = ({ onBack }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState(0);

  const challenge = dailyChallenges[currentChallenge];

  useEffect(() => {
    if (challenge) {
      setTimeLeft(challenge.timeLimit);
      setUserAnswer(challenge.code || '');
      setSelectedOption(null);
      setShowResult(false);
      setIsCorrect(false);
    }
  }, [challenge]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSubmit();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startChallenge = () => {
    setIsActive(true);
    setTimeLeft(challenge.timeLimit);
  };

  const handleSubmit = () => {
    setIsActive(false);
    let correct = false;

    if (challenge.type === 'theory' && challenge.options) {
      correct = selectedOption === challenge.correctAnswer;
    } else {
      const userCode = userAnswer.trim().replace(/\s+/g, ' ');
      const correctCode = challenge.correctAnswer.toString().trim().replace(/\s+/g, ' ');
      correct = userCode.includes(correctCode) || userCode === correctCode;
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct && !completedChallenges.includes(challenge.id)) {
      setCompletedChallenges(prev => [...prev, challenge.id]);
      setTotalXP(prev => prev + challenge.xpReward);
    }
  };

  const resetChallenge = () => {
    setUserAnswer(challenge.code || '');
    setSelectedOption(null);
    setTimeLeft(challenge.timeLimit);
    setIsActive(false);
    setShowResult(false);
  };

  const nextChallenge = () => {
    if (currentChallenge < dailyChallenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'NOVICE': return 'border-green-400/30 text-green-400';
      case 'APPRENTICE': return 'border-white/30 text-white';
      case 'EXPERT': return 'border-white/50 text-white';
      case 'MASTER': return 'border-white/70 text-white';
      default: return 'border-white/30 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <style jsx>{`
        .subtle-glow {
          text-shadow: 0 0 2px rgba(0, 255, 65, 0.3);
        }
        .black-glass {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .success-glow {
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
        }
        .error-glow {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
        .question-glow {
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-white/10 black-glass">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">BACK</span>
              </button>
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-6 h-6 text-green-400 question-glow" />
                <span className="text-white subtle-glow font-bold">DAILY_CHALLENGES.EXE</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-white/60" />
                <span className="text-white/60">DAY {new Date().getDate()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-white/60" />
                <span className="text-white/80">XP: {totalXP.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-white/60" />
                <span className="text-white/60">{completedChallenges.length}/{dailyChallenges.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Riddle Me This Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <HelpCircle className="w-8 h-8 text-green-400 question-glow" />
            <h1 className="text-3xl font-bold text-white subtle-glow">RIDDLE ME THIS</h1>
            <HelpCircle className="w-8 h-8 text-green-400 question-glow" />
          </div>
          <p className="text-white/60 text-sm">DAILY CHALLENGES TO SHARPEN YOUR NEURAL PATHWAYS</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challenge Card */}
          <div className="lg:col-span-2">
            <div className="black-glass p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-white subtle-glow">{challenge.title}</h2>
                  <span className={`px-2 py-1 text-xs font-bold border ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-white/60" />
                    <span className={`font-mono ${timeLeft < 30 ? 'text-white' : 'text-white/80'}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-white/60" />
                    <span className="text-white/80">{challenge.xpReward} XP</span>
                  </div>
                </div>
              </div>

              <p className="text-white/80 mb-4">{challenge.description}</p>
              <p className="text-white mb-6">{challenge.question}</p>

              {/* Code Editor for Debug/Code Challenges */}
              {(challenge.type === 'debug' || challenge.type === 'code') && (
                <div className="mb-6">
                  <div className="border border-white/20 bg-black/50">
                    <div className="border-b border-white/10 px-3 py-2 bg-white/5">
                      <span className="text-white/60 text-sm">CODE_EDITOR.JS</span>
                    </div>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full h-64 bg-transparent text-white font-mono text-sm p-4 resize-none outline-none"
                      disabled={!isActive && !showResult}
                      spellCheck={false}
                    />
                  </div>
                </div>
              )}

              {/* Multiple Choice for Theory */}
              {challenge.type === 'theory' && challenge.options && (
                <div className="mb-6 space-y-3">
                  {challenge.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedOption(index)}
                      disabled={!isActive}
                      className={`w-full text-left p-3 border transition-all ${
                        selectedOption === index
                          ? 'border-green-400/50 bg-green-400/10 text-white'
                          : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40'
                      } ${!isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-green-400 mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {!isActive && !showResult && (
                  <button
                    onClick={startChallenge}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 border border-green-400/30 text-green-400 hover:bg-green-600/30 transition-all success-glow"
                  >
                    <Play className="w-4 h-4" />
                    <span>START CHALLENGE</span>
                  </button>
                )}
                
                {isActive && (
                  <>
                    <button
                      onClick={handleSubmit}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>SUBMIT</span>
                    </button>
                    <button
                      onClick={resetChallenge}
                      className="flex items-center space-x-2 px-3 py-2 bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>RESET</span>
                    </button>
                  </>
                )}

                {showResult && (
                  <button
                    onClick={nextChallenge}
                    disabled={currentChallenge >= dailyChallenges.length - 1}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>NEXT CHALLENGE</span>
                  </button>
                )}
              </div>

              {/* Result Display */}
              {showResult && (
                <div className={`mt-6 p-4 border ${
                  isCorrect 
                    ? 'border-green-400/30 bg-green-400/10 success-glow' 
                    : 'border-white/30 bg-white/10 error-glow'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-white" />
                    )}
                    <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-white'}`}>
                      {isCorrect ? 'CORRECT!' : 'INCORRECT'}
                    </span>
                    {isCorrect && (
                      <span className="text-white/60">+{challenge.xpReward} XP</span>
                    )}
                  </div>
                  <p className="text-white/80 text-sm">{challenge.explanation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Panel */}
          <div className="space-y-6">
            {/* Today's Progress */}
            <div className="black-glass p-4">
              <h3 className="text-white font-bold mb-4 subtle-glow">TODAY'S PROGRESS</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">COMPLETED:</span>
                  <span className="text-white">{completedChallenges.length}/{dailyChallenges.length}</span>
                </div>
                <div className="w-full bg-white/10 h-2">
                  <div 
                    className="bg-green-400 h-2 transition-all duration-500"
                    style={{ width: `${(completedChallenges.length / dailyChallenges.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">XP EARNED:</span>
                  <span className="text-white font-bold">{totalXP}</span>
                </div>
              </div>
            </div>

            {/* Challenge List */}
            <div className="black-glass p-4">
              <h3 className="text-white font-bold mb-4 subtle-glow">CHALLENGE LIST</h3>
              <div className="space-y-2">
                {dailyChallenges.map((ch, index) => (
                  <div
                    key={ch.id}
                    className={`flex items-center justify-between p-2 border cursor-pointer transition-all ${
                      index === currentChallenge
                        ? 'border-green-400/50 bg-green-400/10'
                        : completedChallenges.includes(ch.id)
                        ? 'border-white/30 bg-white/5'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => setCurrentChallenge(index)}
                  >
                    <div className="flex items-center space-x-2">
                      {completedChallenges.includes(ch.id) ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-white/40" />
                      )}
                      <span className="text-white/80 text-sm">{ch.title}</span>
                    </div>
                    <span className="text-white/60 text-xs">{ch.xpReward} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint System */}
            <div className="black-glass p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-4 h-4 text-white/60" />
                <h3 className="text-white font-bold subtle-glow">NEURAL HINT</h3>
              </div>
              <p className="text-white/60 text-sm">
                {challenge.type === 'debug' && "Look for syntax errors like missing brackets, semicolons, or parentheses."}
                {challenge.type === 'theory' && "Think about the fundamental concepts and how they apply to this scenario."}
                {challenge.type === 'code' && "Break down the problem into smaller steps and consider built-in array methods."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenges;
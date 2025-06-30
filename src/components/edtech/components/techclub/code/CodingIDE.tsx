import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Terminal, 
  Eye, 
  Code2, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowLeft,
  Zap,
  Target
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  difficulty: 'NOVICE' | 'APPRENTICE' | 'EXPERT' | 'MASTER';
}

interface CodingIDEProps {
  pathId: string;
  pathTitle: string;
  onBack: () => void;
}

const sampleChallenges: Record<string, Challenge[]> = {
  javascript: [
    {
      id: 'js-1',
      title: 'VARIABLE_DECLARATION.JS',
      description: 'MASTER THE ART OF STORING DATA',
      instructions: [
        'DECLARE A VARIABLE NAMED "message" WITH VALUE "Hello, Neural Academy!"',
        'LOG THE MESSAGE TO THE CONSOLE',
        'OBSERVE THE OUTPUT IN THE PREVIEW PANEL'
      ],
      starterCode: '// NEURAL ACADEMY - JAVASCRIPT PATHWAY\n// CHALLENGE: VARIABLE DECLARATION\n\n// YOUR CODE HERE\n',
      expectedOutput: 'Hello, Neural Academy!',
      hints: [
        'USE const, let, OR var TO DECLARE VARIABLES',
        'console.log() OUTPUTS TO THE CONSOLE',
        'STRINGS ARE WRAPPED IN QUOTES'
      ],
      difficulty: 'NOVICE'
    }
  ],
  react: [
    {
      id: 'react-1',
      title: 'COMPONENT_CREATION.JSX',
      description: 'BUILD YOUR FIRST REACT COMPONENT',
      instructions: [
        'CREATE A FUNCTIONAL COMPONENT NAMED "WelcomeMessage"',
        'RETURN A DIV WITH "Welcome to React!" TEXT',
        'RENDER THE COMPONENT IN THE APP'
      ],
      starterCode: 'import React from \'react\';\n\n// NEURAL ACADEMY - REACT PATHWAY\n// CHALLENGE: COMPONENT CREATION\n\n// YOUR CODE HERE\n\nfunction App() {\n  return (\n    <div>\n      {/* RENDER YOUR COMPONENT HERE */}\n    </div>\n  );\n}\n\nexport default App;',
      expectedOutput: 'Welcome to React!',
      hints: [
        'FUNCTIONAL COMPONENTS ARE JUST FUNCTIONS THAT RETURN JSX',
        'JSX LOOKS LIKE HTML BUT IS JAVASCRIPT',
        'COMPONENTS MUST START WITH CAPITAL LETTERS'
      ],
      difficulty: 'APPRENTICE'
    }
  ]
};

const CodingIDE: React.FC<CodingIDEProps> = ({ pathId, pathTitle, onBack }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [terminalHistory, setTerminalHistory] = useState<Array<{type: 'system' | 'success' | 'error' | 'hint', message: string}>>([]);
  const [showHints, setShowHints] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState<'pending' | 'success' | 'error'>('pending');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const challenges = sampleChallenges[pathId] || [];
  const challenge = challenges[currentChallenge];

  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode);
      setTerminalHistory([
        { type: 'system', message: `INITIALIZING ${challenge.title}...` },
        { type: 'system', message: `DIFFICULTY: ${challenge.difficulty}` },
        { type: 'system', message: challenge.description },
        { type: 'system', message: 'INSTRUCTIONS LOADED. BEGIN WHEN READY.' }
      ]);
      setChallengeStatus('pending');
    }
  }, [challenge]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const runCode = async () => {
    if (!challenge) return;
    
    setIsRunning(true);
    setTerminalHistory(prev => [...prev, { type: 'system', message: 'EXECUTING CODE...' }]);
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation for demo purposes
      const codeContainsExpected = code.toLowerCase().includes(challenge.expectedOutput.toLowerCase());
      
      if (codeContainsExpected) {
        setOutput(challenge.expectedOutput);
        setChallengeStatus('success');
        setTerminalHistory(prev => [
          ...prev,
          { type: 'success', message: 'CODE EXECUTION SUCCESSFUL!' },
          { type: 'success', message: 'CHALLENGE COMPLETED! +250 XP GAINED' }
        ]);
      } else {
        setOutput('Unexpected output');
        setChallengeStatus('error');
        setTerminalHistory(prev => [
          ...prev,
          { type: 'error', message: 'OUTPUT DOES NOT MATCH EXPECTED RESULT' },
          { type: 'system', message: 'TRY AGAIN OR REQUEST A HINT' }
        ]);
      }
    } catch (error) {
      setChallengeStatus('error');
      setTerminalHistory(prev => [
        ...prev,
        { type: 'error', message: 'RUNTIME ERROR DETECTED' }
      ]);
    }
    
    setIsRunning(false);
  };

  const resetCode = () => {
    if (challenge) {
      setCode(challenge.starterCode);
      setOutput('');
      setChallengeStatus('pending');
      setTerminalHistory(prev => [
        ...prev,
        { type: 'system', message: 'CODE RESET TO INITIAL STATE' }
      ]);
    }
  };

  const requestHint = () => {
    if (challenge && challenge.hints.length > 0) {
      const randomHint = challenge.hints[Math.floor(Math.random() * challenge.hints.length)];
      setTerminalHistory(prev => [
        ...prev,
        { type: 'hint', message: `HINT: ${randomHint}` }
      ]);
      setShowHints(true);
    }
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

  if (!challenge) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">NO CHALLENGES AVAILABLE</h2>
          <p className="text-white/60 mb-4">This pathway is still under development.</p>
          <button 
            onClick={onBack}
            className="bg-white/10 border border-white/20 text-white px-4 py-2 hover:bg-white/20 transition-all"
          >
            RETURN TO PATHWAYS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <style jsx>{`
        .terminal-cursor::after {
          content: '_';
          animation: blink 1s infinite;
          color: rgba(0, 255, 65, 0.5);
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
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
                <Code2 className="w-5 h-5 text-white" />
                <span className="text-white subtle-glow font-bold">{pathTitle}</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
                <span className="text-white/80 text-sm">{challenge.title}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-white/60" />
                <span className="text-white/60">CHALLENGE {currentChallenge + 1}/{challenges.length}</span>
              </div>
              <div className={`flex items-center space-x-2 ${
                challengeStatus === 'success' ? 'text-green-400' : 
                challengeStatus === 'error' ? 'text-white' : 'text-white/60'
              }`}>
                {challengeStatus === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {challengeStatus === 'error' && <XCircle className="w-4 h-4" />}
                {challengeStatus === 'pending' && <Zap className="w-4 h-4" />}
                <span className="font-bold">{challengeStatus.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Panel - Code Editor & Preview */}
        <div className="flex-1 flex flex-col border-r border-white/10">
          {/* Code Editor Header */}
          <div className="border-b border-white/10 black-glass">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">CODE_EDITOR.JS</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetCode}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`flex items-center space-x-1 px-3 py-1 text-xs font-bold transition-all ${
                    isRunning 
                      ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                      : 'bg-green-600/20 border border-green-400/30 text-green-400 hover:bg-green-600/30 success-glow'
                  }`}
                >
                  {isRunning ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isRunning ? 'RUNNING...' : 'RUN'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-black/50">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-white font-mono text-sm p-4 resize-none outline-none"
              placeholder="// START CODING HERE..."
              spellCheck={false}
            />
          </div>

          {/* Preview/Console Tabs */}
          <div className="border-t border-white/10">
            <div className="flex border-b border-white/10 black-glass">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                  activeTab === 'preview' 
                    ? 'text-white border-b-2 border-green-400' 
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>PREVIEW</span>
              </button>
              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                  activeTab === 'console' 
                    ? 'text-white border-b-2 border-green-400' 
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>CONSOLE</span>
              </button>
            </div>
            
            <div className="h-32 bg-black/30 p-4">
              {activeTab === 'preview' && (
                <div className="h-full">
                  <div className="text-white/60 text-xs mb-2">OUTPUT:</div>
                  <div className="text-white font-mono text-sm">
                    {output || 'NO OUTPUT YET'}
                  </div>
                </div>
              )}
              {activeTab === 'console' && (
                <div className="h-full">
                  <div className="text-white/60 text-xs mb-2">CONSOLE LOG:</div>
                  <div className="text-white/80 font-mono text-sm">
                    {output ? `> ${output}` : '> WAITING FOR EXECUTION...'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Instructions & Terminal */}
        <div className="w-96 flex flex-col bg-black/30">
          {/* Instructions Header */}
          <div className="border-b border-white/10 black-glass">
            <div className="px-4 py-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-white subtle-glow font-bold">NEURAL_TERMINAL</span>
              </div>
            </div>
          </div>

          {/* Challenge Instructions */}
          <div className="border-b border-white/10 p-4 bg-black/20">
            <h3 className="text-white font-bold mb-2 subtle-glow">{challenge.title}</h3>
            <p className="text-white/80 text-sm mb-3">{challenge.description}</p>
            
            <div className="space-y-2">
              <div className="text-white/60 text-xs font-bold">INSTRUCTIONS:</div>
              {challenge.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-2 text-xs">
                  <span className="text-green-400 mt-0.5">{index + 1}.</span>
                  <span className="text-white/80">{instruction}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={requestHint}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
              >
                <Lightbulb className="w-3 h-3" />
                <span>HINT</span>
              </button>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="flex-1 overflow-hidden">
            <div 
              ref={terminalRef}
              className="h-full overflow-y-auto p-4 space-y-2 text-xs"
            >
              {terminalHistory.map((entry, index) => (
                <div key={index} className={`${
                  entry.type === 'system' ? 'text-white/60' :
                  entry.type === 'success' ? 'text-green-400' :
                  entry.type === 'error' ? 'text-white' :
                  entry.type === 'hint' ? 'text-white/80' : 'text-white'
                }`}>
                  <span className="text-green-400">neural@academy:~$</span> {entry.message}
                </div>
              ))}
              <div className="text-green-400 terminal-cursor">neural@academy:~$</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingIDE;
import React, { useState, useEffect, useRef } from 'react';
import { Timer, CheckCircle, XCircle, GraduationCap, Book, ChevronDown } from 'lucide-react';
import { examService, FileInfo, Question } from '../../../../services/examService';
import toast from 'react-hot-toast';

const streams = [
  {
    id: 'law',
    name: 'Law',
    exams: [
      { id: 'lsat', name: 'LSAT', subjects: [ { id: 'logic', name: 'Logical Reasoning' }, { id: 'reading', name: 'Reading Comprehension' }, { id: 'games', name: 'Analytical Games' } ] },
      { id: 'lnat', name: 'LNAT', subjects: [ { id: 'essay', name: 'Essay' }, { id: 'mcq', name: 'Multiple Choice' } ] },
      { id: 'clat', name: 'CLAT', subjects: [ { id: 'english', name: 'English' }, { id: 'legal', name: 'Legal Reasoning' }, { id: 'gk', name: 'General Knowledge' } ] }
    ]
  },
  {
    id: 'management',
    name: 'Management',
    exams: [
      { id: 'cat', name: 'CAT', subjects: [ { id: 'quant', name: 'Quantitative Aptitude' }, { id: 'dilr', name: 'Data Interpretation & Logical Reasoning' }, { id: 'verbal', name: 'Verbal Ability' } ] },
      { id: 'xat', name: 'XAT', subjects: [ { id: 'decision', name: 'Decision Making' }, { id: 'verbal', name: 'Verbal Ability' } ] },
      { id: 'mat', name: 'MAT', subjects: [ { id: 'math', name: 'Mathematical Skills' }, { id: 'intelligence', name: 'Intelligence & Critical Reasoning' } ] }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering',
    exams: [
      { id: 'iitjee', name: 'IIT JEE', subjects: [ { id: 'physics', name: 'Physics' }, { id: 'chemistry', name: 'Chemistry' }, { id: 'maths', name: 'Mathematics' } ] },
      { id: 'bitsat', name: 'BITSAT', subjects: [ { id: 'physics', name: 'Physics' }, { id: 'chemistry', name: 'Chemistry' }, { id: 'maths', name: 'Mathematics' }, { id: 'english', name: 'English Proficiency' } ] },
      { id: 'viteee', name: 'VITEEE', subjects: [ { id: 'physics', name: 'Physics' }, { id: 'chemistry', name: 'Chemistry' }, { id: 'maths', name: 'Mathematics' }, { id: 'biology', name: 'Biology' } ] }
    ]
  },
  {
    id: 'arts',
    name: 'Arts',
    exams: [
      { id: 'ba', name: 'BA Entrance', subjects: [ { id: 'english', name: 'English' }, { id: 'history', name: 'History' }, { id: 'political', name: 'Political Science' } ] },
      { id: 'nid', name: 'NID', subjects: [ { id: 'design', name: 'Design Aptitude' } ] },
      { id: 'nift', name: 'NIFT', subjects: [ { id: 'creative', name: 'Creative Ability' }, { id: 'general', name: 'General Ability' } ] }
    ]
  }
];

const QUESTION_COUNT = 5;
const QUESTION_TIME = 30;
const AI_ACCURACY = 0.8;
const AI_MIN_DELAY = 2000;
const AI_MAX_DELAY = 5000;

export const ExamArena = () => {
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showStreamDropdown, setShowStreamDropdown] = useState(false);
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [aiAnswer, setAiAnswer] = useState<number | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30);
  const [arenaStarted, setArenaStarted] = useState(false);
  const [arenaFinished, setArenaFinished] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const timerRef = useRef<number | null>(null);
  const aiTimeoutRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [aiAnswers, setAiAnswers] = useState<(number | null)[]>([]);
  const [userAnswered, setUserAnswered] = useState(false);
  const [aiAnswered, setAiAnswered] = useState(false);
  const [checkingAnswer, setCheckingAnswer] = useState(false);
  const [userCheckedResults, setUserCheckedResults] = useState<(boolean|null)[]>([]);
  const [aiCheckedResults, setAiCheckedResults] = useState<(boolean|null)[]>([]);
  const [showArenaSummary, setShowArenaSummary] = useState(false);
  // 1. Enforce AI accuracy: preselect which questions AI will get right
  const [aiCorrectIndices, setAiCorrectIndices] = useState<number[]>([]);
  // 1. Add state for per-question results and feedback
  const [userResults, setUserResults] = useState<(boolean|null)[]>([]);
  const [aiResults, setAiResults] = useState<(boolean|null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState<string | null>(null);
  const [currentCorrectIndex, setCurrentCorrectIndex] = useState<number | null>(null);
  const [arenaComplete, setArenaComplete] = useState(false);
  const [userScoreFinal, setUserScoreFinal] = useState(0);
  const [aiScoreFinal, setAiScoreFinal] = useState(0);

  const selectedStreamData = streams.find(s => s.id === selectedStream);
  const selectedExamData = selectedStreamData?.exams.find(e => e.id === selectedExam);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const files = await examService.getFiles();
        setUploadedFiles(files);
      } catch (error) {
        toast.error('Failed to fetch uploaded files');
      }
    };
    fetchUploadedFiles();
  }, []);

  const startArena = async () => {
    if (!selectedStream || !selectedExam || !selectedSubject) {
      toast.error('Please select a stream, exam, and subject first');
      return;
    }
    if (!uploadedFiles || uploadedFiles.length === 0) {
      toast.error('Please upload some study materials first');
      return;
    }
    setArenaFinished(false);
    setUserScore(0);
    setAiScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAiAnswer(null);
    setAiThinking(false);
    setQuestionTimeLeft(30);
    setUserAnswers([]);
    setAiAnswers([]);
    setUserAnswered(false);
    setAiAnswered(false);
    setLoading(true);
    try {
      const qs = await examService.generateQuestions(selectedStream, selectedExam, QUESTION_COUNT, selectedSubject);
      if (!qs || qs.length === 0) {
        toast.error('No questions available.');
        setLoading(false);
        return;
      }
      setQuestions(qs);
      setArenaStarted(true);
      // 1. Enforce AI accuracy: preselect which questions AI will get right
      const numCorrect = Math.max(3, Math.round(QUESTION_COUNT * AI_ACCURACY));
      const indices = Array.from({ length: QUESTION_COUNT }, (_, i) => i);
      const shuffled = indices.sort(() => Math.random() - 0.5);
      setAiCorrectIndices(shuffled.slice(0, numCorrect));
    } catch (e) {
      toast.error('Failed to fetch questions.');
    }
    setLoading(false);
  };

  // Add timer state and logic
  useEffect(() => {
    if (!arenaStarted || arenaComplete) return;
    setQuestionTimeLeft(30);
    if (showExplanation) return; // Pause timer when explanation is shown
    const interval = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [arenaStarted, currentQuestion, showExplanation, arenaComplete]);

  // On answer select, have AI answer as well
  const handleAnswer = async (index: number) => {
    if (arenaComplete || selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const q = questions[currentQuestion];
    // User check
    const userRes = await examService.checkAnswer(
      q.question,
      q.options,
      q.options[index],
      q.correctAnswer
    );
    setUserAnswers(prev => {
      const updated = [...prev];
      updated[currentQuestion] = index;
      return updated;
    });
    setUserResults(prev => {
      const updated = [...prev];
      updated[currentQuestion] = userRes;
      return updated;
    });
    // AI answer
    let aiIdx: number;
    const correctIdx = getCorrectAnswerIndex(q);
    const aiShouldBeCorrect = aiCorrectIndices.includes(currentQuestion);
    if (aiShouldBeCorrect && correctIdx !== -1) {
      aiIdx = correctIdx;
    } else {
      // Pick a random wrong answer
      const wrongOptions = q.options.map((_, idx) => idx).filter(idx => idx !== correctIdx);
      aiIdx = wrongOptions.length > 0 ? wrongOptions[Math.floor(Math.random() * wrongOptions.length)] : 0;
    }
    setAiAnswers(prev => {
      const updated = [...prev];
      updated[currentQuestion] = aiIdx;
      return updated;
    });
    const aiRes = await examService.checkAnswer(
      q.question,
      q.options,
      q.options[aiIdx],
      q.correctAnswer
    );
    setAiResults(prev => {
      const updated = [...prev];
      updated[currentQuestion] = aiRes;
      return updated;
    });
    setShowExplanation(true);
    setCurrentExplanation(q.explanation);
    setCurrentCorrectIndex(correctIdx);
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  // Handle timeout: show explanation and correct answer, then auto-advance after 2s
  const handleTimeout = () => {
    if (arenaComplete || showExplanation) return;
    setShowExplanation(true);
    const q = questions[currentQuestion];
    setCurrentExplanation(q.explanation);
    setCurrentCorrectIndex(getCorrectAnswerIndex(q));
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  // Next button logic
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setCurrentExplanation(null);
      setCurrentCorrectIndex(null);
      setQuestionTimeLeft(30);
    } else {
      setArenaComplete(true);
      // Use up-to-date results for scoring
      window.setTimeout(() => {
        setUserScoreFinal(userResults.filter(r => r === true).length);
        setAiScoreFinal(aiResults.filter(r => r === true).length);
      }, 0);
    }
  };

  const restartArena = () => {
    setQuestions([]);
    setArenaStarted(false);
    setArenaFinished(false);
    setUserScore(0);
    setAiScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAiAnswer(null);
    setAiThinking(false);
  };

  const q = questions[currentQuestion];

  function getActualCorrectAnswer(question: Question) {
    const correctAnswerExists = question.options.includes(question.correctAnswer);
    let actualCorrectAnswer = question.correctAnswer;
    if (!correctAnswerExists) {
      const matchingOption = question.options.find(option =>
        option.toLowerCase().includes(question.correctAnswer.toLowerCase()) ||
        question.correctAnswer.toLowerCase().includes(option.toLowerCase())
      );
      if (matchingOption) {
        actualCorrectAnswer = matchingOption;
      }
    }
    return actualCorrectAnswer;
  }

  function isAnswerCorrect(question: Question, answerIndex: number | null) {
    if (answerIndex == null) return false;
    const userAnsNorm = question.options[answerIndex]?.trim().toLowerCase();
    const correctAnsNorm = question.correctAnswer?.trim().toLowerCase();
    return userAnsNorm === correctAnsNorm;
  }

  // Helper to get correct answer index
  function getCorrectAnswerIndex(q: Question) {
    return q.options.findIndex((opt: string) => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
  }

  // Helper to get letter for option index
  function getOptionLetter(idx: number) {
    return ['A', 'B', 'C', 'D'][idx] || '';
  }

  // Batch check answers at the end, like ExamPractice
  useEffect(() => {
    if (arenaFinished && questions.length > 0) {
      (async () => {
        // User answers
        const userResults = await Promise.all(questions.map((question, index) => {
          const userIdx = userAnswers[index];
          if (userIdx == null) return null;
          // Try both option string and letter
          const userOption = question.options[userIdx];
          const userLetter = getOptionLetter(userIdx);
          // If correctAnswer is a letter, match by index
          if (['a','b','c','d'].includes(question.correctAnswer.trim().toLowerCase())) {
            return userLetter.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
          }
          return examService.checkAnswer(
            question.question,
            question.options,
            userOption,
            question.correctAnswer
          );
        }));
        setUserCheckedResults(userResults);
        // AI answers
        const aiResults = await Promise.all(questions.map((question, index) => {
          const aiIdx = aiAnswers[index];
          if (aiIdx == null) return null;
          const aiOption = question.options[aiIdx];
          const aiLetter = getOptionLetter(aiIdx);
          if (['a','b','c','d'].includes(question.correctAnswer.trim().toLowerCase())) {
            return aiLetter.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
          }
          return examService.checkAnswer(
            question.question,
            question.options,
            aiOption,
            question.correctAnswer
          );
        }));
        setAiCheckedResults(aiResults);
        setShowArenaSummary(true);
      })();
    } else {
      setShowArenaSummary(false);
    }
  }, [arenaFinished, questions, userAnswers, aiAnswers]);

  const allChecked = userCheckedResults.length === questions.length && userCheckedResults.every(r => r !== null) && aiCheckedResults.length === questions.length && aiCheckedResults.every(r => r !== null);
  const winner = userScoreFinal > aiScoreFinal ? 'You Win!' : userScoreFinal < aiScoreFinal ? 'AI Wins!' : 'It\'s a Tie!';

  return (
    <div className="space-y-8 overflow-visible">
      {/* Stream/Exam Selection */}
      {!arenaStarted && !arenaComplete && (
        <div className="space-y-8 w-full max-w-md mx-auto">
          <div className="flex flex-row gap-3">
            {/* Stream Selection */}
            <div className="relative w-48">
              <button
                onClick={() => setShowStreamDropdown(!showStreamDropdown)}
                className="w-full flex items-center justify-between px-3 py-1 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code text-sm"
              >
                <div className="flex items-center space-x-1">
                  <GraduationCap className="w-5 h-5" />
                  <span>{selectedStream ? streams.find(s => s.id === selectedStream)?.name : 'Select Stream'}</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${showStreamDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showStreamDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-black/90 border border-matrix/30 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {streams.map(stream => (
                    <button
                      key={stream.id}
                      onClick={() => {
                        setSelectedStream(stream.id);
                        setSelectedExam(null);
                        setShowStreamDropdown(false);
                      }}
                      className="w-full px-3 py-1 text-left hover:bg-matrix/10 transition-colors font-code text-matrix/80 hover:text-matrix first:rounded-t-lg last:rounded-b-lg text-sm"
                    >
                      {stream.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Exam Selection */}
            <div className="relative w-48">
              <button
                onClick={() => selectedStream && setShowExamDropdown(!showExamDropdown)}
                disabled={!selectedStream}
                className={`w-full flex items-center justify-between px-3 py-1 bg-black/50 border rounded-lg font-code transition-all text-sm ${
                  selectedStream
                    ? 'text-matrix border-matrix/30 hover:bg-matrix/10'
                    : 'text-matrix/40 border-matrix/10 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Book className="w-5 h-5" />
                  <span>{selectedExam ? selectedStreamData?.exams.find(e => e.id === selectedExam)?.name : 'Select Exam'}</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${showExamDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showExamDropdown && selectedStreamData && (
                <div className="absolute z-50 w-full mt-2 bg-black/90 border border-matrix/30 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {selectedStreamData.exams.map(exam => (
                    <button
                      key={exam.id}
                      onClick={() => {
                        setSelectedExam(exam.id);
                        setShowExamDropdown(false);
                      }}
                      className="w-full px-3 py-1 text-left hover:bg-matrix/10 transition-colors font-code text-matrix/80 hover:text-matrix first:rounded-t-lg last:rounded-b-lg text-sm"
                    >
                      {exam.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Subject Selection */}
            <div className="relative w-48">
              <button
                onClick={() => selectedExam && setShowSubjectDropdown(!showSubjectDropdown)}
                disabled={!selectedExam}
                className={`w-full flex items-center justify-between px-3 py-1 bg-black/50 border rounded-lg font-code transition-all text-sm ${
                  selectedExam
                    ? 'text-matrix border-matrix/30 hover:bg-matrix/10'
                    : 'text-matrix/40 border-matrix/10 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Book className="w-5 h-5" />
                  <span>{selectedSubject ? selectedExamData?.subjects.find(s => s.id === selectedSubject)?.name : 'Select Subject'}</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${showSubjectDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showSubjectDropdown && selectedExamData && (
                <div className="absolute z-50 w-full mt-2 bg-black/90 border border-matrix/30 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {selectedExamData.subjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject.id);
                        setShowSubjectDropdown(false);
                      }}
                      className="w-full px-3 py-1 text-left hover:bg-matrix/10 transition-colors font-code text-matrix/80 hover:text-matrix first:rounded-t-lg last:rounded-b-lg text-sm"
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={startArena}
              disabled={!selectedStream || !selectedExam || !selectedSubject || loading}
              className={`px-8 py-4 bg-black/50 text-matrix border border-matrix/30 rounded-lg font-code text-lg ${(!selectedStream || !selectedExam || !selectedSubject || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-matrix/10'}`}
            >
              {loading ? 'Starting...' : 'Start Arena'}
            </button>
          </div>
        </div>
      )}
      {/* Arena Questions */}
      {arenaStarted && !arenaComplete && questions.length > 0 && (
        <div className="bg-black/50 border border-matrix/30 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-matrix font-code text-lg">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="flex items-center space-x-2 text-matrix font-code">
              <Timer className="w-5 h-5" />
              <span>{questionTimeLeft < 10 ? `0${questionTimeLeft}` : questionTimeLeft}s</span>
            </div>
          </div>
          <div className="mb-6 text-matrix font-code text-xl">
            {questions[currentQuestion].question}
          </div>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option: string, idx: number) => {
              const letter = getOptionLetter(idx);
              const isSelected = selectedAnswer === idx;
              let feedback = '';
              if (showExplanation && isSelected) {
                feedback = userResults[currentQuestion] === true
                  ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                  : 'bg-red-500/20 text-red-500 border border-red-500/30';
              } else {
                feedback = 'bg-black/30 text-matrix/80 border border-matrix/20';
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-code mb-2 transition-all ${feedback}`}
                  disabled={showExplanation || selectedAnswer !== null}
                >
                  <span className="font-bold mr-2">{letter}.</span> {option}
                  {showExplanation && isSelected && userResults[currentQuestion] === true && (
                    <CheckCircle className="w-4 h-4 inline-block ml-2 text-green-500" />
                  )}
                  {showExplanation && isSelected && userResults[currentQuestion] === false && (
                    <XCircle className="w-4 h-4 inline-block ml-2 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>
          {/* Show explanation and correct answer after answer is selected or timer ends */}
          {showExplanation && (
            <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-4 text-matrix/80 font-code text-base">
              <span><b>Explanation:</b> {currentExplanation}</span>
              <span className="hidden md:inline-block">|</span>
              {currentCorrectIndex !== null && currentCorrectIndex !== -1 && (
                <>
                  <span><b>Correct Answer:</b> {getOptionLetter(currentCorrectIndex)}. {questions[currentQuestion].options[currentCorrectIndex]}</span>
                  <span className="hidden md:inline-block">|</span>
                </>
              )}
              <span><b>Your Answer:</b> {selectedAnswer !== null ? (userResults[currentQuestion] ? <span className="text-green-500">Correct</span> : <span className="text-red-500">Wrong</span>) : <span className="text-gray-400">No Answer</span>}</span>
              <span className="hidden md:inline-block">|</span>
              <span><b>AI Answer:</b> {aiAnswers[currentQuestion] !== null ? (aiResults[currentQuestion] ? <span className="text-green-500">Correct</span> : <span className="text-red-500">Wrong</span>) : <span className="text-gray-400">No Answer</span>}</span>
            </div>
          )}
          {/* Next button only if answer was selected and not last question */}
          {showExplanation && (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-matrix text-black rounded-lg font-code text-lg mt-4"
            >
              {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          )}
        </div>
      )}
      {/* Arena Complete - show only final score */}
      {arenaComplete && (
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl text-matrix font-code">Arena Complete!</h2>
          <div className="bg-black/50 border border-matrix/30 rounded-lg p-6 text-center">
            <div className="text-3xl text-matrix font-code mb-2">
              Score: {userScoreFinal} (You) vs {aiScoreFinal} (AI)
            </div>
            <div className="text-matrix/70 font-code mb-4">
              {userScoreFinal > aiScoreFinal ? 'You Win!' : userScoreFinal < aiScoreFinal ? 'AI Wins!' : 'It\'s a Tie!'}
            </div>
            <button
              onClick={restartArena}
              className="px-8 py-4 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 font-code text-lg mt-6"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
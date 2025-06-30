import React, { useState, useEffect } from 'react';
import { Book, GraduationCap, Timer, Brain, ChevronDown, Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { examService, FileInfo, Question } from '../../../../services/examService';
import toast from 'react-hot-toast';

interface Subject {
  id: string;
  name: string;
}

interface Exam {
  id: string;
  name: string;
  subjects: Subject[];
}

interface Stream {
  id: string;
  name: string;
  exams: Exam[];
}

const streams: Stream[] = [
  {
    id: 'law',
    name: 'Law',
    exams: [
      {
        id: 'lsat',
        name: 'LSAT',
        subjects: [
          { id: 'logic', name: 'Logical Reasoning' },
          { id: 'reading', name: 'Reading Comprehension' },
          { id: 'games', name: 'Analytical Games' }
        ]
      },
      {
        id: 'lnat',
        name: 'LNAT',
        subjects: [
          { id: 'essay', name: 'Essay' },
          { id: 'mcq', name: 'Multiple Choice' }
        ]
      },
      {
        id: 'clat',
        name: 'CLAT',
        subjects: [
          { id: 'english', name: 'English' },
          { id: 'legal', name: 'Legal Reasoning' },
          { id: 'gk', name: 'General Knowledge' }
        ]
      }
    ]
  },
  {
    id: 'management',
    name: 'Management',
    exams: [
      {
        id: 'cat',
        name: 'CAT',
        subjects: [
          { id: 'quant', name: 'Quantitative Aptitude' },
          { id: 'dilr', name: 'Data Interpretation & Logical Reasoning' },
          { id: 'verbal', name: 'Verbal Ability' }
        ]
      },
      {
        id: 'xat',
        name: 'XAT',
        subjects: [
          { id: 'decision', name: 'Decision Making' },
          { id: 'verbal', name: 'Verbal Ability' }
        ]
      },
      {
        id: 'mat',
        name: 'MAT',
        subjects: [
          { id: 'math', name: 'Mathematical Skills' },
          { id: 'intelligence', name: 'Intelligence & Critical Reasoning' }
        ]
      }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering',
    exams: [
      {
        id: 'iitjee',
        name: 'IIT JEE',
        subjects: [
          { id: 'physics', name: 'Physics' },
          { id: 'chemistry', name: 'Chemistry' },
          { id: 'maths', name: 'Mathematics' }
        ]
      },
      {
        id: 'bitsat',
        name: 'BITSAT',
        subjects: [
          { id: 'physics', name: 'Physics' },
          { id: 'chemistry', name: 'Chemistry' },
          { id: 'maths', name: 'Mathematics' },
          { id: 'english', name: 'English Proficiency' }
        ]
      },
      {
        id: 'viteee',
        name: 'VITEEE',
        subjects: [
          { id: 'physics', name: 'Physics' },
          { id: 'chemistry', name: 'Chemistry' },
          { id: 'maths', name: 'Mathematics' },
          { id: 'biology', name: 'Biology' }
        ]
      }
    ]
  },
  {
    id: 'arts',
    name: 'Arts',
    exams: [
      {
        id: 'ba',
        name: 'BA Entrance',
        subjects: [
          { id: 'english', name: 'English' },
          { id: 'history', name: 'History' },
          { id: 'political', name: 'Political Science' }
        ]
      },
      {
        id: 'nid',
        name: 'NID',
        subjects: [
          { id: 'design', name: 'Design Aptitude' }
        ]
      },
      {
        id: 'nift',
        name: 'NIFT',
        subjects: [
          { id: 'creative', name: 'Creative Ability' },
          { id: 'general', name: 'General Ability' }
        ]
      }
    ]
  }
];

export const ExamPractice = () => {
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showStreamDropdown, setShowStreamDropdown] = useState(false);
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPracticeActive, setIsPracticeActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ letter: string; text: string }[]>([]);
  
  // Dynamic stats tracking
  const [practiceStartTime, setPracticeStartTime] = useState<Date | null>(null);
  const [totalQuestionsSolved, setTotalQuestionsSolved] = useState(0);
  const [topicsCovered, setTopicsCovered] = useState<Set<string>>(new Set());
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionEndTime, setSessionEndTime] = useState<Date | null>(null);
  const [sessionSummary, setSessionSummary] = useState<{
    score: number;
    total: number;
    percentage: number;
    timeSpent: string;
  } | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(5); // Default to 5 questions
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [checkedResults, setCheckedResults] = useState<(boolean|null)[]>([]);
  // 1. Add checkingAnswers state
  const [checkingAnswers, setCheckingAnswers] = useState(false);

  const selectedStreamData = streams.find(s => s.id === selectedStream);
  const selectedExamData = selectedStreamData?.exams.find(e => e.id === selectedExam);

  // Fetch uploaded files on component mount
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  // Update practice time in real-time
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout> | null = null;
    if (isPracticeActive && sessionStartTime) {
      interval = setInterval(() => {
        // Force re-render to update practice time
        setSessionStartTime(new Date(sessionStartTime.getTime()));
      }, 1000); // Update every second
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPracticeActive, sessionStartTime]);

  // When uploadedFiles change, reset selectedFile if not present
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      if (!selectedFile || !uploadedFiles.some(f => f.filename === selectedFile)) {
        setSelectedFile(uploadedFiles[0].filename);
      }
    } else {
      setSelectedFile(null);
    }
  }, [uploadedFiles]);

  const fetchUploadedFiles = async () => {
    try {
      const files = await examService.getFiles();
      setUploadedFiles(files);
    } catch (error) {
      toast.error('Failed to fetch uploaded files');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setIsUploading(true);
    try {
      await examService.uploadFiles(selectedFiles);
      toast.success('Files uploaded successfully');
      await fetchUploadedFiles();
      setSelectedFiles([]);
    } catch (error) {
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const startPracticeSession = async () => {
    if (!selectedSubject || !selectedExam) {
      toast.error('Please select a subject and exam first');
      return;
    }

    if (uploadedFiles.length === 0 || !selectedFile) {
      toast.error('Please upload and select a study material file first');
      return;
    }

    try {
      setIsPracticeActive(true);
      setSessionSummary(null);
      setSessionCompleted(false);
      setUserAnswers([]);
      setSessionEndTime(null);
      const generatedQuestions = await examService.generateQuestions(
        selectedSubject,
        selectedExam,
        questionCount,
        selectedFile
      );
      
      if (!generatedQuestions || generatedQuestions.length === 0) {
        toast.error('No questions could be generated. Please try uploading different study materials.');
        setIsPracticeActive(false);
        return;
      }

      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setScore(0);
      setPracticeStartTime(new Date());
      setSessionStartTime(new Date());
      setUserAnswers(Array.from({ length: questionCount }, () => ({ letter: '', text: '' })));
    } catch (error: any) {
      console.error('Error starting practice session:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate questions. Please try again.');
      setIsPracticeActive(false);
    }
  };

  // 1. Add a helper to get option letter
  const getOptionLetter = (index: number) => String.fromCharCode(65 + index); // 65 = 'A'

  // 2. Update userAnswers to store both letter and text
  // const [userAnswers, setUserAnswers] = useState<{ letter: string; text: string }[]>([]); // This line is removed as per instructions.

  // 3. Update handleAnswerSelect to store both letter and text
  const handleAnswerSelect = (answer: string, index: number) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    const letter = getOptionLetter(index);
    // Ensure userAnswers is the correct length and type
    let newUserAnswers = userAnswers.slice();
    if (newUserAnswers.length < questions.length) {
      newUserAnswers = Array.from({ length: questions.length }, (_, i) => newUserAnswers[i] || { letter: '', text: '' });
    }
    newUserAnswers[currentQuestionIndex] = { letter, text: answer };
    setUserAnswers(newUserAnswers);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // End of practice session - calculate results
      calculateFinalResults();
    }
  };

  // Add a robust answer checking helper
  function normalize(s: string) {
    return s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }
  function isAnswerCorrect(userAnswer: string, correctAnswer: string, options: string[], explanation: string) {
    const letters = ['A', 'B', 'C', 'D'];
    let userText = userAnswer;
    let correctText = correctAnswer;
    if (letters.includes(userAnswer.toUpperCase())) {
      userText = options[letters.indexOf(userAnswer.toUpperCase())];
    }
    if (letters.includes(correctAnswer.toUpperCase())) {
      correctText = options[letters.indexOf(correctAnswer.toUpperCase())];
    }
    const userNorm = normalize(userText || '');
    const correctNorm = normalize(correctText || '');
    // Direct match
    if (userNorm === correctNorm) return true;
    // Substring match
    if (userNorm && correctNorm && (userNorm.includes(correctNorm) || correctNorm.includes(userNorm))) return true;
    // Explanation contains answer
    if (explanation && (normalize(explanation).includes(userNorm) || normalize(explanation).includes(correctNorm))) return true;
    return false;
  }
  // In calculateFinalResults, use the robust checker
  const calculateFinalResults = () => {
    let finalScore = 0;
    const results = userAnswers.map((userAnswer, index) => {
      const question = questions[index];
      const isCorrect = isAnswerCorrect(
        userAnswer.letter || userAnswer.text,
        question.correctAnswer,
        question.options,
        question.explanation
      );
      if (isCorrect) finalScore++;
      return isCorrect;
    });
    const now = new Date();
    setSessionEndTime(now);
    const percentage = Math.round((finalScore / questions.length) * 100);
    const timeSpent = getPracticeTime(now);
    setSessionSummary({
      score: finalScore,
      total: questions.length,
      percentage,
      timeSpent
    });
    setCheckingAnswers(true);
    setSessionCompleted(true);
    setIsPracticeActive(false);
    setTotalQuestionsSolved(prev => prev + questions.length);
    let message = `Practice session completed! Score: ${finalScore}/${questions.length} (${percentage}%)`;
    if (percentage >= 80) {
      message += ' 🎉 Excellent!';
    } else if (percentage >= 60) {
      message += ' 👍 Good job!';
    } else {
      message += ' 💪 Keep practicing!';
    }
    toast.success(message);
    setTopicsCovered(prev => {
      const newTopics = new Set(prev);
      newTopics.add(selectedExamData?.subjects.find(s => s.id === selectedSubject)?.name || '');
      return newTopics;
    });
  };

  // Calculate practice time
  const getPracticeTime = (endTime?: Date) => {
    if (!sessionStartTime) return '0m';
    const now = endTime || (isPracticeActive ? new Date() : sessionEndTime || new Date());
    const diffMs = now.getTime() - sessionStartTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    
    if (diffHours > 0) {
      return `${diffHours}h ${remainingMins}m`;
    }
    return `${diffMins}m`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (sessionSummary && questions.length > 0) {
      (async () => {
        const results = await Promise.all(questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          if (!userAnswer || !userAnswer.text) return null;
          return examService.checkAnswer(
            question.question,
            question.options,
            userAnswer.text,
            question.correctAnswer
          );
        }));
        setCheckedResults(results);
        setCheckingAnswers(false);
      })();
    }
  }, [sessionSummary, questions, userAnswers]);

  useEffect(() => {
    if (sessionSummary && checkedResults.length === questions.length) {
      // Calculate score from checkedResults
      const finalScore = checkedResults.filter(r => r === true).length;
      const percentage = Math.round((finalScore / questions.length) * 100);
      setSessionSummary(prev => prev && {
        ...prev,
        score: finalScore,
        percentage
      });
    }
  }, [checkedResults, questions.length]);

  const allChecked = checkedResults.length === questions.length && checkedResults.every(r => r !== null);

  return (
    <div className="space-y-8">
      {/* Selection Area */}
      <div className="grid grid-cols-3 gap-6">
        {/* Stream Selection */}
        <div className="relative">
          <button
            onClick={() => setShowStreamDropdown(!showStreamDropdown)}
            className="w-full flex items-center justify-between px-6 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code"
          >
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-5 h-5" />
              <span>{selectedStream ? streams.find(s => s.id === selectedStream)?.name : 'Select Stream'}</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${showStreamDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showStreamDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-black/90 border border-matrix/30 rounded-lg shadow-lg">
              {streams.map(stream => (
                <button
                  key={stream.id}
                  onClick={() => {
                    setSelectedStream(stream.id);
                    setSelectedExam(null);
                    setSelectedSubject(null);
                    setShowStreamDropdown(false);
                  }}
                  className="w-full px-6 py-3 text-left hover:bg-matrix/10 transition-colors font-code text-matrix/80 hover:text-matrix first:rounded-t-lg last:rounded-b-lg"
                >
                  {stream.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exam Selection */}
        <div className="relative">
          <button
            onClick={() => selectedStream && setShowExamDropdown(!showExamDropdown)}
            disabled={!selectedStream}
            className={`w-full flex items-center justify-between px-6 py-3 bg-black/50 border rounded-lg font-code transition-all ${
              selectedStream
                ? 'text-matrix border-matrix/30 hover:bg-matrix/10'
                : 'text-matrix/40 border-matrix/10 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Book className="w-5 h-5" />
              <span>{selectedExam ? selectedStreamData?.exams.find(e => e.id === selectedExam)?.name : 'Select Exam'}</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${showExamDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showExamDropdown && selectedStreamData && (
            <div className="absolute z-10 w-full mt-2 bg-black/90 border border-matrix/30 rounded-lg shadow-lg">
              {selectedStreamData.exams.map(exam => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExam(exam.id);
                    setSelectedSubject(null);
                    setShowExamDropdown(false);
                  }}
                  className="w-full px-6 py-3 text-left hover:bg-matrix/10 transition-colors font-code text-matrix/80 hover:text-matrix first:rounded-t-lg last:rounded-b-lg"
                >
                  {exam.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Subject Selection */}
        <div className="relative">
          <button
            onClick={() => selectedExam && setShowSubjectDropdown(!showSubjectDropdown)}
            disabled={!selectedExam}
            className={`w-full flex items-center justify-between px-6 py-3 bg-black/50 border rounded-lg font-code transition-all ${
              selectedExam
                ? 'text-matrix border-matrix/30 hover:bg-matrix/10'
                : 'text-matrix/40 border-matrix/10 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Book className="w-5 h-5" />
              <span>{selectedSubject ? selectedExamData?.subjects.find(s => s.id === selectedSubject)?.name : 'Select Subject'}</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${showSubjectDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showSubjectDropdown && selectedExamData && (
            <div className="absolute z-10 w-full mt-2 bg-black/90 border border-matrix/30 rounded-lg shadow-lg">
              {selectedExamData.subjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject.id);
                    setShowSubjectDropdown(false);
                  }}
                  className="w-full px-6 py-3 text-left hover:bg-matrix/10 transition-colors font-code text-matrix/80 hover:text-matrix first:rounded-t-lg last:rounded-b-lg"
                >
                  {subject.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* File Upload Section (always visible after filters are selected) */}
      {selectedStream && selectedExam && selectedSubject && (
        <div className="bg-black/50 border border-matrix/30 rounded-lg p-4 mb-4">
          <h3 className="text-matrix font-code mb-4">Upload Study Materials</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".pdf,.txt,.csv"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code cursor-pointer"
              >
                <Upload className="w-5 h-5 inline-block mr-2" />
                Select Files
              </label>
              <button
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0}
                className={`px-4 py-2 bg-black/50 text-matrix border border-matrix/30 rounded-lg transition-all font-code ${
                  isUploading || selectedFiles.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-matrix/10'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-matrix/70 font-code mb-2">Selected Files:</h4>
                <ul className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="text-matrix/80 font-code">
                      <FileText className="w-4 h-4 inline-block mr-2" />
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Picker Section (only after filters are selected) */}
      {selectedStream && selectedExam && selectedSubject ? (
        uploadedFiles.length > 0 ? (
          <div className="bg-black/50 border border-matrix/30 rounded-lg p-4">
            <label className="block text-matrix/70 font-code mb-2">Select Study Material File</label>
            <select
              className="w-full px-4 py-2 rounded-lg font-code bg-black/70 text-matrix border border-matrix/30"
              value={selectedFile || ''}
              onChange={e => setSelectedFile(e.target.value)}
            >
              {uploadedFiles.map(file => (
                <option key={file.filename} value={file.filename}>{file.filename}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="bg-black/50 border border-matrix/30 rounded-lg p-4 text-center">
            <p className="text-matrix/70 font-code">No study material files found for the selected filters. Please upload study materials to begin.</p>
          </div>
        )
      ) : null}

      {/* Practice Area */}
      {selectedSubject ? (
        <div className="space-y-6">
          {!isPracticeActive && sessionSummary && (
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
                <div className="flex items-center space-x-2 text-matrix/70 mb-4">
                  <Timer className="w-5 h-5" />
                  <span className="font-code">Practice Time</span>
                </div>
                <div className="text-3xl text-matrix font-code">{getPracticeTime()}</div>
              </div>
              <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
                <div className="flex items-center space-x-2 text-matrix/70 mb-4">
                  <Brain className="w-5 h-5" />
                  <span className="font-code">Questions Solved</span>
                </div>
                <div className="text-3xl text-matrix font-code">{totalQuestionsSolved}</div>
              </div>
              <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
                <div className="flex items-center space-x-2 text-matrix/70 mb-4">
                  <Book className="w-5 h-5" />
                  <span className="font-code">Topics Covered</span>
                </div>
                <div className="text-3xl text-matrix font-code">{topicsCovered.size}/{selectedExamData?.subjects.length}</div>
              </div>
            </div>
          )}

          {/* Practice Session */}
          {!isPracticeActive ? (
            <div className="space-y-6">
              {sessionSummary ? (
                !allChecked ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg className="animate-spin h-8 w-8 text-matrix mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <div className="text-matrix font-code text-lg">Checking answers...</div>
                  </div>
                ) : (
                  <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
                    <h3 className="text-matrix font-code text-lg mb-4">Session Summary</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-3xl text-matrix font-code">{sessionSummary.score}/{sessionSummary.total}</div>
                        <div className="text-matrix/70 font-code">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl text-matrix font-code">{sessionSummary.percentage}%</div>
                        <div className="text-matrix/70 font-code">Accuracy</div>
                      </div>
                    </div>
                    <div className="text-center mb-6">
                      <div className="text-matrix/70 font-code">Time Spent: {sessionSummary.timeSpent}</div>
                    </div>
                    
                    {/* Results Review */}
                    <div className="mt-6">
                      <h4 className="text-matrix font-code mb-4">Question Review</h4>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {questions.map((question, index) => {
                          const userAnswer = userAnswers[index];
                          const isCorrect = checkedResults[index];
                          const correctLetter = getOptionLetter(question.options.findIndex(
                            opt => opt.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
                          ));
                          return (
                            <div key={index} className="border border-matrix/20 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-matrix/70 font-code">Question {index + 1}</span>
                                {isCorrect ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-500" />
                                )}
                              </div>
                              <div className="text-matrix font-code mb-3">{question.question}</div>
                              <div className="space-y-2">
                                {question.options.map((option, optIndex) => {
                                  const letter = getOptionLetter(optIndex);
                                  const isUserPicked = userAnswer?.letter === letter;
                                  let feedback = '';
                                  if (isUserPicked && isCorrect === true) {
                                    feedback = 'bg-green-500/20 text-green-500 border border-green-500/30';
                                  } else if (isUserPicked && isCorrect === false) {
                                    feedback = 'bg-red-500/20 text-red-500 border border-red-500/30';
                                  } else {
                                    feedback = 'bg-black/30 text-matrix/60 border border-matrix/10';
                                  }
                                  return (
                                    <div
                                      key={optIndex}
                                      className={`px-3 py-2 rounded text-sm font-code ${feedback}`}
                                    >
                                      <span className="font-bold mr-2">{letter}.</span> {option}
                                      {isUserPicked && isCorrect === true && (
                                        <CheckCircle className="w-4 h-4 inline-block ml-2 text-green-500" />
                                      )}
                                      {isUserPicked && isCorrect === false && (
                                        <XCircle className="w-4 h-4 inline-block ml-2 text-red-500" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-3 p-3 bg-black/30 border border-matrix/20 rounded">
                                <div className="text-matrix/70 font-code text-sm mb-1">Explanation:</div>
                                <div className="text-matrix/80 font-code text-sm">{question.explanation}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => {
                          setSessionSummary(null);
                          setSessionCompleted(false);
                          setQuestions([]);
                          setCurrentQuestionIndex(0);
                          setSelectedAnswer(null);
                          setShowExplanation(false);
                          setScore(0);
                          setUserAnswers([]);
                        }}
                        className="px-6 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code"
                      >
                        Start New Session
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  {/* Question Count Selector */}
                  <div className="bg-black/50 border border-matrix/30 rounded-lg p-4">
                    <h4 className="text-matrix font-code mb-3">Number of Questions</h4>
                    <div className="flex space-x-4">
                      {[5, 10, 15].map((count) => (
                        <button
                          key={count}
                          onClick={() => setQuestionCount(count)}
                          className={`px-4 py-2 rounded-lg font-code transition-all ${
                            questionCount === count
                              ? 'bg-matrix text-black'
                              : 'bg-black/30 text-matrix border border-matrix/30 hover:bg-matrix/10'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={startPracticeSession}
                      className="px-6 py-4 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code"
                    >
                      Start Practice Session
                    </button>
                    <button className="px-6 py-4 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code">
                      View Previous Sessions
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
              {currentQuestion && (
                <div className="space-y-6">
                  {/* Question Progress */}
                  <div className="flex justify-between items-center">
                    <div className="text-matrix/70 font-code">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div 
                      className="bg-matrix h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>

                  {/* Question */}
                  <div className="text-matrix font-code text-lg">
                    {currentQuestion.question}
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion && currentQuestion.options.map((option, idx) => {
                      const letter = getOptionLetter(idx);
                      const isSelected = selectedAnswer === option;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelect(option, idx)}
                          className={`w-full text-left px-4 py-3 rounded-lg border font-code mb-2 transition-all ${
                            isSelected ? 'bg-matrix/20 border-matrix text-matrix' : 'bg-black/30 border-matrix/20 text-matrix/80'
                          }`}
                          disabled={!!selectedAnswer}
                        >
                          <span className="font-bold mr-2">{letter}.</span> {option}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation - shows after answer selection */}
                  {showExplanation && (
                    <div className="mt-6 p-4 bg-black/30 border border-matrix/20 rounded-lg">
                      <div className="text-matrix/70 font-code mb-2">Explanation:</div>
                      <div className="text-matrix/80 font-code">
                        {currentQuestion.explanation}
                      </div>
                    </div>
                  )}

                  {/* Next Button - appears after explanation */}
                  {showExplanation && (
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={moveToNextQuestion}
                        className="px-6 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code"
                      >
                        {currentQuestionIndex < questions.length - 1
                          ? 'Next Question'
                          : 'Finish Practice'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-black/50 border border-matrix/30 rounded-lg p-8 text-center">
          <Book className="w-12 h-12 text-matrix/50 mx-auto mb-4" />
          <p className="text-matrix/70 font-code">Select a stream, exam, and subject to start practicing</p>
        </div>
      )}
    </div>
  );
};
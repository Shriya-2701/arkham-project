import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // AutoTrainerX backend URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UploadResponse {
  message: string;
  data_count: number;
}

export interface FileInfo {
  filename: string;
  size: number;
  last_modified: number;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const examService = {
  // Upload study materials
  uploadFiles: async (files: File[]): Promise<UploadResponse> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await api.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get list of uploaded files
  getFiles: async (): Promise<FileInfo[]> => {
    const response = await api.get('/files/');
    return response.data;
  },

  // Query the AI model with a specific question
  queryModel: async (prompt: string): Promise<string> => {
    const response = await api.post('/query/', { prompt });
    return response.data.response;
  },

  // Generate questions based on uploaded files or a specific file
  generateQuestions: async (subject: string, topic: string, questionCount: number = 5, fileName?: string): Promise<Question[]> => {
    const body: any = {
      subject,
      topic,
      prompt: `Generate ${questionCount} multiple choice questions about ${topic} for ${subject} exam preparation. Include options and explanations.`,
      question_count: questionCount
    };
    if (fileName) {
      body.fileName = fileName;
    }
    const response = await api.post('/generate-questions/', body);
    return response.data.questions;
  },

  // Check answer using backend
  checkAnswer: async (question: string, options: string[], userAnswer: string, correctAnswer: string): Promise<boolean> => {
    const response = await api.post('/check-answer/', {
      question,
      options,
      userAnswer,
      correctAnswer
    });
    return response.data.isCorrect;
  }
}; 
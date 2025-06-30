import React, { useState } from 'react';
import { Send, Search, Book, Brain } from 'lucide-react';
import { examService } from '../../../../services/examService';
import ReactMarkdown from 'react-markdown';

// Enhanced helper to format answers for markdown: bold headings, number main points, letter subpoints, dash for further subpoints, and add spacing
function formatBullets(text: string) {
  const lines = text.split(/\n+/).filter(Boolean);
  let mainCount = 1;
  let subCount = 0;
  let subSubCount = 0;
  let result: string[] = [];
  let lastWasMain = false;
  let lastWasSub = false;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    // Heading: line ends with a colon (e.g., 'Elasticity:')
    if (/^[A-Z][^:]*:$/i.test(trimmed)) {
      // If not the first line, add a blank line before a new heading for clarity
      if (result.length > 0) result.push('');
      result.push(`**${trimmed}**`);
      lastWasMain = false;
      lastWasSub = false;
    }
    // Main bullet: starts with "•" or "- " or is a definition line after a heading
    else if (/^•|^- /.test(trimmed) || (lastWasMain === false && !/^\s/.test(line) && trimmed.length > 0)) {
      if (result.length > 0 && !/^\*\*.*\*\*$/.test(result[result.length-1])) result.push(''); // blank line before new main point
      result.push(`${mainCount}. ${trimmed.replace(/^•\s*|^- /, '')}`);
      mainCount++;
      subCount = 0;
      subSubCount = 0;
      lastWasMain = true;
      lastWasSub = false;
    }
    // Subpoint: indented or starts with "  -"
    else if (/^\s{2,}- /.test(line)) {
      subCount++;
      const letter = String.fromCharCode(96 + subCount); // a, b, c, ...
      result.push(`    ${letter}. ${trimmed.replace(/^\s*- /, '')}`);
      subSubCount = 0;
      lastWasSub = true;
    }
    // Further subpoint: more indented or starts with "    -"
    else if (/^\s{4,}- /.test(line)) {
      subSubCount++;
      result.push(`        - ${trimmed.replace(/^\s*- /, '')}`);
    }
    // Note or plain text (not numbered)
    else {
      result.push(trimmed);
      lastWasMain = false;
      lastWasSub = false;
    }
  });
  return result.join('\n');
}

export const ExamChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your exam prep assistant. What would you like to study today?" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || loading) return;
    const userMessage = message;
    setMessages(prev => [
      ...prev,
      { role: 'user', content: userMessage }
    ]);
    setMessage('');
    setLoading(true);
    try {
      // Add a temporary 'thinking...' message
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Thinking...' }
      ]);
      const response = await examService.queryModel(userMessage);
      setMessages(prev => [
        ...prev.slice(0, -1), // Remove 'Thinking...'
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev.slice(0, -1), // Remove 'Thinking...'
        { role: 'assistant', content: 'Sorry, I could not get an answer. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resource Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-matrix/50" />
        <input
          type="text"
          placeholder="Search study resources..."
          className="w-full bg-black/50 border border-matrix/30 rounded-lg pl-12 pr-4 py-3 text-matrix placeholder-matrix/30 focus:outline-none focus:border-matrix/50 font-code"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code">
          <Book className="w-5 h-5" />
          <span>Study Materials</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code">
          <Brain className="w-5 h-5" />
          <span>Practice Tests</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="h-[400px] overflow-y-auto space-y-4 pr-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-lg ${
              msg.role === 'user'
                ? 'bg-matrix/10 text-matrix border border-matrix/30'
                : 'bg-black/50 text-matrix/90 border border-matrix/20'
            } font-code`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-invert">
                  <ReactMarkdown>{formatBullets(msg.content)}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex space-x-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything about your studies..."
          className="flex-1 bg-black/50 border border-matrix/30 rounded-lg px-4 py-3 text-matrix placeholder-matrix/30 focus:outline-none focus:border-matrix/50 font-code"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || loading}
          className="px-6 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-code"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
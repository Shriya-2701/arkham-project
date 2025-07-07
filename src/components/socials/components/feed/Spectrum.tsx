import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Newspaper, ArrowLeft, ArrowRight, Filter } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  bias: 'left' | 'center' | 'right' | '';
  summary: string;
  image: string;
  perspectives: string[];
  confidence?: number;
  topics?: string[];
  topic_weights?: number[];
  top_keywords?: string[];
}

const initialArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'New Economic Policy Sparks Debate',
    source: 'The Daily Observer',
    bias: '',
    summary: 'A comprehensive analysis of the recently proposed economic policy and its potential impacts.',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop',
    perspectives: [
      'Policy could stimulate economic growth',
      'Concerns about long-term sustainability',
      'Impact on different socioeconomic groups'
    ]
  },
  {
    id: '2',
    title: 'Environmental Regulations Under Review',
    source: 'Metro Times',
    bias: '',
    summary: 'Discussion of proposed changes to environmental protection measures.',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=400&fit=crop',
    perspectives: [
      'Strengthening environmental protections',
      'Economic impact on industries',
      'Alternative policy proposals'
    ]
  }
];

export const Spectrum = () => {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [filter, setFilter] = useState<'all' | 'left' | 'center' | 'right'>('all');

  useEffect(() => {
    const fetchData = async () => {
      const updated = await Promise.all(
        articles.map(async (article) => {
          try {
            const res = await axios.post('https://spectrum-api-343916782787.us-central1.run.app/predict_political', {
              headline: article.title
            });

            const { political_leaning, confidence, topics, topic_weights, top_keywords } = res.data;

            return {
              ...article,
              bias: political_leaning || '',
              confidence,
              topics,
              topic_weights,
              top_keywords
            };
          } catch (error) {
            console.error('API error:', error);
            return article;
          }
        })
      );

      setArticles(updated);
    };

    fetchData();
  }, []);

  const filteredArticles = filter === 'all' ? articles : articles.filter((a) => a.bias === filter);

  const getBadgeColor = (bias: string) => {
    switch (bias) {
      case 'left':
        return 'bg-blue-500/10 text-blue-400';
      case 'right':
        return 'bg-red-500/10 text-red-400';
      case 'center':
        return 'bg-gray-500/10 text-gray-400';
      default:
        return 'bg-white/10 text-white/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white/60" />
            <span className="text-white">View Perspective</span>
          </div>
          <div className="flex space-x-2">
            {['all', 'left', 'center', 'right'].map((val) => (
              <button
                key={val}
                onClick={() => setFilter(val as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === val
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {val === 'all' ? 'All' : val === 'left' ? <ArrowLeft className="w-4 h-4" /> : val === 'center' ? <Newspaper className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-6">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-black/40 backdrop-blur-xl rounded-lg overflow-hidden border border-white/5">
            <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl text-white">{article.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${getBadgeColor(article.bias)}`}>
                  {article.source}
                </span>
              </div>

              <p className="text-white/80">{article.summary}</p>

              {article.bias && (
                <div className="text-white/70 text-sm">
                  <strong className="text-white">Predicted Bias:</strong> {article.bias.toUpperCase()} |{' '}
                  <strong className="text-white">Confidence:</strong> {(article.confidence || 0).toFixed(2)}
                </div>
              )}

              {article.top_keywords && article.top_keywords.length > 0 && (
                <div className="text-white/70 text-sm">
                  <strong className="text-white">Keywords:</strong> {article.top_keywords.join(', ')}
                </div>
              )}

              {article.topics && article.topic_weights && (
                <div className="text-white/70 text-sm">
                  <strong className="text-white">Topics:</strong>
                  <ul className="list-disc pl-6">
                    {article.topics.map((topic, index) => (
                      <li key={index}>
                        {topic} - {(article.topic_weights?.[index] || 0 * 100).toFixed(1)}%
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2 pt-4">
                <h4 className="text-white/60">Key Perspectives</h4>
                {article.perspectives.map((perspective, index) => (
                  <p key={index} className="text-white/80 text-sm">• {perspective}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
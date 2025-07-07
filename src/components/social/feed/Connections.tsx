import React, { useEffect, useState } from 'react';
import { Users, Heart, Activity, Brain } from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  avatar: string;
  relationship: string;
  strength: number;
  interactions: number;
  insights: string[];
}

const fallbackConnections: Connection[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
    relationship: 'Close Friend',
    strength: 85,
    interactions: 120,
    insights: [
      'Strong emotional support dynamic',
      'Shared creative interests',
      'Regular meaningful conversations'
    ]
  },
  {
    id: '2',
    name: 'Marcus Stone',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    relationship: 'Mentor',
    strength: 92,
    interactions: 45,
    insights: [
      'Professional guidance relationship',
      'Knowledge sharing focus',
      'Growth-oriented interactions'
    ]
  }
];

export const Connections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    const fetchStrengths = async () => {
      try {
        const responses = await Promise.all(
          fallbackConnections.map(async (conn) => {
            const body = {
              individual_id: '1',
              connected_to_id: conn.id,
              relationship_type: conn.relationship || 'Friend',
              strength_score: Math.random().toFixed(2), // mocked value
              sentiment_score: (Math.random() * 1).toFixed(2), // mocked value
            };

            const res = await fetch('https://connection-api-343916782787.us-central1.run.app/predict_relationship_strength', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(`Status ${res.status}`);

            const result = await res.json();

            return {
              ...conn,
              strength: result.strength ?? conn.strength,
              insights: result.insights ?? conn.insights,
              interactions: result.interactions ?? conn.interactions,
            };
          })
        );

        setConnections(responses);
      } catch (err) {
        console.error('API fetch failed, using fallback data. Error:', err);
        setConnections(fallbackConnections);
      }
    };

    fetchStrengths();
  }, []);

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-white/60" />
            <span className="text-white/60">Total Connections</span>
          </div>
          <div className="text-2xl text-white">{connections.length}</div>
        </div>
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-white/60" />
            <span className="text-white/60">Close Relations</span>
          </div>
          <div className="text-2xl text-white">
            {connections.filter((c) => c.relationship.toLowerCase().includes('close')).length}
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-white/60" />
            <span className="text-white/60">Active This Week</span>
          </div>
          <div className="text-2xl text-white">
            {Math.floor(connections.length / 2) + 1}
          </div>
        </div>
      </div>

      {/* Connections List */}
      <div className="space-y-4">
        {connections.map((connection) => (
          <div key={connection.id} className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5">
            <div className="flex items-start space-x-4">
              <img
                src={connection.avatar}
                alt={connection.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-white">{connection.name}</h3>
                    <p className="text-white/60">{connection.relationship}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white">{connection.strength}% Strength</div>
                    <p className="text-white/60">{connection.interactions} interactions</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-4 h-4 text-white/60" />
                    <span className="text-white/60">Relationship Insights</span>
                  </div>
                  <div className="space-y-1">
                    {connection.insights.map((insight, index) => (
                      <p key={index} className="text-white/80 text-sm">• {insight}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
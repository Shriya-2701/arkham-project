import React from 'react';
import { Box, Glasses, Gamepad2, Brain, Cpu, Globe, Users } from 'lucide-react';

interface CreativePost {
  id: string;
  type: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  likes: number;
  shares: number;
}

const creativePosts: CreativePost[] = [
    {
      id: '1',
      type: 'music',
      title: 'Neural Symphony Generator',
      description: 'Create complex musical compositions with emotional intelligence',
      imageUrl: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg',
      author: 'MusicMind',
      likes: 1234,
      shares: 456
    },
    {
      id: '2',
      type: 'podcast',
      title: 'AI Story Narrator',
      description: 'Generate engaging audio stories with multiple character voices',
      imageUrl: 'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg',
      author: 'StoryTeller',
      likes: 892,
      shares: 234
    },
    {
      id: '3',
      type: 'mindmap',
      title: 'Idea Visualizer',
      description: 'Transform your thoughts into structured visual maps',
      imageUrl: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg',
      author: 'MindMapper',
      likes: 567,
      shares: 123
    },
    {
      id: '4',
      type: 'video',
      title: 'Neural Video Studio',
      description: 'Create stunning videos with AI-powered effects',
      imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
      author: 'VideoArtist',
      likes: 789,
      shares: 345
    },
    {
      id: '5',
      type: 'voice',
      title: 'Voice Synthesis Lab',
      description: 'Generate realistic voices for any content',
      imageUrl: 'https://images.pexels.com/photos/3779662/pexels-photo-3779662.jpeg',
      author: 'VoiceLab',
      likes: 654,
      shares: 234
    },
    {
      id: '6',
      type: 'image',
      title: 'DeepArt Studio',
      description: 'Create stunning visuals with neural networks',
      imageUrl: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg',
      author: 'ArtistAI',
      likes: 932,
      shares: 445
    }
];

const immersiveTools = [
    {
      icon: Box,
      title: 'Virtual Production',
      desc: 'Create cinematic content with Unreal Engine 5',
      image: 'https://images.pexels.com/photos/7887800/pexels-photo-7887800.jpeg',
      comingSoon: true
    },
    {
      icon: Glasses,
      title: 'AR/XR Studio',
      desc: 'Create augmented and mixed reality experiences',
      image: 'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg',
      comingSoon: true
    },
    {
      icon: Gamepad2,
      title: 'Metahuman Creator',
      desc: 'Design photorealistic digital humans',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
      comingSoon: true
    },
    {
      icon: Brain,
      title: 'Digital City Builder',
      desc: 'Create vast, interactive urban environments',
      image: 'https://images.pexels.com/photos/1036657/pexels-photo-1036657.jpeg',
      comingSoon: true
    },
    {
      icon: Cpu,
      title: 'Neural Engine',
      desc: 'AI-powered physics and behavior simulation',
      image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg',
      comingSoon: true
    },
    {
      icon: Globe,
      title: 'Holographic Lab',
      desc: 'Design interactive holographic content',
      image: 'https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg',
      comingSoon: true
    }
];

const SocialMedia = () => {
  return (
 <div className="section-container relative bg-black" >
      <div className="video-background absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="video-bg"
          onError={(e) => console.error("Video failed to load:", e)}
          onCanPlay={() => console.log("Video can play")}
          onLoadedData={() => console.log("Video loaded")}
        >
          <source src="/social1.mp4" type="video/mp4" />
          <p>Your browser doesn't support HTML video.</p>
        </video>
      </div>
      <div className="video-overlay absolute inset-0 bg-black bg-opacity-50 z-10"></div>

   <div className="section-content max-w-7xl mx-auto px-4">
    
        <div className="glass rounded-lg p-8 md:p-12 border border-white/5">
        <div className="section-container relative min-h-scree bg-black text-white" >
      <div className="video-background fixed top-0 left-0 w-full h-full z-0 overflow-hidden absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="video-bg"
          onError={(e) => console.error("Video failed to load:", e)}
          onCanPlay={() => console.log("Video can play")}
          onLoadedData={() => console.log("Video loaded")}
        >
          <source src="/social1.mp4" type="video/mp4" />
          <p>Your browser doesn't support HTML video.</p>
        </video>
      </div>
      <div className="video-overlay absolute inset-0 bg-black bg-opacity-50 z-10"></div>
          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 text-white mr-4" />
            <h2 className="section-title">Creative Hub</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {creativePosts.map(post => (
              <div key={post.id} className="glass bg-black/40 overflow-hidden border border-white/5 group">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-48 object-cover filter grayscale contrast-125 sepia brightness-75 hue-rotate-180"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-cinzel uppercase tracking-wider text-white/70">{post.type}</span>
                    <span className="text-sm text-white/50">{post.author}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-cinzel">{post.title}</h3>
                  <p className="text-white/70 mb-4">{post.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-white/50">
                      <span className="text-sm">❤️ {post.likes}</span>
                      <span className="text-sm">🔄 {post.shares}</span>
                    </div>
                    <button className="cta-button px-4 py-2 text-sm">
                      Try Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <h2 className="section-title text-center mb-12">Immersive Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {immersiveTools.map((tool, index) => (
                <div key={index} className="relative group glass overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img 
                    src={tool.image}
                    alt={tool.title}
                    className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex items-center space-x-3 mb-2">
                      <tool.icon className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-bold font-cinzel">{tool.title}</h3>
                    </div>
                    <p className="text-white/70 mb-4">{tool.desc}</p>
                    {tool.comingSoon ? (
                      <span className="inline-block bg-white/10 text-white/70 px-4 py-2 rounded-none border border-white/20 font-cinzel uppercase tracking-wider text-sm">
                        Coming Soon
                      </span>
                    ) : (
                      <button className="cta-button">
                        Launch Tool
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-6xl mx-auto px-4 pt-10">
  <div className="w-full h-49 rounded-2xl overflow-hidden shadow-2xl">
    <video
      autoPlay
      controls
      loop
      playsInline
      preload="auto"
      className="w-full h-full object-cover rounded-2xl"
    >
      <source src="/lay_socialbottom.mp4" type="video/mp4" />
      <p>Your browser doesn't support HTML video.</p>
    </video>
  </div>
</div>

        </div>
      </div>
      
    </div>
    </div>
    
  );
};

export default SocialMedia;
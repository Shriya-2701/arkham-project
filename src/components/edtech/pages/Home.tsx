{/*import React from 'react';
import { Watch, Brain, Trophy, Clock, Heart, Book, Skull, Sparkles } from 'lucide-react';

const Home = () => {
  return (
     
    <div className="relative min-h-screen bg-black">
      {/* Animated Background with Smoke Effect
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683311-eeb2f49a8532?w=1920')] bg-cover bg-center opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-24">
        {/* Hero Section 
        <section className="text-center space-y-8">
          <div className="inline-block">
            <h1 className="text-6xl font-crimson text-silver mb-2 tracking-wider">
              The Dark Archives
            </h1>
            <div className="h-1 bg-gradient-to-r from-crimson to-transparent" />
          </div>
          <p className="text-2xl text-silver/80 max-w-3xl mx-auto font-crimson italic">
           The home of Gothic Academia
          </p>
          <div className="flex justify-center gap-6">
            <button className="px-8 py-4 bg-black/50 text-silver border border-crimson/30 rounded-lg hover:bg-crimson/10 transition-all group">
              <span className="relative font-crimson tracking-wider">
                Become a member
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-crimson transform scale-x-0 transition-transform group-hover:scale-x-100" />
              </span>
            </button>
            <button className="px-8 py-4 bg-black/30 text-silver/70 border border-silver/20 rounded-lg hover:text-silver transition-all font-crimson tracking-wider">
              Explore our learning platform
            </button>
          </div>
        </section>

        {/* Features Grid 
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group">
            <div className="h-[220px] flex flex-col justify-between bg-black/60 backdrop-blur-sm border border-crimson/20 rounded-lg p-8 transition-all hover:shadow-[0_0_15px_rgba(139,0,0,0.2)]">
              <Skull className="w-12 h-12 text-crimson mb-6 group-hover:animate-pulse" />
              <h3 className="text-2xl text-silver font-crimson mb-4">The Cityhall Library</h3>
              <p className="text-silver/70 font-crimson">
               Explore our Collection
              </p>
            </div>
          </div>
          <div className="group">
            <div className="h-[220px] flex flex-col justify-between bg-black/60 backdrop-blur-sm border border-crimson/20 rounded-lg p-8 transition-all hover:shadow-[0_0_15px_rgba(139,0,0,0.2)]">
              <Book className="w-12 h-12 text-crimson mb-6 group-hover:animate-pulse" />
              <h3 className="text-2xl text-silver font-crimson mb-4">Arkham Files</h3>
              <p className="text-silver/70 font-crimson">
              Explore the Case Files
              </p>
            </div>
          </div>
          <div className="group">
            <div className="h-[220px] flex flex-col justify-between bg-black/60 backdrop-blur-sm border border-crimson/20 rounded-lg p-8 transition-all hover:shadow-[0_0_15px_rgba(139,0,0,0.2)]">
              <Sparkles className="w-12 h-12 text-crimson mb-6 group-hover:animate-pulse" />
              <h3 className="text-2xl text-silver font-crimson mb-4">Digital Archives</h3>
              <p className="text-silver/70 font-crimson">
               Access our library from anywhere
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section 
        <section className="bg-black/60 backdrop-blur-sm border border-crimson/20 rounded-lg p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Clock className="w-8 h-8 text-crimson mx-auto mb-4" />
              <div className="text-4xl text-silver font-crimson mb-2">2,500+</div>
              <div className="text-silver/60 font-crimson">Dark Tomes</div>
            </div>
            <div className="text-center">
              <Brain className="w-8 h-8 text-crimson mx-auto mb-4" />
              <div className="text-4xl text-silver font-crimson mb-2">98%</div>
              <div className="text-silver/60 font-crimson">Enlightenment Rate</div>
            </div>
            <div className="text-center">
              <Trophy className="w-8 h-8 text-crimson mx-auto mb-4" />
              <div className="text-4xl text-silver font-crimson mb-2">150+</div>
              <div className="text-silver/60 font-crimson">Dark Scholars</div>
            </div>
            <div className="text-center">
              <Heart className="w-8 h-8 text-crimson mx-auto mb-4" />
              <div className="text-4xl text-silver font-crimson mb-2">4.9/5</div>
              <div className="text-silver/60 font-crimson">Soul Satisfaction</div>
            </div>
          </div>
        </section>
      </div>
   </div>
  

  );
};

export default Home;*/}
import React from 'react';
import {
  Watch, Brain, Trophy, Clock, Heart, Book, Skull, Sparkles
} from 'lucide-react';

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🎥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-15"
      >
        <source src="/Ed_homebg.mp4" type="video/mp4" />
      </video>

      {/* 🖤 Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* 🔮 Page Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-12 space-y-24">

        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="inline-block">
            <h1 className="text-6xl font-crimson text-silver mb-2 tracking-wider">
              The Dark Archives
            </h1>
            <div className="h-1 bg-gradient-to-r from-crimson to-transparent" />
          </div>
          <p className="text-2xl text-silver/80 max-w-3xl mx-auto font-crimson italic">
            The home of Gothic Academia
          </p>
          <div className="flex justify-center gap-6">
            <button className="px-8 py-4 bg-black/50 text-silver border border-crimson/30 rounded-lg hover:bg-crimson/10 transition-all group">
              <span className="relative font-crimson tracking-wider">
                Become a member
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-crimson transform scale-x-0 transition-transform group-hover:scale-x-100" />
              </span>
            </button>
            <button className="px-8 py-4 bg-black/30 text-silver/70 border border-silver/20 rounded-lg hover:text-silver transition-all font-crimson tracking-wider">
              Explore our learning platform
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group">
            <div className="h-[220px] flex flex-col justify-between bg-black/60 backdrop-blur-sm border border-crimson/20 rounded-lg p-8 transition-all hover:shadow-[0_0_15px_rgba(139,0,0,0.2)]">
              <Skull className="w-12 h-12 text-crimson mb-6 group-hover:animate-pulse" />
              <h3 className="text-2xl text-silver font-crimson mb-4">The Cityhall Library</h3>
              <p className="text-silver/70 font-crimson">Explore our Collection</p>
            </div>
          </div>
          <div className="group">
            <div className="h-[220px] flex flex-col justify-between bg-black/60 backdrop-blur-sm border border-crimson/20 rounded-lg p-8 transition-all hover:shadow-[0_0_15px_rgba(139,0,0,0.2)]">
              <Book className="w-12 h-12 text-crimson mb-6 group-hover:animate-pulse" />
              <h3 className="text-2xl text-silver font-crimson mb-4">Arkham Files</h3>
              <p className="text-silver/70 font-crimson">Explore the Case Files</p>
            </div>
          </div>
          <div className="group">
            <div className="h-[220px] flex flex-col justify-between bg-black/60 backdrop-blur-sm border border-crimson/20 rounded-lg p-8 transition-all hover:shadow-[0_0_15px_rgba(139,0,0,0.2)]">
              <Sparkles className="w-12 h-12 text-crimson mb-6 group-hover:animate-pulse" />
              <h3 className="text-2xl text-silver font-crimson mb-4">Digital Archives</h3>
              <p className="text-silver/70 font-crimson">Access our library from anywhere</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-black/60 backdrop-blur-sm border border-crimson/20 rounded-lg p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Clock className="w-8 h-8 text-crimson mx-auto mb-4" />
              <div className="text-4xl text-silver font-crimson mb-2">2,500+</div>
              <div className="text-silver/60 font-crimson">Dark Tomes</div>
            </div>
            <div className="text-center">
              <Brain className="w-8 h-8 text-crimson mx-auto mb-4" />
              <div className="text-4xl text-silver font-crimson mb-2">98%</div>
              <div className="text-silver/60 font-crimson">Enlightenment Rate</div>
            </div>
            <div className="text-center">
              <Trophy className="w-8 h-8 text-crimson mx-auto mb-4" />
              <div className="text-4xl text-silver font-crimson mb-2">150+</div>
              <div className="text-silver/60 font-crimson">Dark Scholars</div>
            </div>
            <div className="text-center">
              <Heart className="w-8 h-8 text-crimson mx-auto mb-4" />
              <div className="text-4xl text-silver font-crimson mb-2">4.9/5</div>
              <div className="text-silver/60 font-crimson">Soul Satisfaction</div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
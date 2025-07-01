/*import React, { useState } from "react";
import {
  Search,
  Filter,
  Play,
  Book,
  Film,
  Music,
  Heart,
  Eye,
  Clock,
  Star,
  Users,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";

interface ContentItem {
  id: number;
  title: string;
  type: "video" | "audio";
  duration: string;
  thumbnail: string;
  instructor: string;
  department: string;
  views: number;
  rating: number;
  description: string;
  tags: string[];
  preview: string;
}

interface Category {
  id: string;
  label: string;
  icon: typeof Book;
}

const Library: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null
  );
  const location = useLocation();

  console.log("Current location:", location.pathname);

  const categories: Category[] = [
    { id: "all", label: "All Content", icon: Book },
    { id: "video", label: "Video Lectures", icon: Film },
    { id: "audio", label: "Audio Content", icon: Music },
  ];

  const featuredContent: ContentItem[] = [
    {
      id: 1,
      title: "Shadows of Knowledge",
      type: "video",
      duration: "1:45:30",
      thumbnail:
        "https://images.unsplash.com/photo-1507915135761-41a0a222c709?w=800&h=400&fit=crop",
      instructor: "Prof. Raven Blackwood",
      department: "Dark Arts",
      views: 1250,
      rating: 4.8,
      description:
        "Delve into the depths of forbidden knowledge and ancient mysteries.",
      tags: ["occult", "history", "mythology"],
      preview: "https://example.com/video-preview.mp4",
    },
    {
      id: 2,
      title: "Echoes of the Past",
      type: "audio",
      duration: "45:20",
      thumbnail:
        "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=800&h=400&fit=crop",
      instructor: "Dr. Crimson Vale",
      department: "Gothic Studies",
      views: 980,
      rating: 4.9,
      description: "A haunting journey through the corridors of time.",
      tags: ["gothic", "history", "architecture"],
      preview: "https://example.com/audio-preview.mp3",
    },
  ];

  const newArrivals: ContentItem[] = [
    {
      id: 3,
      title: "Whispers in the Dark",
      type: "video",
      duration: "2:15:00",
      thumbnail:
        "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=400&fit=crop",
      instructor: "Lady Nightshade",
      department: "Paranormal Studies",
      views: 750,
      rating: 4.7,
      description: "Explore the mysteries that lurk in the shadows.",
      tags: ["paranormal", "investigation", "research"],
      preview: "https://example.com/video-preview2.mp4",
    },
  ];

  const popularContent: ContentItem[] = [
    {
      id: 4,
      title: "Gothic Architecture Through Ages",
      type: "video",
      duration: "3:20:15",
      thumbnail:
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=400&fit=crop",
      instructor: "Prof. Viktor Graves",
      department: "Architecture",
      views: 2150,
      rating: 4.9,
      description:
        "A comprehensive study of gothic architectural elements and their evolution.",
      tags: ["architecture", "history", "design"],
      preview: "https://example.com/video-preview3.mp4",
    },
  ];

  const handleModalClose = () => {
    setSelectedContent(null);
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  return (
    

 
    <div className="relative min-h-screen bg-black z-0">
      {/* Smoke Effect Background 
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1557683311-eeb2f49a8532?w=1920')] bg-cover bg-center opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black pointer-events-none" />
      </div>
      

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header 
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-serif text-white tracking-wider">
            The Archives
          </h1>
          
        </div>

        {/* Search and Filters 
        <div className="flex space-x-4 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search the darkness..."
              className="w-full bg-black/50 border border-white/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/50 transition-all font-serif"
            />
            <div className="absolute inset-0 shadow-[0_0_15px_rgba(192,192,192,0.1)] opacity-0 group-hover:opacity-100 pointer-events-none rounded-lg transition-opacity" />
          </div>
          <button className="px-6 py-2 bg-black/50 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-all flex items-center space-x-2 font-serif">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Featured Content 
        <section className="mb-16">
          <h2 className="text-2xl font-serif text-white mb-8">
            Featured
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredContent.map((content) => (
              <div
                key={content.id}
                onClick={() => setSelectedContent(content)}
                className="group cursor-pointer"
              >
                <div className="relative bg-black/60 rounded-lg overflow-hidden border border-white/20 transition-all hover:border-white/40">
                  <div className="relative aspect-video">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-16 h-16 rounded-full bg-white/20 border border-white/40 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white transform translate-x-0.5" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 rounded-full text-sm text-white font-serif">
                      {content.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl text-white font-serif mb-2">
                      {content.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70 font-serif">
                        {content.instructor}
                      </span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-white/70">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{content.views}</span>
                        </div>
                        <div className="flex items-center text-white/70">
                          <Star className="w-4 h-4 mr-1" />
                          <span>{content.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals 
        <section className="mb-16">
          <h2 className="text-2xl font-serif text-white mb-8">
            Fresh from the Crypt
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newArrivals.map((content) => (
              <div
                key={content.id}
                onClick={() => setSelectedContent(content)}
                className="group cursor-pointer"
              >
                <div className="bg-black/60 rounded-lg overflow-hidden border border-white/20 transition-all hover:border-white/40">
                  <div className="relative aspect-video">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg text-white font-serif mb-2">
                      {content.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>{content.instructor}</span>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{content.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Content
        <section>
          <h2 className="text-2xl font-serif text-white mb-8">
            Dark Favorites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularContent.map((content) => (
              <div
                key={content.id}
                onClick={() => setSelectedContent(content)}
                className="group cursor-pointer"
              >
                <div className="bg-black/60 rounded-lg overflow-hidden border border-white/20 transition-all hover:border-white/40">
                  <div className="relative aspect-video">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg text-white font-serif mb-2">
                      {content.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{content.views}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        <span>{content.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Modal 
        {selectedContent && (
        <div
  className={`fixed inset-0 flex items-center justify-center p-8 z-50 transition-opacity duration-300 ${
    selectedContent ? 'bg-black/90 pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
  }`}
  onClick={handleModalClick}
>
            <div
              className="bg-black/80 rounded-lg w-full max-w-4xl border border-silver/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <img
                  src={selectedContent.thumbnail}
                  alt={selectedContent.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleModalClose}
                  className="absolute top-4 right-4 text-silver/60 hover:text-silver w-8 h-8 flex items-center justify-center bg-black/50 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                    <Play className="w-10 h-10 text-white transform translate-x-1" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-2xl text-white font-serif mb-4">
                  {selectedContent.title}
                </h2>
                <p className="text-white/70 mb-6">
                  {selectedContent.description}
                </p>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-white font-serif mb-2">Instructor</h3>
                    <p className="text-white/70">
                      {selectedContent.instructor}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-serif mb-2">Department</h3>
                    <p className="text-white/70">
                      {selectedContent.department}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedContent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{selectedContent.views} views</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      <span>{selectedContent.rating} rating</span>
                    </div>
                  </div>
                  <button className="flex items-center space-x-2 text-red-400 hover:text-red-300">
                    <Heart className="w-5 h-5" />
                    <span>Add to Favorites</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
   
  
  );
};

export default Library;


*/
import React, { useState } from "react";
import {
  Search,
  Filter,
  Play,
  Book,
  Film,
  Music,
  Heart,
  Eye,
  Clock,
  Star,
  Users,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";

interface ContentItem {
  id: number;
  title: string;
  type: "video" | "audio";
  duration: string;
  thumbnail: string;
  instructor: string;
  department: string;
  views: number;
  rating: number;
  description: string;
  tags: string[];
  preview: string;
}

interface Category {
  id: string;
  label: string;
  icon: typeof Book;
}

const Library: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const location = useLocation();

  const categories: Category[] = [
    { id: "all", label: "All Content", icon: Book },
    { id: "video", label: "Video Lectures", icon: Film },
    { id: "audio", label: "Audio Content", icon: Music },
  ];

  const featuredContent: ContentItem[] = [
    {
      id: 1,
      title: "Shadows of Knowledge",
      type: "video",
      duration: "1:45:30",
      thumbnail: "https://images.unsplash.com/photo-1507915135761-41a0a222c709?w=800&h=400&fit=crop",
      instructor: "Prof. Raven Blackwood",
      department: "Dark Arts",
      views: 1250,
      rating: 4.8,
      description: "Delve into the depths of forbidden knowledge and ancient mysteries.",
      tags: ["occult", "history", "mythology"],
      preview: "https://example.com/video-preview.mp4",
    },
    {
      id: 2,
      title: "Echoes of the Past",
      type: "audio",
      duration: "45:20",
      thumbnail: "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=800&h=400&fit=crop",
      instructor: "Dr. Crimson Vale",
      department: "Gothic Studies",
      views: 980,
      rating: 4.9,
      description: "A haunting journey through the corridors of time.",
      tags: ["gothic", "history", "architecture"],
      preview: "https://example.com/audio-preview.mp3",
    },
  ];

  const newArrivals: ContentItem[] = [
    {
      id: 3,
      title: "Whispers in the Dark",
      type: "video",
      duration: "2:15:00",
      thumbnail: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=400&fit=crop",
      instructor: "Lady Nightshade",
      department: "Paranormal Studies",
      views: 750,
      rating: 4.7,
      description: "Explore the mysteries that lurk in the shadows.",
      tags: ["paranormal", "investigation", "research"],
      preview: "https://example.com/video-preview2.mp4",
    },
  ];

  const popularContent: ContentItem[] = [
    {
      id: 4,
      title: "Gothic Architecture Through Ages",
      type: "video",
      duration: "3:20:15",
      thumbnail: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=400&fit=crop",
      instructor: "Prof. Viktor Graves",
      department: "Architecture",
      views: 2150,
      rating: 4.9,
      description: "A comprehensive study of gothic architectural elements and their evolution.",
      tags: ["architecture", "history", "design"],
      preview: "https://example.com/video-preview3.mp4",
    },
  ];

  const handleModalClose = () => setSelectedContent(null);
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleModalClose();
  };

  return (
    <div className="relative min-h-screen overflow-hidden z-0">
      {/* 🎥 Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/Ed_librarybg.mp4" type="video/mp4" />
      </video>

      {/* 🖤 Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* 📚 Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-serif text-white tracking-wider">The Archives</h1>
        </div>

        {/* Search and Filters */}
        <div className="flex space-x-4 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search the darkness..."
              className="w-full bg-black/50 border border-white/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/50 transition-all font-serif"
            />
            <div className="absolute inset-0 shadow-[0_0_15px_rgba(192,192,192,0.1)] opacity-0 group-hover:opacity-100 pointer-events-none rounded-lg transition-opacity" />
          </div>
          <button className="px-6 py-2 bg-black/50 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-all flex items-center space-x-2 font-serif">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Featured Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif text-white mb-8">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredContent.map((content) => (
              <div key={content.id} onClick={() => setSelectedContent(content)} className="group cursor-pointer">
                <div className="relative bg-black/60 rounded-lg overflow-hidden border border-white/20 transition-all hover:border-white/40">
                  <div className="relative aspect-video">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-16 h-16 rounded-full bg-white/20 border border-white/40 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white transform translate-x-0.5" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 rounded-full text-sm text-white font-serif">
                      {content.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl text-white font-serif mb-2">{content.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70 font-serif">{content.instructor}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-white/70">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{content.views}</span>
                        </div>
                        <div className="flex items-center text-white/70">
                          <Star className="w-4 h-4 mr-1" />
                          <span>{content.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif text-white mb-8">Fresh from the Crypt</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newArrivals.map((content) => (
              <div key={content.id} onClick={() => setSelectedContent(content)} className="group cursor-pointer">
                <div className="bg-black/60 rounded-lg overflow-hidden border border-white/20 transition-all hover:border-white/40">
                  <div className="relative aspect-video">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg text-white font-serif mb-2">{content.title}</h3>
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>{content.instructor}</span>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{content.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Content */}
        <section>
          <h2 className="text-2xl font-serif text-white mb-8">Dark Favorites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularContent.map((content) => (
              <div key={content.id} onClick={() => setSelectedContent(content)} className="group cursor-pointer">
                <div className="bg-black/60 rounded-lg overflow-hidden border border-white/20 transition-all hover:border-white/40">
                  <div className="relative aspect-video">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg text-white font-serif mb-2">{content.title}</h3>
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{content.views}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        <span>{content.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Modal */}
        {selectedContent && (
          <div className="fixed inset-0 flex items-center justify-center p-8 z-50 bg-black/90" onClick={handleModalClick}>
            <div
              className="bg-black/80 rounded-lg w-full max-w-4xl border border-silver/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <img src={selectedContent.thumbnail} alt={selectedContent.title} className="w-full h-full object-cover" />
                <button
                  onClick={handleModalClose}
                  className="absolute top-4 right-4 text-silver/60 hover:text-silver w-8 h-8 flex items-center justify-center bg-black/50 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                    <Play className="w-10 h-10 text-white transform translate-x-1" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-2xl text-white font-serif mb-4">{selectedContent.title}</h2>
                <p className="text-white/70 mb-6">{selectedContent.description}</p>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-white font-serif mb-2">Instructor</h3>
                    <p className="text-white/70">{selectedContent.instructor}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-serif mb-2">Department</h3>
                    <p className="text-white/70">{selectedContent.department}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedContent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Library;
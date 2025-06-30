// src/components/BackgroundVideo.tsx
import React from "react";

interface BackgroundVideoProps {
  src: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ src }) => {
  return (
    <video
      className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      autoPlay
      muted
      loop
      playsInline
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default BackgroundVideo;
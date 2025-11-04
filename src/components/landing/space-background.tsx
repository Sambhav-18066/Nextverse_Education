"use client";

import React, { useEffect, useState } from 'react';

const Star = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="absolute rounded-full bg-white"
    style={{
      ...style,
      animation: `animate-stars ${parseFloat(style.animationDuration as string) * 2}s linear infinite`,
    }}
  />
);

const Meteor = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="pointer-events-none absolute h-0.5 w-20 top-1/2 -translate-y-1/2 transform rotate-[215deg]"
    style={style}
  >
    <div className="absolute top-0 right-0 h-full w-full rounded-[9999px] bg-gradient-to-l from-white to-transparent" />
  </div>
);

const SpaceBackground = () => {
  const [stars, setStars] = useState<React.CSSProperties[]>([]);
  const [meteors, setMeteors] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const generateStars = (count: number) => {
      const newStars = [];
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 2 + 0.5;
        newStars.push({
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${Math.random() * 2 + 1}s`,
          animationDelay: `${Math.random() * 2}s`,
        });
      }
      return newStars;
    };

    const generateMeteors = (count: number) => {
      const newMeteors = [];
      for (let i = 0; i < count; i++) {
        newMeteors.push({
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `animate-meteor ${Math.random() * 6 + 4}s linear infinite`,
          animationDelay: `${Math.random() * 10}s`,
        });
      }
      return newMeteors;
    };

    setStars(generateStars(100));
    setMeteors(generateMeteors(5));
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-background" />
      {stars.map((star, index) => (
        <Star key={index} style={star} />
      ))}
      {meteors.map((meteor, index) => (
        <Meteor key={index} style={meteor} />
      ))}
    </div>
  );
};

export default SpaceBackground;

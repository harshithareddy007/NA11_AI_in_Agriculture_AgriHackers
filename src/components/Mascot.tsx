import React from 'react';
import { Leaf, Heart, AlertCircle } from 'lucide-react';

interface MascotProps {
  mood?: 'happy' | 'sad' | 'thinking' | 'celebrating';
  size?: 'sm' | 'md' | 'lg';
}

export const Mascot: React.FC<MascotProps> = ({ mood = 'happy', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const moodColors = {
    happy: 'text-organic',
    sad: 'text-muted-foreground',
    thinking: 'text-warning',
    celebrating: 'text-accent'
  };

  const moodAnimations = {
    happy: 'mascot-bounce',
    sad: '',
    thinking: 'animate-pulse',
    celebrating: 'confetti'
  };

  return (
    <div className={`inline-flex items-center justify-center ${sizeClasses[size]} ${moodColors[mood]} ${moodAnimations[mood]}`}>
      {mood === 'happy' && <Leaf className="w-full h-full" />}
      {mood === 'sad' && <AlertCircle className="w-full h-full" />}
      {mood === 'thinking' && <Leaf className="w-full h-full animate-pulse" />}
      {mood === 'celebrating' && <Heart className="w-full h-full" />}
    </div>
  );
};
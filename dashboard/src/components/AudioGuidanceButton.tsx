import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speechTts } from '../services/speechTts';

interface AudioGuidanceButtonProps {
  spokenText: string;
  phoneticText?: string;
  langCode?: string;
  label?: string;
  playingLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AudioGuidanceButton: React.FC<AudioGuidanceButtonProps> = ({
  spokenText,
  phoneticText,
  langCode,
  label = 'सुनें (Listen)',
  playingLabel = 'बोल रहे हैं... (Playing)',
  size = 'md',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    setIsPlaying(true);
    speechTts.speak(spokenText, langCode, phoneticText);
    // Approximate playback indicator
    setTimeout(() => {
      setIsPlaying(false);
    }, 4500);
  };

  const isMuted = speechTts.getIsMuted();

  return (
    <button
      type="button"
      onClick={handleSpeak}
      disabled={isMuted}
      aria-label="Play audio guidance"
      className={`inline-flex items-center gap-2 rounded-xl font-bold transition-saathi border ${
        isPlaying
          ? 'bg-saathi-teal text-white border-saathi-teal shadow-md animate-pulse'
          : 'bg-saathi-paleMint text-saathi-teal border-saathi-teal/40 hover:bg-saathi-softMint/40'
      } ${
        size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-5 py-3 text-lg' : 'px-4 py-2 text-sm'
      } ${className}`}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-gray-400" />
      ) : (
        <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
      )}
      <span>{isPlaying ? playingLabel : label}</span>
    </button>
  );
};

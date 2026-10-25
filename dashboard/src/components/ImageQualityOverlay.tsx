import React from 'react';
import { Camera, CheckCircle2, AlertTriangle, SunMedium, Move, ShieldAlert } from 'lucide-react';
import { AudioGuidanceButton } from './AudioGuidanceButton';

interface ImageQualityOverlayProps {
  isAnalyzing: boolean;
  isCaptured: boolean;
  qualityPassed: boolean;
  feedbackEn: string;
  feedbackHi: string;
  audioText: string;
  onCapture: () => void;
  onRetake: () => void;
  onProceed: () => void;
}

export const ImageQualityOverlay: React.FC<ImageQualityOverlayProps> = ({
  isAnalyzing,
  isCaptured,
  qualityPassed,
  feedbackEn,
  feedbackHi,
  audioText,
  onCapture,
  onRetake,
  onProceed,
}) => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border-2 border-saathi-navy shadow-lg">
      {/* Viewport Simulation */}
      <div className="relative aspect-video sm:aspect-[4/3] bg-gradient-to-b from-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
        {/* Reticle / Framing Target */}
        <div className="absolute inset-8 border-2 border-dashed border-white/30 rounded-2xl pointer-events-none flex items-center justify-center">
          <div className="w-12 h-12 border-t-2 border-l-2 border-saathi-softMint absolute top-2 left-2"></div>
          <div className="w-12 h-12 border-t-2 border-r-2 border-saathi-softMint absolute top-2 right-2"></div>
          <div className="w-12 h-12 border-b-2 border-l-2 border-saathi-softMint absolute bottom-2 left-2"></div>
          <div className="w-12 h-12 border-b-2 border-r-2 border-saathi-softMint absolute bottom-2 right-2"></div>
        </div>

        {!isCaptured && !isAnalyzing ? (
          <div className="z-10 space-y-3">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-full inline-block">
              <Camera className="w-10 h-10 text-saathi-softMint animate-pulse" />
            </div>
            <div>
              <p className="text-base font-bold text-white">कैमरे को 15 सेमी की दूरी पर स्थिर रखें</p>
              <p className="text-xs text-white/70 mt-1">पर्याप्त प्राकृतिक रोशनी में फोटो खींचें • Hold steady in natural light</p>
            </div>
            <div className="flex justify-center gap-3 text-xs text-saathi-softMint">
              <span className="flex items-center gap-1"><SunMedium className="w-3.5 h-3.5" /> अच्छी रोशनी</span>
              <span className="flex items-center gap-1"><Move className="w-3.5 h-3.5" /> हाथ स्थिर रखें</span>
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="z-10 space-y-3">
            <div className="w-10 h-10 border-4 border-saathi-softMint border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-saathi-softMint">ऑन-डिवाइस गुणवत्ता जांच (Checking Blur & Lighting)...</p>
          </div>
        ) : (
          <div className="z-10 space-y-3 max-w-sm">
            {qualityPassed ? (
              <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-full inline-block">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
            ) : (
              <div className="p-3 bg-amber-500/20 text-amber-300 rounded-full inline-block">
                <AlertTriangle className="w-12 h-12 text-amber-400" />
              </div>
            )}
            <div>
              <h4 className={`text-lg font-bold ${qualityPassed ? 'text-emerald-300' : 'text-amber-300'}`}>
                {qualityPassed ? 'फ़ोटो गुणवत्ता सत्यापित (Quality Validated)' : 'फ़ोटो पुनः लेने की आवश्यकता (Retake Needed)'}
              </h4>
              <p className="text-sm text-white/90 mt-1 font-medium">{feedbackHi}</p>
              <p className="text-xs text-white/60 mt-0.5">{feedbackEn}</p>
            </div>
          </div>
        )}

        {/* Audio prompt trigger in viewport */}
        <div className="absolute top-4 right-4 z-20">
          <AudioGuidanceButton spokenText={audioText} size="sm" />
        </div>
      </div>

      {/* Control Action Buttons */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
        {!isCaptured ? (
          <button
            type="button"
            onClick={onCapture}
            disabled={isAnalyzing}
            className="w-full py-3.5 bg-saathi-teal hover:bg-teal-600 active:scale-98 text-white font-bold rounded-xl text-base flex items-center justify-center gap-2 shadow-lg transition-saathi"
          >
            <Camera className="w-5 h-5" />
            फ़ोटो खींचें (Capture Image)
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onRetake}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-saathi"
            >
              दोबारा फ़ोटो लें (Retake)
            </button>
            <button
              type="button"
              onClick={onProceed}
              disabled={!qualityPassed}
              className={`flex-1 py-3 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-saathi shadow-md ${
                qualityPassed
                  ? 'bg-saathi-teal hover:bg-teal-600 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              परिणाम देखें (Review Result)
            </button>
          </>
        )}
      </div>
    </div>
  );
};

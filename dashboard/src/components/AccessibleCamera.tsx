import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  CameraOff,
  SwitchCamera,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  SunMedium,
  Move,
  Info,
  Sparkles,
  HelpCircle,
  Eye,
} from 'lucide-react';
import {
  evaluateCanvasQuality,
  generateSyntheticClinicalSample,
  QualityMetricsResult,
} from '../services/imageQuality';
import { speechTts } from '../services/speechTts';
import { getTranslation } from '../services/localization';

export interface AccessibleCameraProps {
  onCapture: (imageDataUrl: string, quality: QualityMetricsResult) => void;
  activeLanguage?: string;
  guideTitle?: string;
  guideSubtitle?: string;
  allowFileUpload?: boolean;
  allowPresetSamples?: boolean;
  reticleType?: 'lesion' | 'retina' | 'portrait';
  autoStart?: boolean;
  initialFacingMode?: 'environment' | 'user';
}

export const AccessibleCamera: React.FC<AccessibleCameraProps> = ({
  onCapture,
  activeLanguage = 'hi',
  guideTitle,
  guideSubtitle,
  allowFileUpload = true,
  allowPresetSamples = true,
  reticleType = 'lesion',
  autoStart = true,
  initialFacingMode = 'environment',
}) => {
  const t = getTranslation(activeLanguage);

  // Camera stream & status state
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'requesting' | 'active' | 'blocked' | 'unsupported'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(initialFacingMode);

  // Capture & quality states
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [qualityResult, setQualityResult] = useState<QualityMetricsResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSamplesMenu, setShowSamplesMenu] = useState<boolean>(false);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stop current active media stream tracks
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start hardware camera stream via WebRTC
  const startCamera = async (targetFacing: 'environment' | 'user' = facingMode) => {
    stopStream();
    setErrorMessage(null);
    setCameraStatus('requesting');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('unsupported');
      setErrorMessage(
        'आपका ब्राउज़र या कनेक्शन सीधे वेबकैम का समर्थन नहीं करता है (HTTPS आवश्यक हो सकता है)। कृपया फ़ोटो अपलोड करें।'
      );
      return;
    }

    try {
      let stream: MediaStream;
      try {
        // Preferred exact/ideal constraint
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: targetFacing },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (firstErr) {
        // Fallback to generic video constraint if facingMode is unsupported on desktop webcams
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraStatus('active');
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraStatus('blocked');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage(
          'कैमरा अनुमति अस्वीकृत है (Permission Blocked)। कृपया अपने ब्राउज़र के एड्रेस बार में लॉक/कैमरा आइकॉन पर क्लिक करके अनुमति दें।'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('इस डिवाइस पर कोई कैमरा नहीं मिला। कृपया नीचे से फ़ोटो अपलोड करें या नमूना चुनें।');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorMessage('कैमरा वर्तमान में किसी अन्य ऐप या टैब द्वारा उपयोग किया जा रहा है।');
      } else {
        setErrorMessage(`कैमरा शुरू करने में समस्या आई (${err.message || 'Error'})। फ़ोटो अपलोड विकल्प का उपयोग करें।`);
      }
    }
  };

  // Flip facing mode (rear <-> front)
  const handleToggleFacingMode = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (cameraStatus === 'active' || cameraStatus === 'requesting') {
      startCamera(nextFacing);
    }
  };

  // Auto-start camera when mounted
  useEffect(() => {
    if (autoStart && !capturedImage) {
      startCamera(initialFacingMode);
    }
    return () => {
      stopStream();
    };
  }, []);

  // Capture frame from active live video
  const handleCaptureVideo = () => {
    if (!videoRef.current || cameraStatus !== 'active') return;

    setIsProcessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    // Mirror if front camera for natural intuitive selfie perspective
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const quality = evaluateCanvasQuality(canvas);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    stopStream();
    setCapturedImage(dataUrl);
    setQualityResult(quality);
    setIsProcessing(false);

    // Audio feedback
    if (quality.passed) {
      speechTts.speak(t.qualityValidated, activeLanguage);
    } else {
      speechTts.speak(
        quality.feedbackTextHi,
        activeLanguage,
        quality.feedbackTextEn
      );
    }
  };

  // Handle file upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = img.naturalWidth || 640;
        canvas.height = img.naturalHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const quality = evaluateCanvasQuality(canvas);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

          stopStream();
          setCapturedImage(dataUrl);
          setQualityResult(quality);
          setIsProcessing(false);

          if (quality.passed) {
            speechTts.speak(t.qualityValidated, activeLanguage);
          } else {
            speechTts.speak(quality.feedbackTextHi, activeLanguage, quality.feedbackTextEn);
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Load preset synthetic clinical test sample
  const handleSelectSample = (sampleType: 'LESION_AMBER' | 'PETECHIAE_RED' | 'NORMAL_SKIN' | 'RETINA_FUNDUS') => {
    setIsProcessing(true);
    setShowSamplesMenu(false);
    const dataUrl = generateSyntheticClinicalSample(sampleType);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const quality = evaluateCanvasQuality(canvas);
        stopStream();
        setCapturedImage(dataUrl);
        setQualityResult(quality);
        setIsProcessing(false);
        speechTts.speak(t.qualityValidated, activeLanguage);
      }
    };
    img.src = dataUrl;
  };

  // Reset and return to live camera stream
  const handleRetake = () => {
    setCapturedImage(null);
    setQualityResult(null);
    startCamera(facingMode);
  };

  // Confirm image and proceed
  const handleConfirm = () => {
    if (capturedImage && qualityResult) {
      onCapture(capturedImage, qualityResult);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex flex-col">
      {/* Offscreen Canvas for Snapshotting */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden Accessible File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="Upload photo from device"
      />

      {/* Top Status & Controls Header */}
      <div className="bg-slate-950 px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {cameraStatus === 'active' && !capturedImage ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-[10px]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              LIVE
            </span>
          ) : capturedImage ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
              <CheckCircle2 className="w-3 h-3" />
              CAPTURED
            </span>
          ) : (
            <span className="text-slate-400 font-medium">CAMERA</span>
          )}
          <span className="text-slate-300 font-bold">
            {capturedImage ? 'फ़ोटो पूर्वावलोकन (Preview)' : guideTitle || t.cameraDistanceGuide}
          </span>
        </div>

        {/* Action icons in top bar */}
        {!capturedImage && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleFacingMode}
              disabled={cameraStatus !== 'active'}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-saathi disabled:opacity-40"
              title={facingMode === 'environment' ? 'Switch to Front Camera' : 'Switch to Back Camera'}
              aria-label="Toggle camera orientation"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
            {allowFileUpload && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-saathi"
                title="Upload Photo from Device / Gallery"
                aria-label="Upload photo from files"
              >
                <Upload className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Viewport View */}
      <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
        {/* State 1: Active Live Video Stream */}
        {!capturedImage && (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className={`w-full h-full object-cover ${
              cameraStatus === 'active' ? 'block' : 'hidden'
            } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />
        )}

        {/* State 2: Captured Photo Preview */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured clinical subject"
            className="w-full h-full object-cover animate-fade-in"
          />
        )}

        {/* State 3: Live Framing Reticle Over Video */}
        {cameraStatus === 'active' && !capturedImage && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4">
            {/* Guide Text Banner */}
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-saathi-softMint flex items-center gap-1.5 border border-white/10 shadow-sm">
              <SunMedium className="w-3.5 h-3.5" />
              <span>{guideSubtitle || t.cameraLightingGuide}</span>
            </div>

            {/* Target Reticle based on screening pathway */}
            {reticleType === 'retina' ? (
              <div className="w-44 h-44 rounded-full border-2 border-dashed border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-center">
                <div className="w-6 h-6 border-t-2 border-l-2 border-amber-400"></div>
              </div>
            ) : reticleType === 'portrait' ? (
              <div className="w-40 h-52 rounded-3xl border-2 border-dashed border-saathi-teal/80 shadow-[0_0_15px_rgba(13,148,136,0.3)] flex items-center justify-center">
                <div className="w-4 h-4 border-t-2 border-r-2 border-saathi-softMint"></div>
              </div>
            ) : (
              <div className="w-48 h-48 border-2 border-dashed border-saathi-softMint/70 rounded-2xl flex items-center justify-center relative">
                <div className="w-4 h-4 border-t-2 border-l-2 border-saathi-softMint absolute top-1 left-1"></div>
                <div className="w-4 h-4 border-t-2 border-r-2 border-saathi-softMint absolute top-1 right-1"></div>
                <div className="w-4 h-4 border-b-2 border-l-2 border-saathi-softMint absolute bottom-1 left-1"></div>
                <div className="w-4 h-4 border-b-2 border-r-2 border-saathi-softMint absolute bottom-1 right-1"></div>
                <div className="w-2 h-2 rounded-full bg-saathi-softMint/60"></div>
              </div>
            )}

            <div className="text-[10px] text-white/70 bg-black/50 px-2 py-0.5 rounded-md">
              15 cm • Natural Daylight
            </div>
          </div>
        )}

        {/* State 4: Camera Permission Blocked or Device Not Found */}
        {(cameraStatus === 'blocked' || cameraStatus === 'unsupported') && !capturedImage && (
          <div className="absolute inset-0 p-5 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-full">
              <CameraOff className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-300">कैमरा एक्सेस उपलब्ध नहीं है</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs">{errorMessage}</p>
            </div>

            <div className="w-full max-w-xs space-y-2 pt-1">
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-600 transition-saathi flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                कैमरा दोबारा चालू करने का प्रयास करें (Retry)
              </button>

              {allowFileUpload && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 bg-saathi-teal hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow-md transition-saathi flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  डिवाइस से फ़ोटो चुनें (Upload Image)
                </button>
              )}
            </div>
          </div>
        )}

        {/* State 5: Requesting Permission Spinner */}
        {cameraStatus === 'requesting' && !capturedImage && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-saathi-softMint border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-saathi-softMint font-medium">कैमरा अनुमति एवं कनेक्शन प्रारंभ हो रहा है...</p>
          </div>
        )}

        {/* State 6: Processing / Quality Evaluation Spinner */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center space-y-2 z-20">
            <div className="w-8 h-8 border-3 border-saathi-teal border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-white font-semibold">ऑन-डिवाइस गुणवत्ता जांच (Blur & Exposure)...</p>
          </div>
        )}
      </div>

      {/* Captured Image Quality Feedback Scorecard */}
      {capturedImage && qualityResult && (
        <div className="bg-slate-950 p-3 border-t border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {qualityResult.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className={`font-bold ${qualityResult.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {qualityResult.passed ? t.qualityValidated : 'पुनः फ़ोटो लेने की सलाह'}
              </span>
            </div>

            {/* Metrics Chips */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono">
              <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                Blur: {qualityResult.blurVariance}
              </span>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                Lum: {qualityResult.meanLuminance}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300">
            {activeLanguage === 'en' ? qualityResult.feedbackTextEn : qualityResult.feedbackTextHi}
          </p>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
        {!capturedImage ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              {/* Primary Capture Button */}
              <button
                type="button"
                onClick={handleCaptureVideo}
                disabled={cameraStatus !== 'active' || isProcessing}
                className="flex-1 py-3 bg-saathi-teal hover:bg-teal-600 active:scale-98 text-white font-bold rounded-xl text-sm shadow-lg transition-saathi flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Capture photograph"
              >
                <Camera className="w-5 h-5" />
                <span>{t.captureImage}</span>
              </button>

              {/* Upload Button */}
              {allowFileUpload && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-saathi flex items-center gap-1.5"
                  title="Upload from Device / Gallery"
                  aria-label="Upload photo from device"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </button>
              )}
            </div>

            {/* Quick Test Clinical Samples Accordion / Dropdown */}
            {allowPresetSamples && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowSamplesMenu(!showSamplesMenu)}
                  className="w-full text-center text-[11px] text-saathi-softMint hover:text-white flex items-center justify-center gap-1.5 py-1 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>त्वरित परीक्षण नमूने (Quick Test Samples)</span>
                </button>

                {showSamplesMenu && (
                  <div className="grid grid-cols-3 gap-1.5 pt-1.5 animate-fade-in text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleSelectSample('LESION_AMBER')}
                      className="p-1.5 bg-slate-800 hover:bg-amber-950/60 text-amber-300 rounded-lg border border-amber-500/30 font-bold text-center transition-saathi"
                    >
                      घाव (Lesion)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSample('PETECHIAE_RED')}
                      className="p-1.5 bg-slate-800 hover:bg-red-950/60 text-red-300 rounded-lg border border-red-500/30 font-bold text-center transition-saathi"
                    >
                      दाने (Petechiae)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSample('NORMAL_SKIN')}
                      className="p-1.5 bg-slate-800 hover:bg-emerald-950/60 text-emerald-300 rounded-lg border border-emerald-500/30 font-bold text-center transition-saathi"
                    >
                      सामान्य (Normal)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            {/* Retake Button */}
            <button
              type="button"
              onClick={handleRetake}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-saathi flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>दोबारा लें (Retake)</span>
            </button>

            {/* Confirm & Proceed Button */}
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-2.5 bg-saathi-teal hover:bg-teal-600 text-white font-bold rounded-xl text-xs shadow-md transition-saathi flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>पुष्टि करें एवं आगे बढ़ें (Proceed)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

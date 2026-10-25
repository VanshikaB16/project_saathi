/**
 * Project Saathi - ElevenLabs Multimodal Speech Synthesis Service
 * Provides high-fidelity, compassionate, natural human voice synthesis
 * using ElevenLabs Multilingual V2 for Hindi, Indian English, and regional languages.
 * 
 * Includes Built-in Client Caching & Graceful Fallback to on-device Web Speech API.
 */

const ENV_KEY = (import.meta.env.VITE_ELEVENLABS_API_KEY as string) || '';
const ENV_VOICE = (import.meta.env.VITE_ELEVENLABS_VOICE_ID as string) || 'EXAVITQu4vr4xnSDxMaL'; // Sarah (Warm & Empathic)

export interface ElevenLabsVoicePreset {
  id: string;
  name: string;
  description: string;
}

export const ELEVENLABS_PRESETS: ElevenLabsVoicePreset[] = [
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah (Default - Warm & Empathic)',
    description: 'Calm, gentle tone designed for reassuring patients and health workers.',
  },
  {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel (Clear & Calm Healthcare)',
    description: 'Crisp articulation suited for clinical instructions and steps.',
  },
  {
    id: '9BWtsMINqrJLrRacOk9x',
    name: 'Aria (Gentle & Expressive)',
    description: 'Expressive and friendly voice for community health interaction.',
  },
  {
    id: 'FGY2WhTYpPnrIDTdsKH5',
    name: 'Laura (Reassuring Primary Care)',
    description: 'Warm, reassuring tone for screening results.',
  },
];

class ElevenLabsService {
  private apiKey: string = '';
  private voiceId: string = 'EXAVITQu4vr4xnSDxMaL';
  private audioCache = new Map<string, string>();
  private currentAudio: HTMLAudioElement | null = null;
  private isProcessing: boolean = false;

  constructor() {
    try {
      const storedKey = localStorage.getItem('saathi_elevenlabs_api_key');
      this.apiKey = storedKey || ENV_KEY || '';

      const storedVoice = localStorage.getItem('saathi_elevenlabs_voice_id');
      this.voiceId = storedVoice || ENV_VOICE || 'EXAVITQu4vr4xnSDxMaL';
    } catch {
      this.apiKey = ENV_KEY;
      this.voiceId = ENV_VOICE;
    }
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public setApiKey(key: string): void {
    this.apiKey = key.trim();
    try {
      if (this.apiKey) {
        localStorage.setItem('saathi_elevenlabs_api_key', this.apiKey);
      } else {
        localStorage.removeItem('saathi_elevenlabs_api_key');
      }
    } catch (e) {
      console.warn('Could not persist ElevenLabs API key to localStorage', e);
    }
  }

  public getVoiceId(): string {
    return this.voiceId;
  }

  public setVoiceId(id: string): void {
    this.voiceId = id.trim() || 'EXAVITQu4vr4xnSDxMaL';
    try {
      localStorage.setItem('saathi_elevenlabs_voice_id', this.voiceId);
    } catch (e) {
      console.warn('Could not persist ElevenLabs voice ID to localStorage', e);
    }
  }

  public hasApiKey(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 15);
  }

  /**
   * Generates and plays audio from text using ElevenLabs Multilingual V2.
   * Returns true if audio played successfully, or false to trigger native fallback.
   */
  public async speak(text: string): Promise<boolean> {
    if (!this.hasApiKey() || !text || !text.trim()) {
      return false;
    }

    try {
      this.stop();
      this.isProcessing = true;

      const cacheKey = `${this.voiceId}_${text.trim()}`;
      let audioUrl = this.audioCache.get(cacheKey);

      if (!audioUrl) {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
            'Accept': 'audio/mpeg',
          },
          body: JSON.stringify({
            text: text.trim(),
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.0,
              use_speaker_boost: true,
            },
          }),
        });

        if (!response.ok) {
          const errDetail = await response.text().catch(() => '');
          console.warn(`[ElevenLabs] API error (${response.status}):`, errDetail);
          this.isProcessing = false;
          return false;
        }

        const blob = await response.blob();
        audioUrl = URL.createObjectURL(blob);
        this.audioCache.set(cacheKey, audioUrl);
      }

      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.onended = () => {
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
        this.isProcessing = false;
      };

      audio.onerror = () => {
        this.isProcessing = false;
        this.currentAudio = null;
      };

      await audio.play();
      this.isProcessing = false;
      return true;
    } catch (err) {
      console.warn('[ElevenLabs] Speech playback failed, falling back to Web Speech:', err);
      this.isProcessing = false;
      this.stop();
      return false;
    }
  }

  public stop(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
      this.currentAudio = null;
    }
    this.isProcessing = false;
  }

  public isSpeaking(): boolean {
    return Boolean(this.currentAudio && !this.currentAudio.paused) || this.isProcessing;
  }
}

export const elevenLabsService = new ElevenLabsService();

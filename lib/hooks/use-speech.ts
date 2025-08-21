'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface UseSpeechReturn {
  speak: (text: string, options?: SpeechOptions) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  voices: SpeechSynthesisVoice[];
}

export function useSpeech(): UseSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if Speech Synthesis is supported
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Load voices immediately if available
    loadVoices();

    // Some browsers load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSupported]);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!isSupported || !text.trim()) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set options with defaults
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Find and set the best voice for the language
    const voice = voices.find(v => 
      v.lang.toLowerCase().includes(utterance.lang.toLowerCase()) ||
      v.lang.toLowerCase().includes(utterance.lang.split('-')[0].toLowerCase())
    );
    if (voice) {
      utterance.voice = voice;
    }

    // Event listeners
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSupported,
    isSpeaking,
    isPaused,
    voices
  };
}

// Helper function to get best voice for language
export function getBestVoiceForLanguage(
  voices: SpeechSynthesisVoice[], 
  lang: string
): SpeechSynthesisVoice | null {
  const langCode = lang.toLowerCase();
  const langPrefix = langCode.split('-')[0];
  
  // Try exact match first
  let voice = voices.find(v => v.lang.toLowerCase() === langCode);
  
  // Try language prefix match
  if (!voice) {
    voice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
  }
  
  // Try any voice with the language code
  if (!voice) {
    voice = voices.find(v => v.lang.toLowerCase().includes(langPrefix));
  }
  
  return voice || null;
}

// Common language codes for flashcard apps
export const COMMON_LANGUAGES = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'es-ES': 'Spanish (Spain)',
  'es-MX': 'Spanish (Mexico)',
  'fr-FR': 'French',
  'de-DE': 'German',
  'it-IT': 'Italian',
  'pt-BR': 'Portuguese (Brazil)',
  'pt-PT': 'Portuguese (Portugal)',
  'ru-RU': 'Russian',
  'ja-JP': 'Japanese',
  'ko-KR': 'Korean',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'ar-SA': 'Arabic',
  'hi-IN': 'Hindi',
  'vi-VN': 'Vietnamese'
} as const;

export type LanguageCode = keyof typeof COMMON_LANGUAGES;

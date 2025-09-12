'use client';
import { useState, useCallback } from 'react';

interface TranslationResult {
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  targetLanguage: string;
}

interface UseTranslationReturn {
  translateText: (text: string, targetLanguage?: string) => Promise<void>;
  translatePDF: (file: File, targetLanguage?: string) => Promise<void>;
  result: TranslationResult | null;
  loading: boolean;
  error: string | null;
  clearResult: () => void;
}

export default function useTranslation(): UseTranslationReturn {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const translateText = useCallback(async (text: string, targetLanguage: string = 'fr') => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('text', text);
    formData.append('targetLanguage', targetLanguage);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Translation failed');
      }

      const data: TranslationResult = await response.json();
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const translatePDF = useCallback(async (file: File, targetLanguage: string = 'fr') => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('targetLanguage', targetLanguage);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Translation failed');
      }

      const data: TranslationResult = await response.json();
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    translateText,
    translatePDF,
    result,
    loading,
    error,
    clearResult
  };
}
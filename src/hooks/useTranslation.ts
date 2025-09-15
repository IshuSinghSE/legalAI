'use client';
import { useState, useCallback, useEffect } from 'react';

interface TranslationResult {
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  targetLanguage: string;
  summary?: string;
}

interface CachedEntry {
  data: TranslationResult;
  timestamp: number;
}

interface CachedTranslation {
  [key: string]: CachedEntry;
}

interface UseTranslationReturn {
  translateText: (text: string, targetLanguage?: string) => Promise<void>;
  translatePDF: (file: File, targetLanguage?: string) => Promise<void>;
  result: TranslationResult | null;
  loading: boolean;
  error: string | null;
  clearResult: () => void;
  isTranslated: boolean;
  toggleTranslation: () => void;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  cacheStats: CacheStats;
  resetCacheStats: () => void;
  clearCache: () => void;
  inspectCache: () => CachedTranslation | null;
}

const CACHE_KEY = 'legalAI_translations';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 50; // Maximum number of cached entries
const MAX_TEXT_LENGTH = 1000; // Maximum text length before hashing

// Simple hash function for cache keys
const hashText = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

// Generate cache key with text hashing for long texts
const generateCacheKey = (text: string, targetLanguage: string): string => {
  const trimmedText = text.trim();
  const textKey = trimmedText.length > MAX_TEXT_LENGTH
    ? hashText(trimmedText)
    : trimmedText.replace(/\s+/g, ' '); // Normalize whitespace
  return `${textKey}_${targetLanguage}`;
};

// Compress large translation results
const compressTranslation = (result: TranslationResult): TranslationResult => {
  // For now, just return as-is. Could implement actual compression later
  return result;
};

// Decompress translation results
const decompressTranslation = (result: TranslationResult): TranslationResult => {
  // For now, just return as-is. Could implement actual decompression later
  return result;
};

// Cache analytics
interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  hitRate: number;
  cacheSize: number;
  lastCleanup: number;
}

let cacheStats: CacheStats = {
  hits: 0,
  misses: 0,
  totalRequests: 0,
  hitRate: 0,
  cacheSize: 0,
  lastCleanup: 0
};

// Update cache statistics
const updateCacheStats = (isHit: boolean) => {
  cacheStats.totalRequests++;
  if (isHit) {
    cacheStats.hits++;
  } else {
    cacheStats.misses++;
  }
  cacheStats.hitRate = cacheStats.totalRequests > 0 ? (cacheStats.hits / cacheStats.totalRequests) * 100 : 0;
  cacheStats.cacheSize = Object.keys(getCachedTranslations()).length;
};

// Reset cache statistics
const resetCacheStats = () => {
  cacheStats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
    hitRate: 0,
    cacheSize: Object.keys(getCachedTranslations()).length,
    lastCleanup: Date.now()
  };
};

// Get current cache statistics
const getCacheStats = (): CacheStats => {
  return {
    ...cacheStats,
    cacheSize: Object.keys(getCachedTranslations()).length
  };
};

// Clear entire cache
const clearCache = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CACHE_KEY);
    resetCacheStats();
    console.log('Cache cleared successfully');
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
};

// Debug function to inspect localStorage
const inspectCache = (): CachedTranslation | null => {
  if (typeof window === 'undefined') {
    console.log('inspectCache: window not available (SSR)');
    return null;
  }

  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) {
      console.log('inspectCache: No cache found in localStorage');
      console.log('inspectCache: All localStorage keys:', Object.keys(localStorage));
      return null;
    }

    const parsed = JSON.parse(stored);
    console.log('inspectCache: Raw localStorage data:', parsed);
    console.log('inspectCache: Cache keys:', Object.keys(parsed));
    console.log('inspectCache: Cache size:', Object.keys(parsed).length);

    return parsed;
  } catch (error) {
    console.error('inspectCache: Error inspecting cache:', error);
    return null;
  }
};

// Get cached translations from localStorage with size management
  const getCachedTranslations = (): CachedTranslation => {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (!stored) return {};

      const parsed: CachedTranslation = JSON.parse(stored);

      // Clean up expired entries and enforce size limit
      const now = Date.now();
      const validEntries: CachedTranslation = {};

      // Sort by timestamp (oldest first) for LRU eviction
      const sortedEntries = Object.entries(parsed)
        .filter(([, value]) => now - value.timestamp < CACHE_EXPIRY)
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);

      // Keep only the most recent entries up to MAX_CACHE_SIZE
      const entriesToKeep = sortedEntries.slice(-MAX_CACHE_SIZE);

      entriesToKeep.forEach(([key, value]) => {
        validEntries[key] = value;
      });

      // Update localStorage if we cleaned up entries
      if (Object.keys(validEntries).length !== Object.keys(parsed).length) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(validEntries));
        console.log(`Cache cleaned: ${Object.keys(parsed).length - Object.keys(validEntries).length} entries removed`);
      }

      return validEntries;
    } catch (error) {
      console.error('Error reading cached translations:', error);
      // Clear corrupted cache
      try {
        localStorage.removeItem(CACHE_KEY);
      } catch (clearError) {
        console.error('Failed to clear corrupted cache:', clearError);
      }
      return {};
    }
  };

// Save translation to cache with size management and compression
const saveToCache = (text: string, targetLanguage: string, result: TranslationResult) => {
  if (typeof window === 'undefined') {
    console.log('saveToCache: window not available (SSR)');
    return;
  }

  try {
    const cacheKey = generateCacheKey(text, targetLanguage);
    console.log('saveToCache: Saving with key:', cacheKey, 'for text length:', text.length);

    const cached = getCachedTranslations();
    console.log('saveToCache: Current cache size before save:', Object.keys(cached).length);

    // Compress the result before caching
    const compressedResult = compressTranslation(result);

    cached[cacheKey] = {
      data: compressedResult,
      timestamp: Date.now()
    };

    // The getCachedTranslations function already handles size limits
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    console.log('saveToCache: Successfully saved to localStorage. New cache size:', Object.keys(cached).length);

    // Verify it was saved
    const verifySaved = localStorage.getItem(CACHE_KEY);
    if (verifySaved) {
      const parsed = JSON.parse(verifySaved);
      console.log('saveToCache: Verification - cache keys in localStorage:', Object.keys(parsed));
    }
  } catch (error) {
    console.warn('Failed to save translation to cache:', error);
    // Try to clear some space if storage is full
    try {
      const cached = getCachedTranslations();
      const keys = Object.keys(cached);
      if (keys.length > 0) {
        // Remove oldest entry
        delete cached[keys[0]];
        localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
        console.log('Cleared oldest cache entry to free space');
      }
    } catch (clearError) {
      console.error('Failed to clear cache space:', clearError);
    }
  }
};

export default function useTranslation(): UseTranslationReturn {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const [isTranslated, setIsTranslated] = useState(false);

  // Load cached data on mount
  useEffect(() => {
    // We could preload recent translations here if needed
  }, []);

  const translateText = useCallback(async (text: string, targetLanguage: string = currentLanguage) => {
    console.log('🚀 translateText called with:', { text: text.substring(0, 50) + '...', targetLanguage });

    if (!text || text.trim().length === 0) {
      console.log('❌ translateText: No text provided, returning early');
      return;
    }

    setLoading(true);
    setError(null);
    console.log('🔄 translateText: Starting translation process');

    // Check cache first
    const cached = getCachedTranslations();
    const cacheKey = generateCacheKey(text, targetLanguage);
    console.log('🔍 translateText: Checking cache for key:', cacheKey);
    console.log('📊 translateText: Available cache keys:', Object.keys(cached));

    if (cached[cacheKey] && Date.now() - cached[cacheKey].timestamp < CACHE_EXPIRY) {
      console.log('✅ Using cached translation - HIT!');
      updateCacheStats(true);
      setResult(decompressTranslation(cached[cacheKey].data));
      setIsTranslated(true);
      setCurrentLanguage(targetLanguage);
      setLoading(false);
      return;
    }

    console.log('❌ translateText: Cache miss or expired, making API call');
    updateCacheStats(false);

    const formData = new FormData();
    formData.append('text', text.trim());
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
      console.log('📥 translateText: API response received:', { detectedLanguage: data.detectedLanguage, targetLanguage: data.targetLanguage });

      // Cache the result
      saveToCache(text.trim(), targetLanguage, data);
      console.log('💾 translateText: Translation cached successfully');

      setResult(data);
      setIsTranslated(true);
      setCurrentLanguage(targetLanguage);
      console.log('✅ translateText: Translation completed successfully');
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('❌ translateText: Translation failed:', errorMessage);
      setError(errorMessage.includes('configured') ? 'Translation service is not available. Please try again later.' : 'Translation failed. Please try again later.');
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
      console.log('🏁 translateText: Process finished');
    }
  }, [currentLanguage]);

  const translatePDF = useCallback(async (file: File, targetLanguage: string = currentLanguage) => {
    setLoading(true);
    setError(null);

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
      setIsTranslated(true);
      setCurrentLanguage(targetLanguage);
    } catch (err) {
      setError('Translation failed. Please try again later.');
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentLanguage]);

  const toggleTranslation = useCallback(() => {
    if (!result) return;
    setIsTranslated(!isTranslated);
  }, [result, isTranslated]);

  const setLanguage = useCallback((lang: string) => {
    setCurrentLanguage(lang);
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
    setIsTranslated(false);
  }, []);

  return {
    translateText,
    translatePDF,
    result,
    loading,
    error,
    clearResult,
    isTranslated,
    toggleTranslation,
    currentLanguage,
    setLanguage,
    cacheStats: getCacheStats(),
    resetCacheStats,
    clearCache,
    inspectCache
  };
}
'use client';
import React, { useState } from 'react';
import { Languages, Loader2, FileText, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import useTranslation from '../hooks/useTranslation';

interface TranslationDialogProps {
  text?: string;
  pdfFile?: File;
  trigger?: React.ReactNode;
  isTranslated?: boolean;
  onToggleTranslation?: (translatedText: string, targetLanguage: string) => void;
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
  translatedText?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

export function TranslationDialog({ 
  text, 
  pdfFile, 
  trigger,
//   isTranslated = false,
  onToggleTranslation,
  selectedLanguage: externalSelectedLanguage,
  onLanguageChange,
//   translatedText: externalTranslatedText
}: TranslationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(externalSelectedLanguage || 'hi');
  const [inputText, setInputText] = useState(text || '');

  const { translateText, translatePDF, result, loading, error, clearResult } = useTranslation();

  // Sync external selectedLanguage with internal state
  React.useEffect(() => {
    if (externalSelectedLanguage) {
      setTargetLanguage(externalSelectedLanguage);
    }
  }, [externalSelectedLanguage]);

  const handleTranslate = async () => {
    if (pdfFile) {
      await translatePDF(pdfFile, targetLanguage);
    } else if (inputText.trim()) {
      await translateText(inputText.trim(), targetLanguage);
    }
    
    // If we have a result and onToggleTranslation callback, call it
    if (result && onToggleTranslation) {
      onToggleTranslation(result.translatedText, targetLanguage);
    }
  };

  const handleLanguageChange = (language: string) => {
    setTargetLanguage(language);
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      clearResult();
      if (!text) {
        setInputText('');
      }
    }
  };

  const selectedLanguage = SUPPORTED_LANGUAGES.find((lang) => lang.code === targetLanguage);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
            <Languages className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Translate Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Language Selection */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Target Language</label>
              <Select value={targetLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue>
                    {selectedLanguage && (
                      <span className="flex items-center gap-2">
                        <span>{selectedLanguage.flag}</span>
                        <span>{selectedLanguage.name}</span>
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Input Section */}
          {!pdfFile && (
            <div>
              <label className="text-sm font-medium mb-2 block">Text to Translate</label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate..."
                className="min-h-[100px]"
                disabled={loading}
              />
            </div>
          )}

          {/* File Info */}
          {pdfFile && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">{pdfFile.name}</p>
                <p className="text-xs text-blue-700">
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Badge variant="secondary">PDF</Badge>
            </div>
          )}

          {/* Translate Button */}
          <Button
            onClick={handleTranslate}
            disabled={loading || (!inputText.trim() && !pdfFile)}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="w-4 h-4 mr-2" />
                Translate to {selectedLanguage?.name}
              </>
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {(result || loading) && (
            <div className="space-y-4">
              {/* Language Info */}
              {result && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="outline">Detected: {result.detectedLanguage.toUpperCase()}</Badge>
                  <span>→</span>
                  <Badge variant="outline">Target: {result.targetLanguage.toUpperCase()}</Badge>
                </div>
              )}

              {/* Translation */}
              <div>
                <h4 className="text-sm font-medium mb-2">Translation</h4>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : result ? (
                    <p className="text-sm text-green-800 leading-relaxed">{result.translatedText}</p>
                  ) : null}
                </div>
              </div>

              {/* Original Text */}
              <div>
                <h4 className="text-sm font-medium mb-2">Original Text</h4>
                <div className="p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : result ? (
                    <p className="text-sm text-gray-700">
                      {result.originalText.length > 500
                        ? `${result.originalText.substring(0, 500)}...`
                        : result.originalText}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

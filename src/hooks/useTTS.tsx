import { useState, useEffect, useCallback, useRef } from 'react';

interface WordPosition {
  start: number;
  end: number;
  word: string;
}

export const useTTS = (text: string) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState<{ start: number; end: number } | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [normalizedText, setNormalizedText] = useState<string>('');
  const [estimatedWordPositions, setEstimatedWordPositions] = useState<WordPosition[]>([]);

  // Use ref to track speaking state for time-based highlighting
  const isSpeakingRef = useRef(false);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  // Update normalized text when input text changes
  useEffect(() => {
    if (text) {
      setNormalizedText(text.replace(/\s+/g, ' ').trim());
    }
  }, [text]);

  // Stop speaking when component unmounts or text changes
  useEffect(() => {
    return () => {
      if (speechSynthesis && speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      setCurrentHighlight(null);
      isSpeakingRef.current = false;
    };
  }, [speechSynthesis]);

  // Estimate word positions for highlighting
  const estimateWordPositions = useCallback((text: string): WordPosition[] => {
    const words = text.split(/\s+/);
    const positions: WordPosition[] = [];
    let currentPos = 0;

    words.forEach(word => {
      const start = currentPos;
      const end = currentPos + word.length;
      positions.push({ start, end, word });
      currentPos = end + 1; // +1 for space
    });

    return positions;
  }, []);

  // Time-based highlighting as fallback
  const startTimeBasedHighlighting = useCallback(() => {
    if (!normalizedText || estimatedWordPositions.length === 0 || !isSpeakingRef.current) return;

    let wordIndex = 0;
    const wordsPerMinute = 150; // Average speaking rate
    const msPerWord = (60 / wordsPerMinute) * 1000;

    const highlightNextWord = () => {
      if (wordIndex < estimatedWordPositions.length && isSpeakingRef.current) {
        const word = estimatedWordPositions[wordIndex];
        setCurrentHighlight({ start: word.start, end: word.end });

        wordIndex++;
        setTimeout(highlightNextWord, msPerWord);
      } else {
        setCurrentHighlight(null);
      }
    };

    highlightNextWord();
  }, [normalizedText, estimatedWordPositions]);

  // Handle text-to-speech
  const handleTextToSpeech = useCallback(() => {
    if (!speechSynthesis || !normalizedText) return;

    // Cancel any existing speech before starting new one
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentHighlight(null);
      isSpeakingRef.current = false;
      return;
    }

    // Estimate word positions for fallback highlighting
    const wordPositions = estimateWordPositions(normalizedText);
    setEstimatedWordPositions(wordPositions);

    const utterance = new SpeechSynthesisUtterance(normalizedText);

    // Configure speech settings
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    // Set language if available
    utterance.lang = 'en-US'; // Default to US English

    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
      isSpeakingRef.current = true;
      setCurrentHighlight(null);

      // Start time-based highlighting as fallback
      setTimeout(() => startTimeBasedHighlighting(), 500);
    };

    utterance.onboundary = (event) => {
      console.log('Boundary event:', event.name, event.charIndex, event.charLength);
      if (event.name === 'word') {
        console.log('Word boundary:', event.charIndex, event.charLength, normalizedText.slice(event.charIndex, event.charIndex + event.charLength));
        // Use browser's word boundary if available
        setCurrentHighlight({
          start: event.charIndex,
          end: event.charIndex + event.charLength
        });
      } else if (event.name === 'sentence') {
        // Fallback: highlight current sentence if word boundaries don't work
        console.log('Sentence boundary:', event.charIndex, event.charLength);
        setCurrentHighlight({
          start: event.charIndex,
          end: event.charIndex + event.charLength
        });
      }
    };

    utterance.onend = () => {
      console.log('Speech ended normally');
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      setCurrentHighlight(null);
    };

    utterance.onerror = (event) => {
      console.log('Speech error:', event.error, event);

      // Handle different error types
      if (event.error === 'interrupted') {
        console.log('Speech was interrupted - this is usually normal');
      } else if (event.error === 'canceled') {
        console.log('Speech was cancelled');
      } else {
        console.error('Unexpected speech error:', event.error);
      }

      setIsSpeaking(false);
      isSpeakingRef.current = false;
      setCurrentHighlight(null);
    };

    console.log('Starting speech synthesis...');
    speechSynthesis.speak(utterance);
  }, [speechSynthesis, normalizedText, estimateWordPositions, startTimeBasedHighlighting]);

  // Render highlighted text
  const renderHighlightedText = useCallback((displayText: string) => {
    console.log('Rendering highlight:', currentHighlight, 'Text length:', displayText.length);
    if (!currentHighlight) {
      return (
        <div className="whitespace-pre-line text-gray-700 leading-relaxed">
          {displayText}
        </div>
      );
    }

    console.log('Rendering highlight:', currentHighlight, 'Text length:', displayText.length);

    // Simple position mapping for highlighting
    const beforeHighlight = displayText.slice(0, currentHighlight.start);
    const highlightedText = displayText.slice(currentHighlight.start, Math.min(currentHighlight.end, displayText.length));
    const afterHighlight = displayText.slice(Math.min(currentHighlight.end, displayText.length));

    console.log('Before:', beforeHighlight.length, 'Highlight:', `"${highlightedText}"`, 'After:', afterHighlight.length);

    return (
      <div className="whitespace-pre-line text-gray-700 leading-relaxed">
        {beforeHighlight}
        <span className="bg-yellow-300 text-gray-900 rounded font-semibold transition-all duration-300 ease-in-out transform">
          {highlightedText || ' '}
        </span>
        {afterHighlight}
      </div>
    );
  }, [currentHighlight]);

  return {
    isSpeaking,
    currentHighlight,
    speechSynthesis,
    normalizedText,
    handleTextToSpeech,
    renderHighlightedText,
  };
};

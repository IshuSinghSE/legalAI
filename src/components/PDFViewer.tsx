"use client";
import { useState, useRef, useEffect } from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import {
  Highlighter,
  MessageSquare,
  Languages,
  FileText,
  Copy,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  X,
  Volume2,
  Square
} from "lucide-react";
import { useTTS } from '../hooks/useTTS';

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

interface PDFViewerProps {
  documentUrl?: string;
  onAnnotation?: (annotation: unknown) => void;
}

interface Annotation {
  id: string;
  type: 'highlight' | 'note';
  text: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  note?: string;
}

interface FloatingToolbar {
  visible: boolean;
  x: number;
  y: number;
  selectedText: string;
}

export function PDFViewer({ documentUrl, onAnnotation }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [floatingToolbar, setFloatingToolbar] = useState<FloatingToolbar>({
    visible: false,
    x: 0,
    y: 0,
    selectedText: ''
  });
  const [aiResults, setAiResults] = useState<{[key: string]: string}>({});
  const viewerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // TTS for selected text
  const { isSpeaking: isTTSSpeaking, handleTextToSpeech: handleTTS } = useTTS(floatingToolbar.selectedText);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection) return;

    const text = selection.toString().trim();
    if (!text) return;

    // Ensure selection originates from PDF text layer
    const anchorNode = selection.anchorNode as Node | null;
    const focusNode = selection.focusNode as Node | null;
    const closestTextLayer = (node: Node | null): Element | null => {
      if (!node) return null;
      let el: Node | null = node;
      while (el) {
        if (el instanceof Element) {
          const cls = el.classList;
          if (cls.contains('react-pdf__Page__textContent') || cls.contains('textLayer')) {
            return el;
          }
        }
        el = el.parentNode;
      }
      return null;
    };
    const anchorLayer = closestTextLayer(anchorNode);
    const focusLayer = closestTextLayer(focusNode);
    if (!anchorLayer || !focusLayer) return;
    // Only allow selection within the same text layer (same page)
    if (anchorLayer !== focusLayer) return;

    // Ignore overly small or excessively large selections
    if (text.length < 2 || text.length > 500) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    // Avoid selections that cover most of the page (likely accidental drag)
    const closestPageEl = (node: Node | null): Element | null => {
      if (!node) return null;
      let el: Node | null = node;
      while (el) {
        if (el instanceof Element && el.classList.contains('react-pdf__Page')) return el;
        el = el.parentNode;
      }
      return null;
    };
    const pageEl = closestPageEl(anchorNode) || closestPageEl(focusNode);
    if (pageEl) {
      const pageRect = pageEl.getBoundingClientRect();
      const areaRatio = (rect.width * rect.height) / (pageRect.width * pageRect.height);
      const tooWide = rect.width > pageRect.width * 0.95;
      const tooTall = rect.height > pageRect.height * 0.5;
      if (areaRatio > 0.35 || tooWide || tooTall) {
        // Likely a paragraph/page selection – ignore
        return;
      }
    }
    const viewerRect = viewerRef.current?.getBoundingClientRect();
    if (viewerRect) {
      setFloatingToolbar({
        visible: true,
        x: rect.left - viewerRect.left + rect.width / 2,
        y: rect.top - viewerRect.top - 50,
        selectedText: text
      });
    }
  };

  const hideFloatingToolbar = () => {
    setFloatingToolbar(prev => ({ ...prev, visible: false }));
    window.getSelection()?.removeAllRanges();
  };

  const addHighlight = (color: string = '#ffeb3b') => {
    if (floatingToolbar.selectedText) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: 'highlight',
        text: floatingToolbar.selectedText,
        color,
        x: floatingToolbar.x,
        y: floatingToolbar.y,
        width: 200,
        height: 20,
        page: currentPage
      };
      setAnnotations(prev => [...prev, newAnnotation]);
      onAnnotation?.(newAnnotation);
      hideFloatingToolbar();
    }
  };

  const handleAIAction = async (action: 'translate' | 'summarize' | 'explain') => {
    if (!floatingToolbar.selectedText) return;
    const mockResponses = {
      translate: `Translation: ${floatingToolbar.selectedText} (French: Texte traduit en français)`,
      summarize: `Summary: This text discusses ${floatingToolbar.selectedText.toLowerCase()} and its key implications.`,
      explain: `Explanation: ${floatingToolbar.selectedText} refers to a legal concept that means...`
    };
    setAiResults(prev => ({
      ...prev,
      [action]: mockResponses[action]
    }));
    setTimeout(() => {
      setAiResults(prev => {
        const updated = { ...prev };
        delete updated[action];
        return updated;
      });
    }, 5000);
    hideFloatingToolbar();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(floatingToolbar.selectedText);
    hideFloatingToolbar();
  };

  const handleTTSForSelection = () => {
    if (floatingToolbar.selectedText) {
      handleTTS();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (floatingToolbar.visible && viewerRef.current && !viewerRef.current.contains(event.target as Node)) {
        hideFloatingToolbar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [floatingToolbar.visible]);

  // Track container width for responsive page sizing
  useEffect(() => {
    if (!contentRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cw = Math.floor(entry.contentRect.width);
        setContainerWidth(cw);
      }
    });
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, []);

  const pageBase = Math.max(320, containerWidth ? containerWidth - 32 : 800); // account for padding
  const pageWidth = Math.round(pageBase * (zoom / 100));

  return (
    <div className="h-full flex flex-col">
      {/* PDF Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm font-medium">
              {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(50, zoom - 25))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium w-16 text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* PDF Viewer Area */}
      <div className="flex-1 relative overflow-auto bg-gray-100" ref={viewerRef}>
        <div className="max-w-4xl mx-auto p-8" ref={contentRef}>
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-8">
              <div className="relative leading-relaxed" onMouseUp={handleTextSelection}>
                <div className="flex justify-center select-text">
                  <Document
                    file={documentUrl}
                    onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
                    loading={<div className="text-center text-gray-400">Loading PDF...</div>}
                  >
                    <Page pageNumber={currentPage} width={pageWidth} renderTextLayer />
                  </Document>
                </div>
                {/* Render Annotations (visual only, not real PDF overlay) */}
                {annotations
                  .filter(annotation => annotation.page === currentPage)
                  .map(annotation => (
                    <div
                      key={annotation.id}
                      className="absolute pointer-events-none"
                      style={{
                        left: annotation.x,
                        top: annotation.y,
                        width: annotation.width,
                        height: annotation.height,
                        backgroundColor: annotation.type === 'highlight' ? annotation.color + '40' : 'transparent',
                        border: annotation.type === 'note' ? `2px solid ${annotation.color}` : 'none',
                      }}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Floating Toolbar */}
        {floatingToolbar.visible && (
          <div
            className="absolute z-50 bg-white border rounded-lg shadow-lg p-2 flex items-center gap-1"
            style={{ left: floatingToolbar.x - 150, top: floatingToolbar.y }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => addHighlight('#ffeb3b')}>
                    <Highlighter className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Highlight</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleTTSForSelection}
                    disabled={!floatingToolbar.selectedText}
                    className={isTTSSpeaking ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-gray-700'}
                  >
                    {isTTSSpeaking ? (
                      <Square className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isTTSSpeaking ? 'Stop Listening' : 'Listen'}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => handleAIAction('translate')}>
                    <Languages className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Translate</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => handleAIAction('summarize')}>
                    <FileText className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Summarize</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => handleAIAction('explain')}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Explain</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="sm" onClick={hideFloatingToolbar}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        {/* AI Results Notifications */}
        <div className="absolute top-4 right-4 space-y-2 max-w-sm">
          {Object.entries(aiResults).map(([action, result]) => (
            <Card key={action} className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="secondary" className="mb-2 capitalize">
                      {action}
                    </Badge>
                    <p className="text-sm text-gray-700">{result}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setAiResults(prev => {
                    const updated = { ...prev };
                    delete updated[action];
                    return updated;
                  })}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Annotations Panel */}
      {annotations.length > 0 && (
        <div className="border-t bg-white p-4">
          <h3 className="font-semibold mb-3">Annotations ({annotations.length})</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {annotations.map(annotation => (
              <div key={annotation.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: annotation.color }} />
                <span className="text-sm flex-1 truncate">{annotation.text}</span>
                <Badge variant="outline" className="text-xs">Page {annotation.page}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

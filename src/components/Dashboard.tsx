'use client';
import React from 'react';
import {
  ArrowLeft,
  Download,
  FileText,
  Highlighter,
  Languages,
  MoreHorizontal,
  RotateCcw,
  Upload,
  Volume2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import dynamic from 'next/dynamic';
import { Input } from './ui/input';

import Link from 'next/link';
import { UploadCard } from './UploadCard';
import { Badge } from './ui/badge';
import { formatBytes } from './ui/utils';
import { useTTS } from '../hooks/useTTS';
const PDFViewer = dynamic(() => import('./PDFViewer').then((mod) => mod.PDFViewer), { ssr: false });

// PDF.js worker will be configured client-side where needed


export function Dashboard() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [summary, setSummary] = React.useState<string>('');
  const [highlights, setHighlights] = React.useState<string[]>([]);
  const [analysisError, setAnalysisError] = React.useState<string | null>(null);
  const [selectedPages, setSelectedPages] = React.useState<string>('all');
  const [totalPages, setTotalPages] = React.useState<number | null>(null);
  const [pageMode, setPageMode] = React.useState<'first' | 'all' | 'range'>('all');
  const [startPage, setStartPage] = React.useState<number>(1);
  const [endPage, setEndPage] = React.useState<number>(1);
  const [uploadedUrl, setUploadedUrl] = React.useState<string | null>(null);
  const [isTranslated, setIsTranslated] = React.useState(false);
  const [translatedText, setTranslatedText] = React.useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>('hi');

  // Use the TTS hook
  const { isSpeaking, handleTextToSpeech, renderHighlightedText } = useTTS(summary);

  const analyzeDocument = React.useCallback(async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setSummary('');
    setHighlights([]);
    setAnalysisError(null); // Reset error state

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('selectedPages', selectedPages);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Use the error message from the API response
        throw new Error(data.error || 'Analysis failed');
      }

      setSummary(data.summary);
      setHighlights(data.highlights || []);
    } catch (error) {
      console.error('Analysis error:', error);
      // Set the error state to display it in the UI
      setAnalysisError(error instanceof Error ? error.message : 'An unknown error occurred.');
      setSummary(''); // Clear any previous summary
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedFile, selectedPages]);

  // Analyze document when file is uploaded
  React.useEffect(() => {
    if (uploadedFile) {
      analyzeDocument();
    }
  }, [uploadedFile, analyzeDocument]);

  // Create an object URL for the uploaded file for the viewer
  React.useEffect(() => {
    if (!uploadedFile) {
      setUploadedUrl(null);
      return;
    }
    const url = URL.createObjectURL(uploadedFile);
    setUploadedUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [uploadedFile]);

  // Determine total pages from the uploaded PDF to build dynamic ranges
  React.useEffect(() => {
    let cancelled = false;
    async function loadPageCount(file: File) {
      try {
        const data = await file.arrayBuffer();
        const { pdfjs } = await import('react-pdf');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
        const loadingTask = pdfjs.getDocument({ data });
        const pdf = await loadingTask.promise;
        if (!cancelled) setTotalPages(pdf.numPages);
        pdf.destroy();
      } catch (e) {
        console.error('Failed to read PDF page count', e);
        if (!cancelled) setTotalPages(null);
      }
    }
    if (uploadedFile) {
      loadPageCount(uploadedFile);
    } else {
      setTotalPages(null);
    }
    return () => {
      cancelled = true;
    };
  }, [uploadedFile]);

  // Keep range values in bounds when totalPages or values change
  React.useEffect(() => {
    if (!totalPages || totalPages < 1) return;
    const clampedStart = Math.max(1, Math.min(startPage, totalPages));
    const clampedEnd = Math.max(clampedStart, Math.min(endPage, totalPages));
    if (clampedStart !== startPage) setStartPage(clampedStart);
    if (clampedEnd !== endPage) setEndPage(clampedEnd);
  }, [totalPages, startPage, endPage]);

  // Sync selectedPages with chosen mode/range
  React.useEffect(() => {
    if (pageMode === 'all') {
      setSelectedPages('all');
    } else if (pageMode === 'first') {
      setSelectedPages('1-1');
    } else {
      const s = Math.min(startPage || 1, endPage || 1);
      const e = Math.max(startPage || 1, endPage || 1);
      setSelectedPages(`${s}-${e}`);
    }
  }, [pageMode, startPage, endPage]);

  const handleDownload = React.useCallback(async () => {
    if (!summary) return;

    try {
      const { PDFDocument, rgb } = await import('pdf-lib');

      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      let yPosition = height - 30;
      const fontSize = 12;
      const lineHeight = fontSize + 5;
      const maxWidth = width ; // Leave margins on both sides

      // Helper function to wrap text
      const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          // Rough estimation of text width (this is approximate)
          const estimatedWidth = testLine.length * (fontSize * 0.6);

          if (estimatedWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          lines.push(currentLine);
        }

        return lines;
      };

      // Helper function to draw text with page management
      const drawText = (text: string, x: number, y: number, size: number, color: ReturnType<typeof rgb>) => {
        if (y < 50) {
          page = pdfDoc.addPage();
          yPosition = height - 50;
          return height - 50;
        }
        page.drawText(text, { x, y, size, color });
        return y - lineHeight;
      };

      // Title
      yPosition = drawText('Document Analysis Results', 50, yPosition, 18, rgb(0, 0, 0));
      yPosition -= 20;

      // Original Document Information
      if (uploadedFile) {
        yPosition = drawText('Original Document Information:', 50, yPosition, 14, rgb(0, 0, 0));
        yPosition -= 15;

        const fileName = uploadedFile.name;
        const fileSize = formatBytes(uploadedFile.size);
        const uploadDate = new Date().toLocaleString();

        yPosition = drawText(`File Name: ${fileName}`, 50, yPosition, fontSize, rgb(0, 0, 0));
        yPosition = drawText(`File Size: ${fileSize}`, 50, yPosition, fontSize, rgb(0, 0, 0));
        yPosition = drawText(`Analysis Date: ${uploadDate}`, 50, yPosition, fontSize, rgb(0, 0, 0));
        yPosition -= 20;
      }

      // Summary
      yPosition = drawText('Summary:', 50, yPosition, 14, rgb(0, 0, 0));
      yPosition -= 15;

      const summaryLines = summary.split('\n');
      for (const line of summaryLines) {
        const wrappedLines = wrapText(line, maxWidth, fontSize);
        for (const wrappedLine of wrappedLines) {
          yPosition = drawText(wrappedLine, 50, yPosition, fontSize, rgb(0, 0, 0));
        }
      }

      // Highlights
      if (highlights.length > 0) {
        yPosition -= 15;
        yPosition = drawText('Key Highlights:', 50, yPosition, 14, rgb(0, 0, 0));
        yPosition -= 15;

        highlights.forEach((highlight, index) => {
          const highlightText = `${index + 1}. ${highlight}`;
          const wrappedLines = wrapText(highlightText, maxWidth, fontSize);
          for (const wrappedLine of wrappedLines) {
            yPosition = drawText(wrappedLine, 50, yPosition, fontSize, rgb(0, 0, 0));
          }
        });
      }

      // Translation
      if (isTranslated && translatedText) {
        yPosition -= 15;
        yPosition = drawText(`Translation (${selectedLanguage}):`, 50, yPosition, 14, rgb(0, 0, 0));
        yPosition -= 15;

        const translationLines = translatedText.split('\n');
        for (const line of translationLines) {
          const wrappedLines = wrapText(line, maxWidth, fontSize);
          for (const wrappedLine of wrappedLines) {
            yPosition = drawText(wrappedLine, 50, yPosition, fontSize, rgb(0, 0, 0));
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis-${uploadedFile?.name || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to text download
      const content = `Document Analysis Results\n\nSummary:\n${summary}\n\nKey Highlights:\n${highlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n${isTranslated && translatedText ? `Translation (${selectedLanguage}):\n${translatedText}` : ''}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis-${uploadedFile?.name || 'document'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [summary, highlights, isTranslated, translatedText, selectedLanguage, uploadedFile]);

  const handleSummarizeAgain = React.useCallback(() => {
    analyzeDocument();
  }, [analyzeDocument]);

  const handleTranslationToggle = async () => {
    if (isTranslated) {
      // Switch back to original text
      setIsTranslated(false);
    } else {
      // Translate the text
      try {
        const formData = new FormData();
        formData.append('text', summary);
        formData.append('targetLanguage', selectedLanguage);

        const response = await fetch('/api/translate', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Translation failed');
        }

        const data = await response.json();
        setTranslatedText(data.translatedText);
        setIsTranslated(true);
      } catch (error) {
        console.error('Translation error:', error);
        // Could add error handling UI here
      }
    }
  };

  const handleUploadNewClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadNewSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files && e.target.files[0];
    // reset the input so selecting the same file again re-triggers change
    e.target.value = '';
    if (!file) return;
    // Only accept PDFs
    if (file.type !== 'application/pdf') {
      setAnalysisError('Please select a PDF file.');
      return;
    }
    // Reset analysis/viewer state for a fresh start
    setIsTranslated(false);
    setTranslatedText('');
    setSummary('');
    setHighlights([]);
    setAnalysisError(null);
    setPageMode('all');
    setStartPage(1);
    setEndPage(1);
    setSelectedPages('all');
    setTotalPages(null);
    setUploadedUrl(null);
    setUploadedFile(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div>
            <Link href="/">
              <div className="flex items-center  mb-2">
                <ArrowLeft className="w-6 h-6 mr-2" />
                <h1 className="text-3xl font-bold text-gray-900 ">Document Analysis</h1>
              </div>
            </Link>
            <p className="text-gray-600">
              Upload your legal document for AI-powered analysis and simplification
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
           <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {!uploadedFile ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full">
              <UploadCard
                uploadedFile={uploadedFile}
                isProcessing={isProcessing}
                summary={summary}
                selectedPages={selectedPages}
                onFileUpload={setUploadedFile}
                onPageChange={setSelectedPages}
                onSummarizeAgain={handleSummarizeAgain}
              />
            </div>
          </div>
        ) : (
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="flex max-w-[600px] mx-auto">
              <TabsTrigger value="analysis" className="flex-1 px-8">
                Document Analysis
              </TabsTrigger>
              <TabsTrigger value="viewer" className="flex-1 px-8">
                Interactive PDF Viewer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="mt-4">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Upload & Controls */}
                <div className="space-y-6">
                  {/* Uploaded Document Section */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-gray-600" />
                          { 'Document'}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleUploadNewSelected}
                          />
                          <Button variant="outline" size="sm" onClick={handleUploadNewClick}>
                            <Upload className="w-5 h-5 text-gray-600" />
                            {'Upload New'}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {uploadedFile?.name || 'Legal_Documents_-_Modernising_the_Formalities.pdf'}
                            </div>
                            <div className="text-sm text-gray-500">{uploadedFile ? formatBytes(uploadedFile.size) : '--'}</div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            { isProcessing ? 'Uploading...' : 'Uploaded'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summarize Pages Section */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Summarize Pages</h3>
                        <Tabs value={pageMode} onValueChange={(v) => setPageMode(v as typeof pageMode)} className="w-full">
                          <TabsList className="w-full flex gap-2 bg-gray-100 p-1 rounded-lg">
                            <TabsTrigger value="first" className="flex-1 text-sm">First Page</TabsTrigger>
                            <TabsTrigger value="all" className="flex-1 text-sm">All Pages{totalPages ? ` (1-${totalPages})` : ''}</TabsTrigger>
                            <TabsTrigger value="range" className="flex-1 text-sm">Range</TabsTrigger>
                          </TabsList>
                          <TabsContent value="first" className="pt-4">
                            <p className="text-sm text-gray-600">Analyze only the first page.</p>
                          </TabsContent>
                          <TabsContent value="all" className="pt-4">
                            <p className="text-sm text-gray-600">Analyze the entire document.</p>
                          </TabsContent>
                          <TabsContent value="range" className="pt-4 space-y-3">
                            <div className="rounded-md border bg-gray-50 p-3 space-y-3">
                              <div className="flex gap-3">
                                <div className="flex-1 min-w-[140px]">
                                  <label className="block text-xs text-gray-600 mb-1">Start page</label>
                                  <Input
                                    type="number"
                                    min={1}
                                    max={totalPages ?? undefined}
                                    value={startPage}
                                    onChange={(e) => {
                                      const raw = Number(e.target.value);
                                      const max = totalPages ?? Math.max(raw, 1);
                                      const val = Math.min(Math.max(1, isNaN(raw) ? 1 : raw), max);
                                      setStartPage(val);
                                      if (val > endPage) setEndPage(val);
                                    }}
                                  />
                                </div>
                                <div className="flex-1 min-w-[140px]">
                                  <label className="block text-xs text-gray-600 mb-1">End page</label>
                                  <Input
                                    type="number"
                                    min={startPage}
                                    max={totalPages ?? undefined}
                                    value={endPage}
                                    onChange={(e) => {
                                      const raw = Number(e.target.value);
                                      const max = totalPages ?? Math.max(raw, startPage);
                                      const val = Math.min(Math.max(startPage, isNaN(raw) ? startPage : raw), max);
                                      setEndPage(val);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="text-xs text-gray-600">
                                {totalPages ? (
                                  <span>Document has {totalPages} pages. Selected: {Math.min(startPage, endPage)}–{Math.max(startPage, endPage)}</span>
                                ) : (
                                  <span>Upload a PDF to select a range.</span>
                                )}
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Highlighter className="w-4 h-4" />
                      Highlight
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleSummarizeAgain}
                      disabled={isProcessing}
                    >
                      <RotateCcw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                      Summarize Again
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" onClick={handleDownload} disabled={!summary}>
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Right Column - Analysis Results */}
                <div>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>AI Analysis Results</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={handleTextToSpeech}
                            disabled={!summary}
                            className={`${isSpeaking ? 'text-red-600 hover:text-red-700 hover:bg-red-100' : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'} transition-colors duration-200`}
                          >
                              <Volume2 className={`w-4 h-4 ${isSpeaking?"animate-pulse text-blue-600":""}`} />
                          </Button>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className={`${isTranslated ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-100' : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'} transition-colors duration-200`}
                              >
                                <Languages className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64" align="end">
                              <div className="space-y-3">
                                <h4 className="font-medium text-sm">Translate to</h4>
                                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
                                    <SelectItem value="fr">🇫🇷 French</SelectItem>
                                    <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                                    <SelectItem value="de">🇩🇪 German</SelectItem>
                                    <SelectItem value="it">🇮🇹 Italian</SelectItem>
                                    <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
                                    <SelectItem value="ru">🇷🇺 Russian</SelectItem>
                                    <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                                    <SelectItem value="ko">🇰🇷 Korean</SelectItem>
                                    <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                                    <SelectItem value="ar">🇸🇦 Arabic</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button 
                                  onClick={handleTranslationToggle}
                                  disabled={!summary}
                                  className="w-full"
                                  variant={isTranslated ? "default" : "outline"}
                                >
                                  {isTranslated ? 'Show Original' : 'Translate'}
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>

                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Status & Progress */}
                      {isProcessing ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <h3 className="font-medium text-gray-900 mb-2">Processing your document...</h3>
                          <p className="text-gray-600">Our AI is analyzing and simplifying the content</p>
                        </div>
                      ) : summary ? (
                        <div className="space-y-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium text-green-800">Analysis Complete</span>
                            </div>
                          </div>

                          <div className="prose max-w-none">
                            {renderHighlightedText(isTranslated && translatedText ? translatedText : summary)}
                          </div>

                          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Key Recommendations</h4>
                            {highlights.length > 0 ? (
                              <ul className="text-sm text-blue-800 space-y-1">
                                {highlights.map((point, index) => (
                                  <li key={index}>{point}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-blue-700">No specific recommendations found.</p>
                            )}
                          </div>
                        </div>
                      ) : analysisError ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm font-medium text-red-800">Analysis Failed</span>
                          </div>
                          <p className="text-sm text-red-700">{analysisError}</p>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <h3 className="font-medium text-gray-900 mb-2">Ready to analyze</h3>
                          <p className="text-gray-600">Upload a document to get started with AI analysis</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="viewer" className="mt-6">
              <div className="h-[800px] border rounded-lg overflow-hidden">
                <PDFViewer
                  documentUrl={uploadedUrl ?? '/sample.pdf'}
                  onAnnotation={(annotation) => {
                    console.log('New annotation:', annotation);
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

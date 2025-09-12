'use client';
import React from 'react';
import {
  ArrowLeft,
  Download,
  FileText,
  Highlighter,
  MoreHorizontal,
  RotateCcw,
  Type,
  Upload,
  Volume2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import dynamic from 'next/dynamic';

import Link from 'next/link';
import { UploadCard } from './UploadCard';
import { Badge } from './ui/badge';
import { useTTS } from '../hooks/useTTS';
const PDFViewer = dynamic(() => import('./PDFViewer').then((mod) => mod.PDFViewer), { ssr: false });


export function Dashboard() {
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [summary, setSummary] = React.useState<string>('');
  const [selectedPages, setSelectedPages] = React.useState<string>('all');

  // Use the TTS hook
  const { isSpeaking, handleTextToSpeech, renderHighlightedText } = useTTS(summary);

  // Simulate summary loading when file is uploaded
  React.useEffect(() => {
    if (uploadedFile) {
      setIsProcessing(true);
      setSummary('');
      setTimeout(() => {
        setIsProcessing(false);
        const newSummary = `This legal document is a standard employment contract that outlines the terms and conditions of employment. Key points include:\n\n• Employment term: Indefinite with 30-day notice period\n• Salary: $75,000 annually, paid bi-weekly\n• Benefits: Health insurance, dental coverage, and 401(k) matching\n• Working hours: 40 hours per week, flexible schedule\n• Confidentiality clauses: Standard non-disclosure agreements\n• Termination conditions: Either party may terminate with proper notice\n\nThe document appears to be compliant with local labor laws and contains standard protective clauses for both employer and employee.`;
        setSummary(newSummary);
      }, 2000);
    }
  }, [uploadedFile, selectedPages]);

  const handleSummarizeAgain = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newSummary = `Updated summary based on ${selectedPages} pages:\n\nThis employment agreement establishes a professional relationship with competitive compensation and comprehensive benefits. The contract emphasizes mutual respect and clear expectations for both parties.\n\nKey highlights:\n• Competitive salary with regular review opportunities\n• Comprehensive health and wellness benefits\n• Flexible work arrangements supporting work-life balance\n• Clear performance expectations and growth opportunities\n• Standard legal protections for intellectual property\n\nThe agreement follows best practices in employment law and provides a solid foundation for a successful working relationship.`;
      setSummary(newSummary);
    }, 1500);
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
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-gray-600" />
                        { 'Upload Document'}
                      </CardTitle>
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
                            <div className="text-sm text-gray-500">{uploadedFile ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : '0.39 MB'}</div>
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
                        <Select value={selectedPages} onValueChange={setSelectedPages}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Pages</SelectItem>
                            <SelectItem value="1-5">Pages 1-5</SelectItem>
                            <SelectItem value="5-10">Pages 5-10</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
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
                    <Button variant="outline" className="flex items-center gap-2" disabled={!summary}>
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
                          <Button variant="ghost" size="sm">
                            <Type className="w-4 h-4" />
                          </Button>
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
                            {renderHighlightedText(summary)}
                          </div>

                          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Key Recommendations</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• Review the termination clauses carefully</li>
                              <li>• Understand your benefits eligibility timeline</li>
                              <li>• Consider legal consultation for any concerns</li>
                            </ul>
                          </div>
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
                  documentUrl="/sample.pdf"
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

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Upload, FileText, Highlighter, Download, RefreshCw, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DocumentUploadProps {
  onBack: () => void;
}

export function DocumentUpload({ onBack }: DocumentUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState("");
  const [selectedPages, setSelectedPages] = useState<string>("all");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Simulate processing
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setSummary(`This legal document is a standard employment contract that outlines the terms and conditions of employment. Key points include:

• Employment term: Indefinite with 30-day notice period
• Salary: $75,000 annually, paid bi-weekly
• Benefits: Health insurance, dental coverage, and 401(k) matching
• Working hours: 40 hours per week, flexible schedule
• Confidentiality clauses: Standard non-disclosure agreements
• Termination conditions: Either party may terminate with proper notice

The document appears to be compliant with local labor laws and contains standard protective clauses for both employer and employee.`);
      }, 2000);
    }
  };

  const handleSummarizeAgain = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSummary(`Updated summary based on ${selectedPages} pages:

This employment agreement establishes a professional relationship with competitive compensation and comprehensive benefits. The contract emphasizes mutual respect and clear expectations for both parties.

Key highlights:
• Competitive salary with regular review opportunities
• Comprehensive health and wellness benefits
• Flexible work arrangements supporting work-life balance
• Clear performance expectations and growth opportunities
• Standard legal protections for intellectual property

The agreement follows best practices in employment law and provides a solid foundation for a successful working relationship.`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Document Analysis</h1>
          <p className="text-gray-600 mt-2">Upload your legal document for AI-powered analysis and simplification</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Upload your document</h3>
                  <p className="text-gray-600 mb-4">Drag and drop or click to browse</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                      Choose File
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Supports PDF, DOC, DOCX, TXT files</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{uploadedFile.name}</h3>
                      <p className="text-sm text-gray-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Uploaded
                    </Badge>
                  </div>

                  {/* Page Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Summarize Pages</label>
                    <Select value={selectedPages} onValueChange={setSelectedPages}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pages to summarize" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Pages</SelectItem>
                        <SelectItem value="1-5">Pages 1-5</SelectItem>
                        <SelectItem value="5-10">Pages 5-10</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Highlighter className="w-4 h-4 mr-2" />
                      Highlight
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleSummarizeAgain}
                      disabled={isProcessing}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                      Summarize Again
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={!summary}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
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
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {summary}
                    </div>
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
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1659035260002-11d486d6e9f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHVwbG9hZCUyMGludGVyZmFjZXxlbnwxfHx8fDE3NTY5Njg4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Document analysis illustration"
                    className="w-32 h-32 mx-auto mb-4 rounded-lg object-cover"
                  />
                  <h3 className="font-medium text-gray-900 mb-2">Ready to analyze</h3>
                  <p className="text-gray-600">Upload a document to get started with AI analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
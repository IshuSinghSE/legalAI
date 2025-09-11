"use client";
import {
  ArrowLeft,
  Upload,
  FileText,
  Highlighter,
  RotateCcw,
  Download,
  Volume2,
  Type,
  MoreHorizontal
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";



export function Dashboard() {
  const analysisResults = {
    status: "complete",
    description: "Independent contractor contract that outlines the terms and conditions",
    keyPoints: [
      "Employment term: Indefinite with 30 days notice",
      "Salary",
      "Benefits: Health",
      "Working hours: 40 hours per week",
      "Confidentiality clauses: Standard non-disclosure",
      "Termination conditions"
    ],
    recommendations: [
      "Key recommendations: Consult with contract management",
      "Review termination clauses carefully",
      "Understand your benefits eligibility timeline",
      "Consider legal consultation"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <Link href={'/'} className="inline-flex items-center text-3xl font-bold text-gray-900">
              <ArrowLeft className="w-6 h-6 mr-2" />
              <span>Document Analysis</span>
            </Link>
            <p className="text-gray-600">Upload your legal document for AI-powered analysis and simplification</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Controls */}
          <div className="space-y-6">
            {/* Upload Document Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Document
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
                        Legal_Documents_-_Modernising_the_Formalities.pdf
                      </div>
                      <div className="text-sm text-gray-500">0.39 MB</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summarize Pages Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Summarize Pages</h3>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pages</SelectItem>
                      <SelectItem value="page1">Page 1</SelectItem>
                      <SelectItem value="page2">Page 2</SelectItem>
                      <SelectItem value="page3">Page 3</SelectItem>
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
              <Button variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Summarize Again
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
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
                    <Button variant="ghost" size="sm">
                      <Volume2 className="w-4 h-4" />
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
                {/* Status */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Analysis Complete</span>
                </div>

                {/* Document Description */}
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {analysisResults.description}
                  </p>
                </div>

                {/* Key Points */}
                <div>
                  <ul className="space-y-2">
                    {analysisResults.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  {analysisResults.recommendations.map((recommendation, index) => (
                    <p key={index} className="text-gray-700 text-sm leading-relaxed">
                      {recommendation}
                    </p>
                  ))}
                </div>

                {/* Download Button */}
                <div className="flex justify-end pt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Upload, FileText, Highlighter, Download, RefreshCw } from 'lucide-react';

interface UploadCardProps {
    uploadedFile: File | null;
    isProcessing: boolean;
    summary: string;
    selectedPages: string;
    onFileUpload: (file: File) => void;
    onPageChange: (pages: string) => void;
    onSummarizeAgain: () => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({
    uploadedFile,
    isProcessing,
    summary,
    selectedPages,
    onFileUpload,
    onPageChange,
    onSummarizeAgain,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Drag-and-drop support
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            onFileUpload(event.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Document
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!uploadedFile ? (
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                                    <Upload className="w-8 h-8 text-blue-600" />
                                  </div>
                        <h3 className="font-medium text-gray-900 mb-2">Upload your document</h3>
                        <p className="text-gray-600 mb-4">Drag and drop or click to browse</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choose File
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">Supports PDF, DOC, DOCX, TXT files</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{uploadedFile.name}</h3>
                                <p className="text-sm text-gray-600">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Uploaded
                            </Badge>
                        </div>
                        {/* Page Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Summarize Pages</label>
                            <Select value={selectedPages} onValueChange={onPageChange}>
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
                            <Button variant="outline" size="sm" className="flex-1">
                                <Highlighter className="w-4 h-4 mr-2" />
                                Highlight
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={onSummarizeAgain}
                                disabled={isProcessing}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                                Summarize Again
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1" disabled={!summary}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

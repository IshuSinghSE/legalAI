import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Document Analysis • LegalAI',
  description: 'Upload your legal document for AI-powered analysis and simplification.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal, clean header */}
      {/* <header className="w-full bg-white px-8 pt-10 pb-4">
        <h1 className="font-bold text-3xl text-gray-900 mb-2">Document Analysis</h1>
        <p className="text-gray-500 text-lg">
          Upload your legal document for AI-powered analysis and simplification
        </p>
      </header> */}
      {children}
    </div>
  );
}

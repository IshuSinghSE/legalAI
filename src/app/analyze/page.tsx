"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();
  const params = useSearchParams();
  const docId = params.get("docId");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Analysis in Progress</h1>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 mb-8">Your document is being analyzed by AI...</p>
      {docId && <div className="text-xs text-gray-400">Document ID: {docId}</div>}
      {/* TODO: Show summary and recommendations when ready */}
      <button
        className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => {
          if (docId) router.push(`/viewer/${docId}`);
        }}
        disabled={!docId}
      >
        View Document
      </button>
    </div>
  );
}

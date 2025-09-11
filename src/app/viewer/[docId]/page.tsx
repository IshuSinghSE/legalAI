"use client";
import { useParams } from "next/navigation";

export default function ViewerPage() {
  const params = useParams();
  const docId = params?.docId;
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">PDF Viewer</h1>
      <div className="mb-4 text-gray-500">Document ID: {docId}</div>
      {/* TODO: Render PDF, highlights, floating toolbar, sidebar */}
      <div className="w-full max-w-3xl h-[600px] bg-white rounded-xl shadow flex items-center justify-center text-gray-400">
        [PDF will be rendered here]
      </div>
    </div>
  );
}

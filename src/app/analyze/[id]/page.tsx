import { PDFViewerWithToolbar } from "@/components/PDFViewerWithToolbar";

export default function AnalysisPage() {
  // Dummy callbacks
  const handleHighlight = () => alert("Highlight Key Points triggered!");
  const handleAskAI = (question: string) => alert(`AI Question: ${question}`);
  const handleDownloadHighlights = () => alert("Download Highlights triggered!");

  // Dummy PDF file (replace with your upload logic)
  const fileUrl = "/sample.pdf";

  return (
    <div className="min-h-screen flex flex-row bg-gray-50">
      {/* Left Panel: AI Analysis */}
      <aside className="w-2/5 p-8 bg-white border-r flex flex-col">
        <h2 className="text-2xl font-bold mb-4">AI Analysis Results</h2>
        <div className="text-gray-700">
          {/* Placeholder content */}
          <ul className="list-disc pl-6 space-y-2">
            <li>Key clauses detected</li>
            <li>Risks and obligations summarized</li>
            <li>Recommendations for review</li>
          </ul>
        </div>
      </aside>
      {/* Right Panel: PDF Viewer */}
      <main className="w-3/5 p-8 flex items-center justify-center">
        <div className="w-full h-[80vh]">
          <PDFViewerWithToolbar
            fileUrl={fileUrl}
            onHighlight={handleHighlight}
            onAskAI={handleAskAI}
            onDownloadHighlights={handleDownloadHighlights}
          />
        </div>
      </main>
    </div>
  );
}
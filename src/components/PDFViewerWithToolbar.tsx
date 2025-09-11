"use client";
import { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  Highlighter,
  Bot,
  Download,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import clsx from "clsx";

export type PDFViewerWithToolbarProps = {
  fileUrl: string;
  onHighlight: () => void;
  onAskAI: (question: string) => void;
  onDownloadHighlights: () => void;
};

export function PDFViewerWithToolbar({
  fileUrl,
  onHighlight,
  onAskAI,
  onDownloadHighlights,
}: PDFViewerWithToolbarProps) {
  const [showModal, setShowModal] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");

  // PDF.js worker
  const workerUrl =
    "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  // Toolbar plugin (for zoom/page nav)
  const toolbar = toolbarPlugin();

  // Custom floating toolbar
  return (
    <div className="relative h-full w-full bg-gray-100 rounded-lg overflow-hidden">
      <Worker workerUrl={workerUrl}>
        <Viewer
          fileUrl={fileUrl}
          plugins={[toolbar]}
          defaultScale={1}
        />
      </Worker>
      {/* Floating Toolbar */}
      <div
        className={clsx(
          "absolute top-6 right-6 z-20 flex flex-col gap-3 p-4 rounded-xl backdrop-blur bg-white/70 shadow-lg transition-opacity",
          "border border-gray-200"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-blue-100"
          onClick={onHighlight}
          title="Highlight Key Points"
        >
          <Highlighter className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-blue-100"
          onClick={() => setShowModal(true)}
          title="Ask AI"
        >
          <Bot className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-blue-100"
          onClick={onDownloadHighlights}
          title="Download Highlights"
        >
          <Download className="w-5 h-5" />
        </Button>
      </div>
      {/* Ask AI Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Ask AI</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="Type your question..."
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={() => {
              onAskAI(aiQuestion);
              setShowModal(false);
              setAiQuestion("");
            }}
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
}
"use client";

import { DocumentUpload } from "@/components/DocumentUpload";

export default function UploadPage() {
  return <DocumentUpload onBack={() => { window.location.href = "/"; }} />;
}

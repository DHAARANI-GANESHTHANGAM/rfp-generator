import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Home() {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [tab, setTab]           = useState("upload"); // "upload" or "paste"
  const [pastedText, setPasted] = useState("");
  const navigate                = useNavigate();

  // ── Handle PDF Upload ───────────────────────────────────────────────
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API_URL}/api/generate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Save result to localStorage and navigate to response page
      localStorage.setItem("rfp_result", JSON.stringify(res.data));
      navigate("/response");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ── Handle Pasted Text ──────────────────────────────────────────────
  const handlePasteSubmit = async () => {
    if (!pastedText || pastedText.length < 50) {
      setError("Please paste more RFP content.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/api/generate-text`, {
        text: pastedText,
      });

      localStorage.setItem("rfp_result", JSON.stringify(res.data));
      navigate("/response");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-2 text-center">
        RFP Response Generator
      </h1>
      <p className="text-gray-400 mb-8 text-center">
        Upload an RFP and let AI draft your response in seconds.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("upload")}
          className={`px-4 py-2 rounded-lg font-medium ${
            tab === "upload"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400"
          }`}
        >
          Upload PDF
        </button>
        <button
          onClick={() => setTab("paste")}
          className={`px-4 py-2 rounded-lg font-medium ${
            tab === "paste"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400"
          }`}
        >
          Paste Text
        </button>
      </div>

      {/* Upload Area */}
      {tab === "upload" && (
        <div
          {...getRootProps()}
          className={`w-full max-w-lg border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-600 hover:border-blue-500"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-2xl mb-2">📄</p>
          {isDragActive ? (
            <p className="text-blue-400">Drop it here...</p>
          ) : (
            <>
              <p className="text-gray-300">Drag & drop your RFP PDF here</p>
              <p className="text-gray-500 text-sm mt-1">
                or click to browse files
              </p>
            </>
          )}
        </div>
      )}

      {/* Paste Text Area */}
      {tab === "paste" && (
        <div className="w-full max-w-lg">
          <textarea
            value={pastedText}
            onChange={(e) => setPasted(e.target.value)}
            placeholder="Paste your RFP text here..."
            className="w-full h-48 bg-gray-800 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handlePasteSubmit}
            disabled={loading}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Response →"}
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-6 text-center">
          <div className="animate-spin text-3xl mb-2">⚙️</div>
          <p className="text-gray-400">
            AI is reading and drafting your response...
          </p>
          <p className="text-gray-500 text-sm">This takes 15–30 seconds</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function Response() {
  const [result, setResult]   = useState(null);
  const [edited, setEdited]   = useState("");
  const [tab, setTab]         = useState("response"); // "summary" or "response"
  const navigate              = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("rfp_result");
    if (!saved) {
      navigate("/");
      return;
    }
    const data = JSON.parse(saved);
    setResult(data);
    setEdited(data.drafted_response);
  }, [navigate]);

  // ── Export to PDF ───────────────────────────────────────────────────
  const exportPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(edited, 180);
    doc.setFontSize(12);
    doc.text(lines, 15, 20);
    doc.save("rfp-response.pdf");
  };

  if (!result) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your RFP Response</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-800 rounded-lg text-sm"
            >
              ← New RFP
            </button>
            <button
              onClick={exportPDF}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("summary")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === "summary"
                ? "bg-blue-600"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            RFP Summary
          </button>
          <button
            onClick={() => setTab("response")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === "response"
                ? "bg-blue-600"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            Draft Response
          </button>
        </div>

        {/* RFP Summary */}
        {tab === "summary" && (
          <div className="bg-gray-800 rounded-xl p-6 whitespace-pre-wrap text-gray-200 text-sm leading-relaxed">
            {result.rfp_summary}
          </div>
        )}

        {/* Editable Response */}
        {tab === "response" && (
          <>
            <p className="text-gray-500 text-sm mb-2">
              ✏️ Edit the draft below before exporting.
            </p>
            <textarea
              value={edited}
              onChange={(e) => setEdited(e.target.value)}
              className="w-full h-[600px] bg-gray-800 border border-gray-700 rounded-xl p-6 text-gray-100 text-sm leading-relaxed resize-none focus:outline-none focus:border-blue-500 font-mono"
            />
          </>
        )}

      </div>
    </div>
  );
}

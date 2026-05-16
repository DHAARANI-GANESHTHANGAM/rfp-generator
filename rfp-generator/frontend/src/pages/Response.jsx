import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function Response() {
  const [result, setResult] = useState(null);
  const [edited, setEdited] = useState("");
  const [tab, setTab]       = useState("response");
  const [saved, setSaved]   = useState(false);
  const [winScore, setWinScore] = useState(null);
  const navigate            = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("rfp_result");
    if (!data) { navigate("/"); return; }
    const parsed = JSON.parse(data);
    setResult(parsed);
    setEdited(parsed.drafted_response);
    if (parsed.win_score) setWinScore(parsed.win_score);
  }, [navigate]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(edited, 180), 15, 20);
    doc.save("rfp-response.pdf");
  };

  const saveToHistory = () => {
    const history = JSON.parse(localStorage.getItem("rfp_history") || "[]");
    history.unshift({ ...result, savedAt: new Date().toLocaleString(), edited });
    localStorage.setItem("rfp_history", JSON.stringify(history));
    setSaved(true);
  };

  if (!result) return null;

  const tabs = ["summary", "response", "sections", "win score"];

  return (
    <div style={{ padding: "40px", maxWidth: "900px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#fff",
            marginBottom: "6px" }}>Your RFP Response</h1>
          <p style={{ color: "#555", fontSize: "14px" }}>
            Review, edit, and export your AI-drafted proposal
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => navigate("/")} style={{
            padding: "9px 16px", background: "#111118",
            border: "1px solid #1e1e2e", borderRadius: "8px",
            color: "#888", fontSize: "13px", cursor: "pointer",
          }}>← New RFP</button>
          <button onClick={saveToHistory} style={{
            padding: "9px 16px", background: saved ? "#1a2e1a" : "#111118",
            border: `1px solid ${saved ? "#22c55e" : "#1e1e2e"}`,
            borderRadius: "8px", color: saved ? "#22c55e" : "#888",
            fontSize: "13px", cursor: "pointer",
          }}>
            {saved ? "✅ Saved" : "💾 Save"}
          </button>
          <button onClick={exportPDF} style={{
            padding: "9px 16px", background: "#6366f1",
            border: "none", borderRadius: "8px",
            color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer",
          }}>⬇️ Export PDF</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px",
        background: "#0d0d14", padding: "4px", borderRadius: "8px",
        border: "1px solid #1e1e2e", width: "fit-content" }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", borderRadius: "6px", border: "none",
            cursor: "pointer", fontSize: "13px", fontWeight: "500",
            background: tab === t ? "#6366f1" : "transparent",
            color: tab === t ? "#fff" : "#555",
            textTransform: "capitalize", transition: "all 0.15s",
          }}>{t}</button>
        ))}
      </div>

      {/* Summary Tab */}
      {tab === "summary" && (
        <div style={{ background: "#111118", border: "1px solid #1e1e2e",
          borderRadius: "12px", padding: "24px" }}>
          <h3 style={{ color: "#6366f1", fontSize: "13px", fontWeight: "600",
            letterSpacing: "1px", marginBottom: "16px" }}>RFP ANALYSIS</h3>
          <pre style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.8",
            whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
            {result.rfp_summary}
          </pre>
        </div>
      )}

      {/* Response Tab */}
      {tab === "response" && (
        <div>
          <p style={{ color: "#555", fontSize: "13px", marginBottom: "12px" }}>
            ✏️ Edit the draft below before exporting
          </p>
          <textarea value={edited} onChange={(e) => setEdited(e.target.value)}
            style={{ width: "100%", height: "560px",
              background: "#111118", border: "1px solid #1e1e2e",
              borderRadius: "12px", padding: "24px", color: "#ccc",
              fontSize: "14px", lineHeight: "1.8", resize: "none",
              outline: "none", fontFamily: "monospace", boxSizing: "border-box" }} />
        </div>
      )}

      {/* Sections Tab */}
      {tab === "sections" && result.sections && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {Object.entries(result.sections).map(([key, value]) => (
            <div key={key} style={{ background: "#111118",
              border: "1px solid #1e1e2e", borderRadius: "12px", padding: "24px" }}>
              <h3 style={{ color: "#6366f1", fontSize: "12px", fontWeight: "600",
                letterSpacing: "1px", marginBottom: "12px",
                textTransform: "uppercase" }}>
                {key.replace(/_/g, " ")}
              </h3>
              <p style={{ color: "#aaa", fontSize: "14px",
                lineHeight: "1.8", whiteSpace: "pre-wrap" }}>{value}</p>
            </div>
          ))}
        </div>
      )}
      {/*Win Score Tab*/}
      {tab === "win score" && winScore && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Score Card */}
          <div style={{ background: "#111118", border: "1px solid #1e1e2e",
            borderRadius: "12px", padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "#555", letterSpacing: "1px",
                marginBottom: "12px" }}>WIN PROBABILITY</div>
              <div style={{ fontSize: "72px", fontWeight: "700",
                color: parseInt(winScore.SCORE) >= 70 ? "#22c55e" :
                       parseInt(winScore.SCORE) >= 50 ? "#f59e0b" : "#ef4444" }}>
                {winScore.SCORE}
              </div>
              <div style={{ fontSize: "14px", color: "#555", marginBottom: "8px" }}>out of 100</div>
              <div style={{ display: "inline-block", padding: "6px 20px",
                borderRadius: "20px", fontSize: "13px", fontWeight: "600",
                background: parseInt(winScore.SCORE) >= 70 ? "#14532d" :
                            parseInt(winScore.SCORE) >= 50 ? "#451a03" : "#450a0a",
                color: parseInt(winScore.SCORE) >= 70 ? "#22c55e" :
                       parseInt(winScore.SCORE) >= 50 ? "#f59e0b" : "#ef4444" }}>
                {winScore.RATING}
              </div>
            </div>

            {/* Strengths */}
           <div style={{ background: "#111118", border: "1px solid #1e1e2e",
            borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ color: "#22c55e", fontSize: "13px", fontWeight: "600",
              letterSpacing: "1px", marginBottom: "16px" }}>✅ STRENGTHS</h3>
            {[winScore.STRENGTH_1, winScore.STRENGTH_2, winScore.STRENGTH_3]
              .filter(Boolean).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "10px",
                marginBottom: "12px", alignItems: "flex-start" }}>
                <span style={{ color: "#22c55e", fontSize: "16px" }}>→</span>
                <p style={{ color: "#aaa", fontSize: "14px",
                  lineHeight: "1.6", margin: 0 }}>{s}</p>
              </div>
            ))}
          </div>

          {/* Challenges */}
          <div style={{ background: "#111118", border: "1px solid #1e1e2e",
            borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ color: "#f59e0b", fontSize: "13px", fontWeight: "600",
              letterSpacing: "1px", marginBottom: "16px" }}>⚠️ CHALLENGES</h3>
            {[winScore.CHALLENGE_1, winScore.CHALLENGE_2]
              .filter(Boolean).map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "10px",
                marginBottom: "12px", alignItems: "flex-start" }}>
                <span style={{ color: "#f59e0b", fontSize: "16px" }}>→</span>
                <p style={{ color: "#aaa", fontSize: "14px",
                  lineHeight: "1.6", margin: 0 }}>{c}</p>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          {winScore.RECOMMENDATION && (
            <div style={{ background: "#13131f", border: "1px solid #2e2e5e",
              borderRadius: "12px", padding: "20px",
              display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "20px" }}>💡</span>
              <p style={{ color: "#8888cc", fontSize: "14px",
                lineHeight: "1.6", margin: 0 }}>
                <strong style={{ color: "#6366f1" }}>Recommendation: </strong>
                {winScore.RECOMMENDATION}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
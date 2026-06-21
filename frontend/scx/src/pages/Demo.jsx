import { useMemo, useState } from "react";
import { demoClassify } from "../lib/classifier";

const CHIPS = [
  "I want to track my refund status",
  "cancel my order please",
  "my payment was declined",
  "this service is terrible, get me a human",
  "how do I reset my password",
];

export default function Demo() {
  const [msg, setMsg] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backend, setBackend] = useState(import.meta.env.VITE_API_URL || "");

  const stats = useMemo(() => {
    const total = history.length;
    const esc = history.filter((h) => h.escalate).length;
    return { total, esc, bot: total - esc };
  }, [history]);

  async function analyze(input) {
    const text = (input ?? msg).trim();
    if (!text) return;
    setLoading(true);
    let res;
    if (backend) {
      try {
        const r = await fetch(backend.replace(/\/$/, "") + "/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
        res = await r.json();
      } catch {
        res = { intent: "(backend unreachable)", confidence: 0, escalate: true, suggested_reply: "Could not reach your backend. Check the URL and that it is awake." };
      }
    } else {
      res = demoClassify(text);
    }
    setResult(res);
    setHistory((h) => [{ message: text, intent: res.intent, escalate: res.escalate }, ...h]);
    setMsg("");
    setLoading(false);
  }

  const pct = Math.round((result?.confidence || 0) * 100);

  return (
    <div className="demo-wrap">
      <div className="demo-head">
        <h2>Live demo</h2>
        <p>Type a customer-support message and watch the model classify it.</p>
      </div>

      <div className="mode-banner">
        <span>
          {backend
            ? <><b style={{ color: "var(--accent)" }}>Connected to your backend</b> — predictions come from your real CNN-BiLSTM model.</>
            : <><b>Demo mode</b> (offline keyword model). Paste your backend URL to use the real model:</>}
        </span>
        <input value={backend} placeholder="https://your-app.onrender.com" onChange={(e) => setBackend(e.target.value)} />
      </div>

      <div className="metrics">
        <div className="metric"><div className="lbl">Messages</div><div className="val">{stats.total}</div></div>
        <div className="metric"><div className="lbl">Escalations</div><div className="val" style={{ color: "var(--danger)" }}>{stats.esc}</div></div>
        <div className="metric"><div className="lbl">Bot-handled</div><div className="val" style={{ color: "var(--accent)" }}>{stats.bot}</div></div>
      </div>

      <div className="chips">
        {CHIPS.map((c) => <span key={c} className="chip" onClick={() => analyze(c)}>{c}</span>)}
      </div>

      <div className="input-row">
        <input value={msg} placeholder="e.g. where is my order?" onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && analyze()} />
        <button className="btn btn-solid" onClick={() => analyze()} disabled={loading}>{loading ? "..." : "Analyze"}</button>
      </div>

      {result && (
        <div className={"result" + (result.escalate ? " esc" : "")}>
          <div className="row"><span className="k">Predicted intent</span><span className="badge">{result.intent}</span></div>
          <div className="row"><span className="k">Confidence</span><div className="bar"><div style={{ width: pct + "%" }} /></div><span style={{ fontWeight: 500 }}>{pct}%</span></div>
          <div className="row"><span className="k">Escalation</span><span className={"pill " + (result.escalate ? "no" : "ok")}>{result.escalate ? "Yes — route to human" : "No — bot can handle"}</span></div>
          <div className="reply"><div className="k">Suggested reply</div><p>{result.suggested_reply}</p></div>
        </div>
      )}

      <div className="history">
        <h4>History</h4>
        {history.length === 0
          ? <div className="empty">No messages yet — try one above.</div>
          : history.map((h, n) => (
            <div key={n} className="hist-item"><span>{h.message}</span><span className="tag">{h.intent}</span></div>
          ))}
      </div>
    </div>
  );
}

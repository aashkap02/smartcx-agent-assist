import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EXAMPLES = [
  { m: "I want to track my refund status", i: "track_refund" },
  { m: "cancel my order please", i: "cancel_order" },
  { m: "my payment was declined", i: "payment_issue" },
  { m: "this is terrible, get me a human", i: "contact_human_agent" },
];

export default function Home() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer;
    const ex = EXAMPLES[idx];
    let i = 0;
    setText("");
    setShow(false);
    const type = () => {
      if (i <= ex.m.length) { setText(ex.m.slice(0, i)); i++; timer = setTimeout(type, 45); }
      else { setShow(true); timer = setTimeout(() => setIdx((p) => (p + 1) % EXAMPLES.length), 2400); }
    };
    timer = setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, [idx]);

  return (
    <header className="hero">
      <div className="eyebrow">Conversational AI · Support automation</div>
      <h1>Understand every customer message <span className="grad">in an instant</span></h1>
      <p>SmartCX reads a support message, predicts the customer's intent, flags when a human is needed, and suggests a reply — powered by a CNN-BiLSTM model.</p>

      <div className="live-card">
        <div className="live-top"><span className="dot" /> Live classification</div>
        <div className="live-msg">{text}<span className="caret" /></div>
        <div className={"live-intent" + (show ? " in" : "")}>
          <span className="k">intent</span>
          <span className="badge">{EXAMPLES[idx].i}</span>
        </div>
      </div>

      <div className="cta-row">
        <button className="btn btn-solid btn-lg" onClick={() => navigate("/demo")}>Try the live demo</button>
        <button className="btn btn-ghost btn-lg" onClick={() => navigate("/about")}>Learn more</button>
      </div>
    </header>
  );
}

import Reveal from "../components/Reveal";

const FEATURES = [
  { h: "Intent detection", p: "Classifies messages into 27 support intents like refunds, cancellations, and payment issues." },
  { h: "Smart escalation", p: "Flags angry or low-confidence messages so a human agent can step in." },
  { h: "Suggested replies", p: "Drafts a response for every message to speed up the support team." },
];

const STEPS = [
  ["01", "You type a message", "on the demo page. The React frontend sends it to the backend."],
  ["02", "FastAPI cleans and encodes it", "using the saved vocabulary, then runs the CNN-BiLSTM model."],
  ["03", "The model returns", "the predicted intent, confidence score, escalation flag, and suggested reply."],
  ["04", "The dashboard updates", "with totals for messages, escalations, and bot-handled conversations."],
];

export default function About() {
  return (
    <section className="panel">
      <Reveal><h2>About the website</h2></Reveal>
      <Reveal delay={80}>
        <p className="lead">SmartCX Agent Assist is a full-stack conversational AI tool for customer-support automation. You type a message and a deep-learning model classifies its intent, estimates confidence, decides whether to escalate to a human, and drafts a suggested reply.</p>
      </Reveal>
      <div className="features">
        {FEATURES.map((f, n) => (
          <Reveal key={f.h} delay={n * 120}>
            <div className="card"><h3>{f.h}</h3><p>{f.p}</p></div>
          </Reveal>
        ))}
      </div>
      <div className="steps">
        {STEPS.map((s, n) => (
          <Reveal key={s[0]} delay={n * 90}>
            <div className="step"><div className="num">{s[0]}</div><p><b>{s[1]}</b> {s[2]}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

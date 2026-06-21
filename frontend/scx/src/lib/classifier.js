// Real suggested replies (trimmed) from your model's response_map.json
export const REPLIES = {
  track_order: "I'm happy to help you check the ETA for your order. You can find the latest status in the order tracking section of our website.",
  track_refund: "I understand you'd like an update on your reimbursement. Let me check for any recent updates on your refund status.",
  get_refund: "I can guide you through requesting a refund. Could you share a few details about the order so I can help?",
  cancel_order: "I can help you cancel that order. Please confirm the order number and I'll take care of it.",
  change_order: "I can help you change items in your order. Which items would you like to update?",
  payment_issue: "Sorry you're having trouble with a payment. Our team can help you report and resolve the error right away.",
  check_payment_methods: "We accept credit/debit cards, PayPal, bank transfer, Apple Pay, and Google Wallet.",
  recover_password: "To reset your password, go to account settings, choose 'Reset', and follow the steps on screen.",
  create_account: "I'd be glad to help you create a new account. Could you share your name and email to get started?",
  delete_account: "I can help you close your account. Let me walk you through the steps to do that safely.",
  change_shipping_address: "Sure — share the new delivery address and I'll update it on your order.",
  delivery_options: "We offer standard, expedited, overnight shipping, and in-store pickup. Which suits you best?",
  get_invoice: "I can help you download your invoice. Are you accessing it from our website or an app?",
  newsletter_subscription: "I can update your newsletter preferences. Please confirm the email you'd like changed.",
  review: "We'd love your feedback! You can leave a review in the 'Feedback' section of our website.",
  complaint: "I'm sorry to hear that. I want to make this right — let me connect you with someone who can help.",
  contact_human_agent: "Of course — I'll connect you with a human agent right away. One moment please.",
  contact_customer_service: "I'm not fully sure what you need — let me connect you with our support team to help.",
};

const ESCALATE = { complaint: 1, review: 1, contact_human_agent: 1 };

const RULES = [
  [/(refund|reimburs).*(status|track|update)|track.*refund/, "track_refund", 0.94],
  [/(get|want|need|my).*(refund|money back)|refund my|reimburse/, "get_refund", 0.9],
  [/track|where.*(order|package|parcel|delivery)|order status|eta/, "track_order", 0.9],
  [/cancel/, "cancel_order", 0.93],
  [/change.*(order|item)|edit.*order/, "change_order", 0.82],
  [/(payment|card|pay).*(fail|declin|error|problem|issue)|declined/, "payment_issue", 0.9],
  [/payment method|how.*pay|accept.*(card|pay)/, "check_payment_methods", 0.88],
  [/(reset|forgot|recover|change).*(password|pin)|can'?t log/, "recover_password", 0.93],
  [/(create|open|new|sign ?up).*account/, "create_account", 0.86],
  [/(delete|close|remove).*account/, "delete_account", 0.88],
  [/(change|update|edit).*(address|shipping)/, "change_shipping_address", 0.85],
  [/delivery option|shipping option|ways.*deliver/, "delivery_options", 0.82],
  [/invoice|bill/, "get_invoice", 0.8],
  [/newsletter|subscrib|unsubscrib/, "newsletter_subscription", 0.82],
  [/review|feedback|opinion/, "review", 0.8],
  [/human|agent|talk to (a |some)?(person|someone)/, "contact_human_agent", 0.85],
  [/terrible|awful|angry|worst|complaint|ridiculous|unhappy|disgust/, "complaint", 0.8],
];

const clean = (t) => t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

export function demoClassify(msg) {
  const t = clean(msg);
  let best = null;
  for (const r of RULES) { if (r[0].test(t)) { best = r; break; } }
  if (!best) return { intent: "contact_customer_service", confidence: 0.35, escalate: true, suggested_reply: REPLIES.contact_customer_service };
  const intent = best[1], confidence = best[2];
  return { intent, confidence, escalate: !!ESCALATE[intent] || confidence < 0.4, suggested_reply: REPLIES[intent] || "Let me connect you with an agent." };
}

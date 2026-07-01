import json, re, torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import CNNBiLSTM
from auth_routes import router as auth_router
from llm import generate_reply

# ---------- load model artifacts ----------
ART = "model_artifacts"
vocab        = json.load(open(f"{ART}/vocab.json"))
label_map    = json.load(open(f"{ART}/label_map.json"))
response_map = json.load(open(f"{ART}/response_map.json"))
config       = json.load(open(f"{ART}/model_config.json"))
inv_label    = {int(v): k for k, v in label_map.items()}

model = CNNBiLSTM(config["vocab_size"], config["n_classes"], config["emb"], config["hid"])
model.load_state_dict(torch.load(f"{ART}/best_cnn_bilstm_intent.pth", map_location="cpu"))
model.eval()

def clean(t):
    t = str(t).lower()
    t = re.sub(r"\{\{.*?\}\}", " placeholder ", t)
    t = re.sub(r"[^a-z0-9\s]", " ", t)
    return re.sub(r"\s+", " ", t).strip()

def encode(t):
    ids = [vocab.get(w, 1) for w in clean(t).split()][:config["max_len"]]
    ids += [0] * (config["max_len"] - len(ids))
    return torch.tensor([ids], dtype=torch.long)

# ---------- app ----------
app = FastAPI(title="SmartCX Agent Assist API")
app.add_middleware(
    CORSMiddleware, allow_origins=["*"],
    allow_methods=["*"], allow_headers=["*"],
)
app.include_router(auth_router)     # adds /auth/signup, /auth/login, /auth/me

class Msg(BaseModel):
    message: str
    history: list = []

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(req: Msg):
    with torch.no_grad():
        probs = torch.softmax(model(encode(req.message)), dim=1)[0]
        conf, idx = probs.max(0)
    intent = inv_label[idx.item()]
    confidence = round(conf.item(), 3)
    escalate = (intent in config["escalate_intents"] and confidence >= 0.60) or (confidence < 0.15)
    
    return {
        "message": req.message,
        "intent": intent,
        "confidence": confidence,
        "escalate": escalate,
        "suggested_reply": generate_reply(req.message, intent, escalate, response_map, req.history),
    }
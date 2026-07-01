"""
Interactive terminal chat for SmartCX.

Run your backend in one terminal (python -m uvicorn app:app --reload),
then run this in a second terminal:  python chat.py

Type messages like a customer. The conversation keeps context, so follow-up
questions ("yes, do that", "how long will it take?") are understood.
Type 'quit' or 'exit' to stop, or 'reset' to start a fresh conversation.
"""

import json
import urllib.request

API_URL = "http://127.0.0.1:8000/predict"

history = []

print("SmartCX customer chat")
print("Type your message, or 'quit' to exit, 'reset' to start over.\n")

while True:
    try:
        msg = input("You: ").strip()
    except (EOFError, KeyboardInterrupt):
        print()
        break

    if not msg:
        continue
    if msg.lower() in ("quit", "exit"):
        break
    if msg.lower() == "reset":
        history = []
        print("\n(conversation reset)\n")
        continue

    payload = json.dumps({"message": msg, "history": history}).encode("utf-8")
    req = urllib.request.Request(
        API_URL, data=payload, headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"  (couldn't reach the server: {e})\n")
        continue

    reply = data.get("suggested_reply", "")
    print(f"\nAgent: {reply}")
    print(
        f"  [intent: {data.get('intent')}  |  confidence: {data.get('confidence')}"
        f"  |  escalate: {data.get('escalate')}]\n"
    )

    # Remember this exchange so the next message has context.
    history.append({"role": "user", "content": msg})
    history.append({"role": "assistant", "content": reply})

print("Chat ended.")
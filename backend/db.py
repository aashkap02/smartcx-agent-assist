import os
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.environ.get("MONGODB_URI")
if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not set. Add it to your .env file or Render env vars.")

client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=8000)
db = client["smartcx"]
users = db["users"]

# Try to create the unique email index, but DON'T crash the app if the database
# can't be reached from this machine (e.g. local network/antivirus blocking Atlas).
# On Render the network is clean, so this will succeed there and auth will work.
try:
    users.create_index("email", unique=True)
    print("[db] Connected to MongoDB and ensured email index.")
except Exception as e:
    print(f"[db] WARNING: MongoDB not reachable from here ({type(e).__name__}). "
          f"The classifier still works locally; auth will work once the DB is reachable (e.g. on Render).")
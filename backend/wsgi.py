from app import app
import os
from waitress import serve

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"Starting production server on port {port}...")
    serve(app, host="0.0.0.0", port=port)

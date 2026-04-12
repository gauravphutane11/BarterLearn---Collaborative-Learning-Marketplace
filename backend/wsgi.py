import os
from app import app

# Production server
from waitress import serve


def start():
    port = int(os.getenv("PORT", 5000))

    print("===================================")
    print("🚀 Starting BarterLearn Backend")
    print(f"🌐 Running on port {port}")
    print("===================================")

    serve(
        app,
        host="0.0.0.0",
        port=port,
        threads=8
    )


if __name__ == "__main__":
    start()
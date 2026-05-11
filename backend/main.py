# main.py
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import DB_NAME
from shadow_engine import ShadowEngine
from data_feed import DataFeed
from websocket_manager import manager

# Global definitions
engine = ShadowEngine()

async def handle_market_event(event: dict):
    """Callback function for the DataFeed to forward events to the Engine and broadcast results."""
    result = await engine.process_event(event)
    
    # Broadcast to all connected frontend clients
    if result["alerts"]:
        await manager.broadcast({
            "type": "alert",
            "price": result["price"],
            "alerts": result["alerts"]
        })
    
    # Send regular price updates (throttle if needed, here every event)
    if event["type"] == "trade":
        await manager.broadcast({
            "type": "update",
            "price": result["price"],
            "status": "active"
        })

feed = DataFeed(handle_market_event)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the Binance DataFeed
    await feed.start()
    yield
    # Safely spin down
    await feed.stop()

# Initialize FastAPI
app = FastAPI(title="Shadow Market X - Binance Surveillance", lifespan=lifespan)

# Allow Cross-Origin connections (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Shadow Market X Binance API is Live"}

@app.get("/status")
def get_status():
    return {
        "price": engine.latest_price,
        "recent_alerts": engine.latest_alerts
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Wait for any message from client (or just keep connection open)
            data = await websocket.receive_text()
            # Optional: handle client-side commands
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"[!] WebSocket error: {e}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

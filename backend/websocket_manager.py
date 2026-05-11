# websocket_manager.py
import asyncio
from typing import List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"[*] New client connected. Total clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print(f"[*] Client disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        """Broadcasts a JSON message to all connected clients."""
        if not self.active_connections:
            return
            
        # Create a list of tasks for broadcasting
        tasks = []
        for connection in self.active_connections:
            tasks.append(connection.send_json(message))
            
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

manager = ConnectionManager()

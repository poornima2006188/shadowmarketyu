# data_feed.py
import asyncio
import json
import websockets
import time
from typing import Callable, Optional
from config import BINANCE_DEPTH_WS, BINANCE_TRADE_WS, BINANCE_KLINE_WS, RECONNECT_DELAY_SEC

class DataFeed:
    def __init__(self, on_event_cb: Callable):
        """
        Initializes the Binance Data Feed.
        :param on_event_cb: Callback function to handle incoming parsed events.
        """
        self.on_event_cb = on_event_cb
        self.running = False
        self.tasks = []

    async def _listen_stream(self, url: str, stream_type: str):
        """Internal helper to listen to a specific Binance stream with reconnect logic."""
        while self.running:
            try:
                print(f"[*] Connecting to Binance {stream_type} stream: {url}")
                async with websockets.connect(url) as ws:
                    print(f"[+] Connected to {stream_type}")
                    while self.running:
                        message = await ws.recv()
                        data = json.loads(message)
                        
                        # Normalize data for the Shadow Engine
                        event = {
                            "type": stream_type,
                            "data": data,
                            "timestamp": time.time()
                        }
                        
                        # Forward to callback
                        await self.on_event_cb(event)
                        
            except Exception as e:
                print(f"[!] {stream_type} stream error: {e}")
                if self.running:
                    print(f"[*] Reconnecting in {RECONNECT_DELAY_SEC}s...")
                    await asyncio.sleep(RECONNECT_DELAY_SEC)

    async def start(self):
        """Starts all Binance WebSocket streams concurrently."""
        self.running = True
        self.tasks = [
            asyncio.create_task(self._listen_stream(BINANCE_DEPTH_WS, "depth")),
            asyncio.create_task(self._listen_stream(BINANCE_TRADE_WS, "trade")),
            asyncio.create_task(self._listen_stream(BINANCE_KLINE_WS, "kline"))
        ]
        print("[*] Binance Data Feed started.")

    async def stop(self):
        """Stops all active streams."""
        self.running = False
        for task in self.tasks:
            task.cancel()
        if self.tasks:
            await asyncio.gather(*self.tasks, return_exceptions=True)
        print("[*] Binance Data Feed stopped.")

# Test code
if __name__ == "__main__":
    async def mock_callback(event):
        print(f"Received {event['type']} event")

    feed = DataFeed(mock_callback)
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(feed.start())
        loop.run_forever()
    except KeyboardInterrupt:
        loop.run_until_complete(feed.stop())

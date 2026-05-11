# shadow_engine.py
from typing import Dict, Any, List
from spoof_detector import SpoofDetector
from trap_detector import TrapDetector

class ShadowEngine:
    def __init__(self):
        self.spoof_detector = SpoofDetector()
        self.trap_detector = TrapDetector()
        self.latest_price = 0.0
        self.latest_alerts = []

    async def process_event(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main processing logic for all market events.
        """
        event_type = event["type"]
        data = event["data"]
        alerts = []
        
        # Update latest price from trade or kline
        if event_type == "trade":
            self.latest_price = float(data.get("p", 0))
            # Run trap detection on every trade price
            trap_res = self.trap_detector.update(self.latest_price)
            if trap_res["trap_detected"]:
                alerts.append(f"{trap_res['trap_type']}! Sudden reversal at {self.latest_price}")

        elif event_type == "depth":
            # Binance depth updates: 'b' is bids, 'a' is asks
            for side in ["b", "a"]:
                for level in data.get(side, []):
                    price = float(level[0])
                    size = float(level[1])
                    spoof_res = self.spoof_detector.update(price, size)
                    if spoof_res["spoof_detected"]:
                        alerts.append(f"SPOOF ALERT: {spoof_res['reason']} at price {price}")

        elif event_type == "kline":
            # Handle candlestick data if needed (e.g., volume spikes)
            k = data.get("k", {})
            if k.get("x"): # Candle closed
                self.latest_price = float(k.get("c", 0))

        if alerts:
            self.latest_alerts.extend(alerts)
            self.latest_alerts = self.latest_alerts[-20:] # Keep last 20

        return {
            "price": self.latest_price,
            "alerts": alerts,
            "all_alerts": self.latest_alerts
        }

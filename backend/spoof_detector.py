# spoof_detector.py
import time
from typing import Dict, List, Optional
from config import SPOOF_SIZE_THRESHOLD, SPOOF_TIME_WINDOW

class SpoofDetector:
    def __init__(self, size_threshold: float = SPOOF_SIZE_THRESHOLD, time_window: float = SPOOF_TIME_WINDOW):
        self.size_threshold = size_threshold
        self.time_window = time_window
        # Store active levels: {price: {"size": size, "timestamp": timestamp}}
        self.active_levels: Dict[float, Dict] = {}

    def update(self, price: float, size: float) -> Dict:
        """
        Updates the detector with a new order book level state.
        :param price: Price level.
        :param size: New size at this price level.
        :return: Result dict with spoof detection status.
        """
        now = time.time()
        spoof_detected = False
        reason = ""

        # Check if this is a large order appearing
        if size >= self.size_threshold:
            if price not in self.active_levels:
                self.active_levels[price] = {"size": size, "timestamp": now}
            else:
                # Update size if it's already there
                self.active_levels[price]["size"] = size
        
        # Check if a previously tracked large order vanished
        elif price in self.active_levels:
            old_data = self.active_levels[price]
            duration = now - old_data["timestamp"]
            
            # If size dropped to 0 or significantly below threshold very quickly
            if size < (self.size_threshold * 0.1) and duration <= self.time_window:
                spoof_detected = True
                reason = f"Large order of {old_data['size']:.2f} vanished in {duration:.2f}s"
            
            # Remove from tracking since it's no longer "large" or it's gone
            del self.active_levels[price]

        return {
            "spoof_detected": spoof_detected,
            "price_level": price if spoof_detected else None,
            "reason": reason
        }

    def clean_old_levels(self, max_age: float = 60.0):
        """Cleanup logic to remove levels that haven't updated in a while."""
        now = time.time()
        keys_to_del = [p for p, data in self.active_levels.items() if now - data["timestamp"] > max_age]
        for p in keys_to_del:
            del self.active_levels[p]

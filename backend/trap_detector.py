# trap_detector.py
from typing import List, Dict, Optional
from config import TRAP_WINDOW_SIZE, TRAP_REVERSAL_PERCENT

class TrapDetector:
    def __init__(self, window_size: int = TRAP_WINDOW_SIZE, reversal_pct: float = TRAP_REVERSAL_PERCENT):
        self.window_size = window_size
        self.reversal_pct = reversal_pct
        self.price_history: List[float] = []
        self.max_price = 0.0
        self.min_price = float('inf')

    def update(self, current_price: float) -> Dict:
        """
        Analyzes price for potential traps.
        """
        self.price_history.append(current_price)
        if len(self.price_history) > self.window_size:
            self.price_history.pop(0)

        if len(self.price_history) < 10:
            return {"trap_detected": False}

        # Simple logic: detect sudden reversal after a local extreme
        local_max = max(self.price_history[:-1])
        local_min = min(self.price_history[:-1])
        
        trap_detected = False
        trap_type = ""
        
        # Bull Trap: Price broke above local max but is now dropping back
        if current_price < local_max * (1 - self.reversal_pct / 100) and any(p > local_max for p in self.price_history[-5:]):
            trap_detected = True
            trap_type = "BULL TRAP"

        # Bear Trap: Price broke below local min but is now bouncing back
        elif current_price > local_min * (1 + self.reversal_pct / 100) and any(p < local_min for p in self.price_history[-5:]):
            trap_detected = True
            trap_type = "BEAR TRAP"

        return {
            "trap_detected": trap_detected,
            "trap_type": trap_type,
            "extreme_zone": local_max if trap_type == "BULL TRAP" else local_min if trap_type == "BEAR TRAP" else None
        }

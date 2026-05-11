# config.py
import os

# Binance WebSocket URLs
BINANCE_DEPTH_WS = "wss://stream.binance.com:9443/ws/btcusdt@depth"
BINANCE_TRADE_WS = "wss://stream.binance.com:9443/ws/btcusdt@trade"
BINANCE_KLINE_WS = "wss://stream.binance.com:9443/ws/btcusdt@kline_1m"

# System Settings
RECONNECT_DELAY_SEC = 5
LATENCY_THRESHOLD_MS = 500

# Detection Settings
SPOOF_SIZE_THRESHOLD = 50.0  # BTC threshold for large orders
SPOOF_TIME_WINDOW = 2.0      # Seconds to detect rapid cancellation
TRAP_WINDOW_SIZE = 50
TRAP_REVERSAL_PERCENT = 0.05

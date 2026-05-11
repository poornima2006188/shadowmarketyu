import React, { useState, useRef } from "react";

function Replay() {
  const [replayData, setReplayData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Temporary demo trap data (we will connect real data later)
  const sampleTrap = [
    { price: 100 },
    { price: 102 },
    { price: 105 }, // breakout
    { price: 99 },  // trap happens
    { price: 101 }
  ];

  const startReplay = () => {
    // Clear any existing interval before starting fresh
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setReplayData([]);
    setIsPlaying(true);

    let index = 0;

    intervalRef.current = setInterval(() => {
      // Guard: stop if index is out of bounds
      if (index >= sampleTrap.length) {
        clearInterval(intervalRef.current);
        setIsPlaying(false);
        return;
      }

      const point = sampleTrap[index];
      if (point) {
        setReplayData(prev => [...prev, point]);
      }

      index++;

      if (index >= sampleTrap.length) {
        clearInterval(intervalRef.current);
        setIsPlaying(false);
      }
    }, 500);
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>🎬 Trap Replay Mode</h1>

      <button
        onClick={startReplay}
        disabled={isPlaying}
        style={{
          padding: "10px 20px",
          backgroundColor: "#00d2d3",
          border: "none",
          borderRadius: "5px",
          cursor: isPlaying ? "not-allowed" : "pointer",
          opacity: isPlaying ? 0.6 : 1,
        }}
      >
        {isPlaying ? "Playing..." : "Replay Trap"}
      </button>

      <div style={{ marginTop: "20px" }}>
        {replayData.filter(Boolean).map((point, i) => (
          <div key={i}>Price: {point.price}</div>
        ))}
      </div>
    </div>
  );
}

export default Replay;
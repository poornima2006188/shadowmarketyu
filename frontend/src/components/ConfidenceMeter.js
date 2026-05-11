import React from "react";

function ConfidenceMeter({ value }) {
  return (
    <div style={{
      marginTop: "20px",
      background: "rgba(17,24,39,0.7)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(12px)",
      padding: "20px",
      borderRadius: "16px"
    }}>
      <h3 style={{ margin: "0 0 10px 0", color: "#f8fafc", fontSize: "1.1rem" }}>📊 Confidence Meter</h3>
      <p style={{ margin: "0 0 10px 0", color: "#00d2d3", fontSize: "1.5rem", fontWeight: "bold" }}>{value}%</p>

      <div style={{
        height: "10px",
        background: "rgba(0,0,0,0.3)",
        borderRadius: "5px"
      }}>
        <div style={{
          width: `${value}%`,
          height: "100%",
          background: "linear-gradient(90deg, #00d2d3, #10b981)",
          borderRadius: "5px",
          transition: "width 0.5s ease"
        }} />
      </div>
    </div>
  );
}

export default ConfidenceMeter;

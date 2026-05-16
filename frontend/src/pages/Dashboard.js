import React from "react";
import Chart from "../components/Chart";
import LiquidityDNA from "../components/LiquidityDNA";
import DataSource from "../components/DataSource";

function Dashboard({ currentPrice, alerts, status }) {
  // We no longer need the threat level calculation here, LiquidityDNA handles it.

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Top Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <div className="glass-panel metric-card">
          <span
            className="metric-label"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Live Price (BTC)
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.68rem",
                color: "#10b981",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  background: "#10b981",
                  borderRadius: "50%",
                  boxShadow: "0 0 6px #10b981",
                  display: "inline-block",
                }}
              />
              LIVE (Pacifica)
            </span>
          </span>
          <span className="metric-value">
            $
            {(currentPrice || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--text-secondary)",
              marginTop: "0.25rem",
              display: "block",
            }}
          >
            Real-time data via Pacifica API
          </span>
        </div>

        <div className="glass-panel metric-card">
          <span className="metric-label">Active Engine</span>
          <span
            className="metric-value"
            style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}
          >
            PACIFICA NODE-1
          </span>
        </div>

        <div className="glass-panel metric-card">
          <span className="metric-label">Alert Count (24h)</span>
          <span
            className="metric-value"
            style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}
          >
            {(alerts || []).length}
          </span>
        </div>

        <LiquidityDNA status={status} />
      </div>

      {/* Main Content Grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}
      >
        {/* Chart Panel */}
        <div
          className="glass-panel"
          style={{ minHeight: "400px", minWidth: 0 }}
        >
          <h3 className="metric-label" style={{ marginBottom: "1.5rem" }}>
            Price Action Monitor
          </h3>
          <Chart />
        </div>

        {/* Manipulation Feed */}
        <div
          className="glass-panel"
          style={{ maxHeight: "600px", overflowY: "auto" }}
        >
          <h3
            className="metric-label"
            style={{
              marginBottom: "1.5rem",
              position: "sticky",
              top: 0,
              background: "var(--panel-bg)",
              padding: "0.5rem 0",
            }}
          >
            Manipulation Feed
          </h3>

          {(alerts || []).length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 0",
                color: "var(--text-secondary)",
              }}
            >
              <p>Monitoring market depth...</p>
              <div
                className="threat-pulse"
                style={{ margin: "1rem auto" }}
              ></div>
            </div>
          ) : (
            alerts
              .slice()
              .reverse()
              .map((alert, idx) => {
                const type = alert.includes("TRAP")
                  ? "trap"
                  : alert.includes("SPOOF")
                    ? "spoof"
                    : "";
                return (
                  <div key={idx} className={`alert-item ${type}`}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        marginBottom: "0.25rem",
                        opacity: 0.8,
                      }}
                    >
                      {type.toUpperCase()} ALERT
                    </div>
                    <div style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
                      {alert}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* Pacifica Data Source Panel */}
      <DataSource />
    </div>
  );
}

export default Dashboard;

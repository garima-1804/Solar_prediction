import React, { useState, useEffect } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-main">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-row">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-main">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Solar Performance Dashboard</h1>
          <div className="header-actions">
            <div className="time-filter">
              <select className="filter-select">
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            <button className="export-btn">
              <span>Export Report</span>
            </button>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-badge" style={{ display: "flex", flexDirection: "column", marginBottom: "8px" }}>
  <span className="stat-label" style={{ fontSize: "14px", fontWeight: "500" }}>System Status</span>
  <span className="stat-value active" style={{ fontSize: "12px", fontWeight: "bold", color: "green" }}>Operational</span>
</div>

<div className="stat-badge" style={{ display: "flex", flexDirection: "column" }}>
  <span className="stat-label" style={{ fontSize: "14px", fontWeight: "500" }}>Last Updated</span>
  <span className="stat-value" style={{ fontSize: "12px", color: "#555" }}>2 min ago</span>
</div>

        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Current Generation</div>
            <div className="metric-trend positive">+2.1%</div>
          </div>
          <div className="metric-value">7.2<span className="metric-unit">kW</span></div>
          <div className="metric-chart">
            <div className="sparkline">
              {[40, 55, 65, 80, 95, 100, 85, 72].map((height, index) => (
                <div 
                  key={index} 
                  className="sparkline-bar"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>
          <div className="metric-footer">
            <span className="metric-note">Peak: 7.4 kW at 12:30 PM</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Forecast Accuracy</div>
            <div className="metric-indicator excellent">Excellent</div>
          </div>
          <div className="metric-value">94.2<span className="metric-unit">%</span></div>
          <div className="progress-container">
            <div className="progress-labels">
              <span>Target: 90%</span>
              <span>94.2%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '94.2%' }}></div>
            </div>
          </div>
          <div className="metric-footer">
            <span className="metric-note">7-day rolling average</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Weather Impact</div>
            <div className="metric-status optimal">Optimal</div>
          </div>
          <div className="metric-value positive">+12<span className="metric-unit">%</span></div>
          <div className="weather-info">
            <div className="weather-icon">☀️</div>
            <div className="weather-details">
              <div className="weather-condition">Clear Skies</div>
              <div className="weather-temp">24°C • 45% Humidity</div>
            </div>
          </div>
          <div className="metric-footer">
            <span className="metric-note">Ideal generation conditions</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">AQI Impact</div>
            <div className="metric-alert moderate">Moderate</div>
          </div>
          <div className="metric-value negative">-3<span className="metric-unit">%</span></div>
          <div className="aqi-scale">
            <div className="aqi-level good"></div>
            <div className="aqi-level moderate active"></div>
            <div className="aqi-level poor"></div>
            <div className="aqi-level severe"></div>
          </div>
          <div className="metric-footer">
            <span className="metric-note">AQI: 52 • Minimal impact</span>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        <div className="section-header">
          <h2>Performance Analytics</h2>
          <div className="section-actions">
            <button className="action-btn secondary">View Details</button>
            <button className="action-btn primary">Generate Report</button>
          </div>
        </div>
        
        <div className="analytics-grid">
          <div className="analytics-card large">
            <div className="card-header">
              <h3>7-Day Forecast</h3>
              <span className="card-subtitle">Weather-based generation predictions</span>
            </div>
            <div className="forecast-preview">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="forecast-day">
                  <div className="day-name">{day}</div>
                  <div className="day-weather">☀️</div>
                  <div className="day-production">{(7.2 + index * 0.3).toFixed(1)}kW</div>
                </div>
              ))}
            </div>
            <button className="card-action-btn">
              View Detailed Forecast
            </button>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Savings Calculator</h3>
              <span className="card-subtitle">ROI & Environmental Impact</span>
            </div>
            <div className="savings-preview">
              <div className="savings-metric">
                <div className="savings-value">1,247 Rs</div>
                <div className="savings-label">Monthly Savings</div>
              </div>
              <div className="savings-metric">
                <div className="savings-value">8.2 tons</div>
                <div className="savings-label">CO₂ Reduction</div>
              </div>
            </div>
            <button className="card-action-btn">
              Open Calculator
            </button>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Policy Insights</h3>
              <span className="card-subtitle">Subsidies & Incentives</span>
            </div>
            <div className="policy-status">
              <div className="policy-item active">
                <div className="policy-name">Federal Tax Credit</div>
                <div className="policy-value">30%</div>
              </div>
              <div className="policy-item">
                <div className="policy-name">State Rebate</div>
                <div className="policy-value">1,500 Rs</div>
              </div>
            </div>
            <button className="card-action-btn">
              View All Policies
            </button>
          </div>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="status-footer">
        <div className="status-item">
          <div className="status-indicator online"></div>
          <span>Grid Connection: Stable</span>
        </div>
        <div className="status-item">
          <div className="status-indicator online"></div>
          <span>Inverter: Operational</span>
        </div>
        <div className="status-item">
          <div className="status-indicator warning"></div>
          <span>Maintenance: Due in 14 days</span>
        </div>
      </div>
    </div>
  );
}
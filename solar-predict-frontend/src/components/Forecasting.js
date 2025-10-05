import React from 'react';
import './Forcasting.css';

function SolarForecast() {
  const forecastData = [
    { day: 'Mon', output: 45.2, condition: 'Sunny', efficiency: 92 },
    { day: 'Tue', output: 38.7, condition: 'Partly Cloudy', efficiency: 88 },
    { day: 'Wed', output: 18.5, condition: 'Rainy', efficiency: 72 },
    { day: 'Thu', output: 28.9, condition: 'Cloudy', efficiency: 82 },
    { day: 'Fri', output: 48.3, condition: 'Sunny', efficiency: 95 },
    { day: 'Sat', output: 42.1, condition: 'Mostly Sunny', efficiency: 90 },
    { day: 'Sun', output: 51.6, condition: 'Sunny', efficiency: 97 }
  ];

  const getConditionIcon = (condition) => {
    const icons = {
      'Sunny': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Mostly Sunny': '🌤️'
    };
    return icons[condition] || '🔆';
  };

  const getEfficiencyColor = (eff) => {
    if (eff >= 90) return '#10b981';
    if (eff >= 80) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="solar-forecast">
      <div className="forecast-header">
        <h2>Solar Forecast</h2>
        <p>7-day energy generation prediction</p>
      </div>

      <div className="forecast-grid">
        {forecastData.map((day, index) => (
          <div key={index} className="forecast-card">
            <div className="day">{day.day}</div>
            <div className="condition">{getConditionIcon(day.condition)}</div>
            <div className="output">{day.output} kWh</div>
            <div 
              className="efficiency"
              style={{ color: getEfficiencyColor(day.efficiency) }}
            >
              {day.efficiency}% eff
            </div>
          </div>
        ))}
      </div>

      <div className="forecast-summary">
        <div className="summary-item">
          <span>Avg. Daily Output:</span>
          <strong>39.0 kWh</strong>
        </div>
        <div className="summary-item">
          <span>Total Weekly:</span>
          <strong>273.3 kWh</strong>
        </div>
        <div className="summary-item">
          <span>Peak Day:</span>
          <strong>Sunday (51.6 kWh)</strong>
        </div>
      </div>
    </div>
  );
}

export default SolarForecast;
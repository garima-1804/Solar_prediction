import React, { useState } from "react";
import "./Calculator.css";

export default function SolarCalculatorMain() {
  const [panelArea, setPanelArea] = useState(25);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 📍 Browser Geolocation
  const getLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lon = pos.coords.longitude.toFixed(4);
          setLatitude(lat);
          setLongitude(lon);
          setLocationLabel(`Current Location (${lat}, ${lon})`);
          setError("");
          setIsLoading(false);
        },
        (err) => {
          setError("Location access denied. Please enter City & Country.");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported on this browser.");
      setIsLoading(false);
    }
  };

  // 🌍 Convert City+Country → Coordinates
  const getCoordsFromCity = async () => {
    if (!city || !country) {
      setError("Please enter both city and country");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat).toFixed(4);
        const lon = parseFloat(data[0].lon).toFixed(4);
        setLatitude(lat);
        setLongitude(lon);
        setLocationLabel(`${city}, ${country}`);
        setError("");
      } else {
        setError("City not found. Try again.");
      }
    } catch {
      setError("Error fetching coordinates.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 Call Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      setError("Please provide location (GPS or City/Country).");
      return;
    }
    if (!panelArea || panelArea <= 0) {
      setError("Please enter a valid panel area.");
      return;
    }
    
    setIsLoading(true);
    try {
      const url = `http://127.0.0.1:8000/api/solar-prediction/?lat=${latitude}&lon=${longitude}&panel_area=${panelArea}`;
      const res = await fetch(url);
      const data = await res.json();
      setPrediction(data);
      setError("");
    } catch {
      setError("Backend request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="solar-main-ui">
      

      {/* Input Section */}
      <div className="solar-input-card">
        <div className="solar-card-header">
          <span className="solar-card-icon">📍</span>
          Enter Location & Details
        </div>
        
        <div className="solar-card-description">
          Start by providing your location using one of the methods below
        </div>

        <form onSubmit={handleSubmit}>
          {/* Location Method Selection */}
          <div className="solar-location-method">
            <div className="method-option">
              <div className="method-header">
                <span className="method-icon">📍</span>
                <h4>Auto-Detect Location</h4>
              </div>
              <p className="method-description">Use your device's GPS to automatically detect coordinates</p>
              <button
                className="solar-calc-btn location-btn"
                type="button"
                onClick={getLocation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Detecting Location...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🌐</span>
                    Use My Current Location
                  </>
                )}
              </button>
            </div>

            <div className="method-divider">
              <div className="divider-line"></div>
              <span className="divider-text">OR</span>
              <div className="divider-line"></div>
            </div>

            <div className="method-option">
              <div className="method-header">
                <span className="method-icon">🏙️</span>
                <h4>Search by City</h4>
              </div>
              <p className="method-description">Enter your city and country manually</p>
              
              <div className="city-inputs-grid">
                <div className="solar-field">
                  <label className="input-label">
                    <span className="label-text">City</span>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. New York"
                      className="solar-input"
                    />
                  </label>
                </div>
                
                <div className="solar-field">
                  <label className="input-label">
                    <span className="label-text">Country</span>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. USA"
                      className="solar-input"
                    />
                  </label>
                </div>
              </div>

              <button
                className="solar-calc-btn secondary location-btn"
                type="button"
                onClick={getCoordsFromCity}
                disabled={!city || !country || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🔍</span>
                    Search City Coordinates
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Current Location Status */}
          {locationLabel && (
            <div className="location-status">
              <div className="status-success">
                <span className="status-icon">✅</span>
                Location set to: <strong>{locationLabel}</strong>
              </div>
            </div>
          )}

          {/* Manual Coordinates Section */}
          <div className="coordinates-section">
            <div className="section-header">
              <span className="section-icon">📐</span>
              <h4>Advanced: Enter Coordinates Directly</h4>
            </div>
            <p className="section-description">For precise location control</p>
            
            <div className="coordinates-inputs">
              <div className="solar-field">
                <label className="input-label">
                  <span className="label-text">Latitude</span>
                  <input
                    type="number"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="e.g. 40.7128"
                    step="any"
                    className="solar-input"
                  />
                </label>
              </div>
              
              <div className="solar-field">
                <label className="input-label">
                  <span className="label-text">Longitude</span>
                  <input
                    type="number"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="e.g. -74.0060"
                    step="any"
                    className="solar-input"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Panel Area Input */}
          <div className="solar-field panel-area-section">
            <label className="input-label">
              <span className="label-text">
                <span className="label-icon">☀️</span>
                Solar Panel Area (m²)
              </span>
              <input
                type="number"
                value={panelArea}
                onChange={(e) => setPanelArea(e.target.value)}
                placeholder="Enter panel area in square meters"
                min="1"
                className="solar-input"
              />
            </label>
            <div className="input-hint">
              Typical residential systems range from 10-50 m²
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <button 
              className="solar-calc-btn primary submit-btn" 
              type="submit"
              disabled={!latitude || !longitude || !panelArea || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Calculating...
                </>
              ) : (
                <>
                  <span className="btn-icon">⚡</span>
                  Calculate Solar Predictions
                </>
              )}
            </button>
            
            {(!latitude || !longitude) && (
              <div className="submit-hint">
                ⓘ Please set your location first
              </div>
            )}
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </div>

      {/* Show Results */}
      {prediction && (
        <div className="results-section">
          {/* Current Solar Energy Section */}
          <div className="solar-energy-card">
            <div className="solar-energy-header">
              <span className="card-icon">📊</span>
              Current Solar Energy Potential
            </div>
            
            {locationLabel && (
              <div className="solar-location-info">
                <span className="location-icon">🌍</span>
                Location: <strong>{locationLabel}</strong>
              </div>
            )}
            
            <div className="solar-energy-main">
              <span className="solar-energy-large">
                {prediction.solar_energy?.toFixed(2) || "0.00"}
              </span>
              <span className="solar-energy-unit">kWh daily prediction</span>
            </div>

            <div className="solar-energy-details">
              <div className="detail-item">
                <span className="detail-value">
                  {prediction.solar_irradiance?.toFixed(2) || "0.00"} kWh/m²/day
                </span>
                <span className="solar-energy-detail-label">Solar Irradiance</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-value">
                  {prediction.weather?.wind_speed || "0"} m/s
                </span>
                <span className="solar-energy-detail-label">Wind Speed</span>
              </div>
              
              <div className="detail-item temperature">
                <span className="detail-value">
                  {prediction.weather?.temperature ? (prediction.weather.temperature - 273.15).toFixed(1) : "0.0"}°C
                </span>
                <span className="solar-energy-detail-label">Temperature</span>
              </div>
              
              <div className="detail-item aqi">
                <span className="detail-value">
                  AQI {prediction.aqi?.AQI || "0"} ({prediction.aqi?.Category || "Unknown"})
                </span>
                <span className="solar-energy-detail-label">Air Quality</span>
              </div>
              
              <div className="detail-item co2">
                <span className="detail-value">
                  {prediction.co2_offset?.toFixed(2) || "0.00"} kg CO₂
                </span>
                <span className="solar-energy-detail-label">Daily CO₂ Offset</span>
              </div>
            </div>
          </div>

          {/* Financial Savings */}
          <div className="solar-finance-card">
            <div className="solar-finance-header">
              <span className="card-icon">💰</span>
              Financial Savings Estimate
            </div>
            
            <div className="solar-finance-result-main">
              <span className="solar-finance-large">
                {((prediction.solar_energy || 0) * 4.43 * 365).toFixed(0)} Rs
              </span>
              <div className="solar-finance-desc">
                Estimated Annual Savings (at Rs 4.43/kWh)
              </div>
            </div>
            
            <div className="solar-finance-bottom">
              <span className="efficiency-badge">
                {panelArea} m² panels • {(prediction.efficiency * 100)?.toFixed(0) || "0"}% efficiency
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
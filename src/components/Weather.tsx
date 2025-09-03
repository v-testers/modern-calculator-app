import React, { useState, useEffect } from 'react';
import { WeatherService, type WeatherResponse, type ForecastResponse } from '../services/weatherService';

export const Weather: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [city, setCity] = useState('London');
  const [inputCity, setInputCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWeatherData(city);
  }, [city]);

  const loadWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        WeatherService.getCurrentWeather(cityName),
        WeatherService.getForecast(cityName),
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError('Failed to load weather data. Please try again.');
      console.error('Weather loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      setInputCity('');
    }
  };

  const formatTemperature = (temp: number) => Math.round(temp);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="weather">
      <div className="weather__header">
        <h2 className="weather__title">Weather</h2>
        <form onSubmit={handleSearch} className="weather__search">
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Enter city name..."
            className="weather__search-input"
            disabled={loading}
          />
          <button
            type="submit"
            className="weather__search-button"
            disabled={loading || !inputCity.trim()}
          >
            🔍
          </button>
        </form>
      </div>

      {error && (
        <div className="weather__error">
          {error}
        </div>
      )}

      {loading && (
        <div className="weather__loading">
          Loading weather data...
        </div>
      )}

      {currentWeather && !loading && (
        <>
          <div className="weather__current">
            <div className="weather__current-header">
              <div className="weather__location">
                <h3 className="weather__city-name">{currentWeather.name}</h3>
                <div className="weather__current-time">
                  {formatTime(currentWeather.dt)}
                </div>
              </div>
              <div className="weather__current-icon">
                {WeatherService.getWeatherIcon(currentWeather.weather[0].icon)}
              </div>
            </div>
            
            <div className="weather__current-main">
              <div className="weather__temperature">
                {formatTemperature(currentWeather.main.temp)}°C
              </div>
              <div className="weather__description">
                {currentWeather.weather[0].description}
              </div>
              <div className="weather__feels-like">
                Feels like {formatTemperature(currentWeather.main.feels_like)}°C
              </div>
            </div>

            <div className="weather__current-details">
              <div className="weather__detail-item">
                <span className="weather__detail-label">Min</span>
                <span className="weather__detail-value">
                  {formatTemperature(currentWeather.main.temp_min)}°C
                </span>
              </div>
              <div className="weather__detail-item">
                <span className="weather__detail-label">Max</span>
                <span className="weather__detail-value">
                  {formatTemperature(currentWeather.main.temp_max)}°C
                </span>
              </div>
              <div className="weather__detail-item">
                <span className="weather__detail-label">Humidity</span>
                <span className="weather__detail-value">
                  {currentWeather.main.humidity}%
                </span>
              </div>
              <div className="weather__detail-item">
                <span className="weather__detail-label">Pressure</span>
                <span className="weather__detail-value">
                  {currentWeather.main.pressure} hPa
                </span>
              </div>
            </div>
          </div>

          {forecast && (
            <div className="weather__forecast">
              <h4 className="weather__forecast-title">5-Day Forecast</h4>
              <div className="weather__forecast-list">
                {forecast.list.slice(0, 5).map((item, index) => (
                  <div key={index} className="weather__forecast-item">
                    <div className="weather__forecast-date">
                      {formatDate(item.dt)}
                    </div>
                    <div className="weather__forecast-icon">
                      {WeatherService.getWeatherIcon(item.weather[0].icon)}
                    </div>
                    <div className="weather__forecast-temps">
                      <span className="weather__forecast-high">
                        {formatTemperature(item.main.temp_max)}°
                      </span>
                      <span className="weather__forecast-low">
                        {formatTemperature(item.main.temp_min)}°
                      </span>
                    </div>
                    <div className="weather__forecast-description">
                      {item.weather[0].main}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
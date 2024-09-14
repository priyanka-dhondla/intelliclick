import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './WeatherInfo.css';
import L from 'leaflet';

// Fix the marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WeatherInfo = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (cityName) {
      const fetchWeather = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=10ce32bb453a43638a611cef2371b95e`
          );
          const data = await response.json();
          setWeather(data);
        } catch (error) {
          console.error('Error fetching weather information:', error);
          setWeather(null);
        }
      };

      fetchWeather();
    }
  }, [cityName]);

  if (!weather) {
    return <div>Loading weather information...</div>;
  }

  const temperatureCelsius = weather.main ? Math.round(weather.main.temp - 273.15) : 'N/A';
  const temperatureFahrenheit = weather.main
    ? Math.round((weather.main.temp - 273.15) * 9/5 + 32)
    : 'N/A';
  const weatherDescription = weather.weather && weather.weather.length > 0
    ? weather.weather[0].description
    : 'N/A';
  const humidity = weather.main ? weather.main.humidity : 'N/A';
  const windSpeed = weather.wind ? weather.wind.speed : 'N/A';
  const locationName = weather.name && weather.sys ? `${weather.name}, ${weather.sys.country}` : 'N/A';
const weatherIcon = weather.weather && weather.weather.length > 0
  ? `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`
  : '';

//   const weatherIcon = weather.weather && weather.weather.length > 0 ? `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png` : '';

  const coordinates = weather.coord ? [weather.coord.lat, weather.coord.lon] : null;

  return (
    <div className="weather-info">
      <h2>Weather Information for {cityName}</h2>
      <div className="weather-card">
        {weatherIcon && <img src={weatherIcon} alt={weatherDescription} />}
        <p className="temperature">
          {temperatureCelsius} °C / {temperatureFahrenheit} °F 
          <span role="img" aria-label="thermometer">🌡️</span>
        </p>
        <p className="description">{weatherDescription}</p>
        <p className="details">
          <strong>Humidity:</strong> {humidity} % 
          <span role="img" aria-label="humidity">💧</span>
        </p>
        <p className="details">
          <strong>Wind Speed:</strong> {windSpeed} m/s 
          <span role="img" aria-label="wind">🌬️</span>
        </p>
        <p className="details">
          <strong>Location:</strong> {locationName}
        </p>
      </div>

      {coordinates && (
        <div className="map-container">
          <h3>Location Map</h3>
          <MapContainer center={coordinates} zoom={12} style={{ height: '300px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={coordinates}>
              <Popup>{locationName}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <button className="back-button" onClick={() => navigate('/cities')}>Back</button>
    </div>
  );
};

export default WeatherInfo;

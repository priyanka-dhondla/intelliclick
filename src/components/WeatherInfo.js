import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
  FaTemperatureHigh,
  FaCloud,
  FaTint,
  FaWind,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/9356/9356230.png",
  iconSize: [40, 45],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const WeatherInfo = () => {
  const { cityName } = useParams();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const markerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        setTimeout(async () => {
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=10ce32bb453a43638a611cef2371b95e`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch weather data");
            }
            const data = await response.json();
            setWeather(data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }, 1000);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityName]);

  useEffect(() => {
    if (weather && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [weather]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-500">
          Loading weather information...
        </p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!weather) {
    return (
      <p className="text-center text-gray-500">
        No weather information available
      </p>
    );
  }

  const { coord, name, weather: weatherDetails } = weather;
  const { lat, lon } = coord;
  const mapCenter = [lat, lon];

  return (
    <div className="p-6 max-w-4xl mt-3 mx-auto bg-red-00 shadow-md rounded-lg border border-gray-300">
      <h2 className="text-4xl font-bold mb-6 text-center text-violet-500">
        Weather Info for {name}
      </h2>
      <div className="mb-6 p-4 bg-white rounded-lg shadow-inner border border-gray-200">
        <h3 className="text-2xl font-semibold mb-4 text-black-600">
          Weather Details:
        </h3>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-4 text-blue-500 text-2xl" />
            <span className="text-lg font-medium text-black">
              Country:{" "}
              <span className="text-blue-600">{weather.sys.country}</span>
            </span>
          </div>
          <div className="flex items-center">
            <FaTemperatureHigh className="mr-4 text-red-500 text-2xl" />
            <span className="text-lg font-medium text-black">
              Temperature:{" "}
              <span className="text-blue-600">
                {(weather.main.temp - 273.15).toFixed(2)}°C /{" "}
                {weather.main.temp}°F
              </span>
            </span>
          </div>
          <div className="flex items-center">
            <FaCloud className="mr-4 text-gray-500 text-2xl" />
            <span className="text-lg font-medium text-black">
              Condition:{" "}
              <span className="text-blue-600">
                {weatherDetails[0].description}
              </span>
            </span>
          </div>
          <div className="flex items-center">
            <FaTint className="mr-4 text-blue-400 text-2xl" />
            <span className="text-lg font-medium text-black">
              Humidity:{" "}
              <span className="text-blue-600">{weather.main.humidity}%</span>
            </span>
          </div>
          <div className="flex items-center">
            <FaWind className="mr-4 text-green-500 text-2xl" />
            <span className="text-lg font-medium text-black">
              Wind:{" "}
              <span className="text-blue-600">{weather.wind.speed} m/s</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={mapCenter} icon={customIcon} ref={markerRef}>
            <Popup>{name}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Back Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate("/cities")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default WeatherInfo;

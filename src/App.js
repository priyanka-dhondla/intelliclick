import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CitiesTable from "./components/CitiesTable";
import WeatherInfo from "./components/WeatherInfo";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/cities" />} />
        <Route path="/cities" element={<CitiesTable />} />
        <Route path="/weather/:cityName" element={<WeatherInfo />} />
      </Routes>
    </Router>
  );
};

export default App;

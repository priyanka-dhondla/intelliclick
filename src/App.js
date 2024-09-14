// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CityTable from './components/CityTable';
import WeatherInfo from './components/WeatherInfo';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/cities" element={<CityTable />} />
        <Route path="/weather/:cityName" element={<WeatherInfo />} />
        <Route path="/" element={<CityTable />} />
      </Routes>
    </Router>
  );
};

export default App;




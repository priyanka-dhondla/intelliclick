import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CityTable.css'; // Custom CSS for additional styles

const CityTable = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true); // Track if there are more cities to load
  const [offset, setOffset] = useState(0); // Initial offset for pagination
  const [scrollTimeout, setScrollTimeout] = useState(null); // Timer for scroll delay
  const limit = 20; // Number of cities to fetch per request

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${limit}&offset=${offset}`
        );
        const data = await response.json();
        setCities(prevCities => [...prevCities, ...data.results]); // Append new cities to the existing list
        setLoading(false);
        if (data.results.length < limit) {
          setHasMore(false); // No more cities to load
        }
      } catch (error) {
        console.error('Error fetching the cities:', error);
        setCities([]);
        setLoading(false);
      }
    };

    fetchCities();
  }, [offset]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleReload = () => {
    setCities([]);
    setOffset(0);
    setHasMore(true);
    setLoading(true);
  };

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewWeather = (city) => {
    navigate(`/weather/${city.name}`, { state: { city } }); // Navigate to the weather page with city data
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      if (scrollTop + windowHeight >= scrollHeight - 50 && hasMore && !loading) {
        if (scrollTimeout) clearTimeout(scrollTimeout); // Clear previous timer if exists
        setScrollTimeout(setTimeout(() => {
          setOffset(prevOffset => prevOffset + limit); // Update offset to fetch more cities
          setLoading(true); // Set loading to true to show the spinner
        }, 2000)); // 2 seconds delay
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout); // Clean up timer on unmount
    };
  }, [hasMore, loading, scrollTimeout]);

  if (loading && offset === 0) {
    return <div className="text-center my-4"><div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div></div>;
  }

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-center">Cities List along with their population</h1>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <input
          type="text"
          placeholder="Search cities..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="form-control search-input"
        />
        <button className="btn btn-secondary ml-3" onClick={handleReload}>
          Reload
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>City Name</th>
              <th>Country</th>
              <th>Population</th>
              <th>TimeZone</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map((city, index) => (
              <tr key={index}>
                <td>
                  <a
                    href={`/weather/${city.name}`}
                    className="text-primary city-link"
                    onClick={(e) => {
                      // Handle click to navigate programmatically
                      e.preventDefault();
                      handleViewWeather(city);
                    }}
                  >
                    {city.name || 'N/A'}
                  </a>
                </td>
                <td>{city.cou_name_en || 'N/A'}</td>
                <td>{city.population !== undefined ? city.population : '0'}</td>
                <td>{city.timezone || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-center my-4"><div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div></div>}
      </div>
    </div>
  );
};

export default CityTable;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const fetchCities = async (page) => {
    setLoading(true);
    setShowLoader(true);

    setTimeout(async () => {
      try {
        const response = await fetch(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=10&offset=${
            (page - 1) * 10
          }`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const foundCitiesData = data.results;

        const citiesData = foundCitiesData.map((record) => ({
          name: record.name,
          country: record.cou_name_en,
          population: record.population,
        }));

        if (citiesData.length < 10) {
          setHasMore(false);
        }

        setCities((prevCities) => [...prevCities, ...citiesData]);
        if (searchTerm === "") {
          setFilteredCities((prevCities) => [...prevCities, ...citiesData]);
        }
        setLoading(false);
        setShowLoader(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setShowLoader(false);
      }
    }, 1000);
  };

  useEffect(() => {
    fetchCities(page);
  }, [page]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCities(cities);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = cities.filter(
        (city) =>
          city.name.toLowerCase().includes(lowercasedSearchTerm) ||
          city.country.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredCities(filtered);
    }
  }, [searchTerm, cities]);

  useEffect(() => {
    if (searchTerm === "") {
      setPage(1);
      setHasMore(true);
      setCities([]);
      setFilteredCities([]);
      fetchCities(1);
    }
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewWeather = (city) => {
    navigate(`/weather/${encodeURIComponent(city.name)}`);
  };

  const handleScroll = () => {
    const bottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight;
    if (bottom && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const handleReload = () => {
    window.location.reload();
  };

  if (loading && page === 1 && !showLoader) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-10">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Cities
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of cities with their population and country.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-4">
          <button
            type="button"
            onClick={handleReload}
            className="inline-flex w-40 h-10 items-center px-8 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reload
          </button>
          <input
            type="text"
            placeholder="  Search..."
            className="block w-full h-10 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900 w-1/4"
                    >
                      City
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 w-1/4"
                    >
                      Country
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 w-1/4"
                    >
                      Population
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 w-1/4"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredCities.map((city, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-900 text-center">
                        {city.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        {city.country}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        {city.population.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleViewWeather(city)}
                        >
                          View Weather Info
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showLoader && (
                <div className="flex flex-col items-center py-4">
                  <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-500">Loading more cities...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitiesTable;

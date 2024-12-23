import { useState } from "react";
import "./App.css";

function App() {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);

  const handleAddCity = async () => {
    if (newCity && !cities.includes(newCity)) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=799aae7fc954f86ea7bf0071f85833b6&units=metric`
        );
        const data = await response.json();
        if (data.cod === 200) {
          setCities([...cities, newCity]);
          setWeatherData([...weatherData, data]);
          setNewCity("");
        } else {
          alert("City not found!");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
  };

  const getBestTravelDestination = () => {
    if (weatherData.length === 0) return null;

    return weatherData.reduce((best, city) => {
      const score = calculateCityScore(city);
      return score > calculateCityScore(best) ? city : best;
    });
  };

  const calculateCityScore = (cityData) => {
    const temp = cityData.main.temp;
    const weather = cityData.weather[0].main.toLowerCase();

    let score = 100;
    score = score - Math.abs(temp - 22.5) * 2;

    if (weather.includes("rain")) score -= 30;
    if (weather.includes("cloud")) score -= 10;
    if (weather.includes("storm")) score -= 40;
    return score;
  };

  return (
    <div className="weather-app">
      <div className="search-container">
        <input
          type="text"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button onClick={handleAddCity}>Add City</button>
      </div>

      <div className="cities-list">
        {weatherData.map((data, index) => (
          <div key={index} className="city-card">
            <h2>{data.name}</h2>
            <p>Temperature: {data.main.temp}°C</p>
            <p>Weather: {data.weather[0].main}</p>
            <p>Humidity: {data.main.humidity}%</p>
          </div>
        ))}
      </div>

      {weatherData.length > 0 && (
        <div className="recommendation">
          <h3>Travel Recommendation</h3>
          <p>Best destination: {getBestTravelDestination().name}</p>
          <p>
            Current conditions: {getBestTravelDestination().weather[0].main}
          </p>
          <p>Temperature: {getBestTravelDestination().main.temp}°C</p>
        </div>
      )}
    </div>
  );
}

export default App;

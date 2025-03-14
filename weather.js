async function fetchWeatherData(location) {
  let weatherData = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=MZ9RN3HPPKTKD7ZNMJJRZ3XQN`
  );
  return await weatherData.json();
}

function processWeatherData(data) {
  return {
    description: data.description,
    temperature: data.currentConditions.temp,
    humidity: data.currentConditions.humidity,
    windSpeed: data.currentConditions.windspeed,
    icon: data.currentConditions.icon,
  };
}

function getWeatherEmoji(icon) {
  switch (icon) {
    case "rain":
      return "🌧️";
    case "cloudy":
    case "partly-cloudy-day":
    case "partly-cloudy-night":
      return "☁️";
    case "clear-day":
      return "🌙";
    case "clear-night":
      return "☀️";
    case "snow":
      return "❄️";
    case "thunderstorm":
      return "⛈️";
    case "fog":
      return "🌫️";
    default:
      return "🌡️";
  }
}

async function displayWeather(location) {
  const weatherInfoContainer = document.querySelector(".weather-info");

  if (!location) {
    weatherInfoContainer.innerHTML = `<p>Invalid input</p>`;
    weatherInfoContainer.classList.add("visible");
    return;
  }

  try {
    let data = await fetchWeatherData(location);
    let processedData = processWeatherData(data);
    console.log(processedData);
    let emoji = getWeatherEmoji(processedData.icon);
    weatherInfoContainer.innerHTML = `
      <p>Description: ${processedData.description} ${emoji}</p>
      <p>Temperature: ${processedData.temperature}°C</p>
      <p>Humidity: ${processedData.humidity}%</p>
      <p>Wind Speed: ${processedData.windSpeed} km/h</p>
    `;
    weatherInfoContainer.classList.add("visible");
    localStorage.setItem("lastLocation", location);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    weatherInfoContainer.innerHTML = `<p>Invalid input</p>`;
    weatherInfoContainer.classList.add("visible");
  }
}

document.querySelector(".submit-btn").addEventListener("click", () => {
  let location = document.querySelector("input[name='userInput']").value;
  displayWeather(location);
});

// Load the last searched location from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
  let lastLocation = localStorage.getItem("lastLocation");
  if (lastLocation) {
    document.querySelector("input[name='userInput']").value = lastLocation;
    displayWeather(lastLocation);
  }
});

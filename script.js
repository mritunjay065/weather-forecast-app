window.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById('splash-overlay');
  const splashText = document.getElementById('splash-text');
  const leftIcon = document.querySelector('.left-icon');
  const rightIcon = document.querySelector('.right-icon');
  const loginSection = document.getElementById('login-section');
  const mainContent = document.getElementById('main-content');
  const loginForm = document.getElementById('login-form');

  // Show splash screen, then transition to login
  leftIcon.classList.add('fly-in');
  rightIcon.classList.add('fly-in');

  setTimeout(() => {
    splash.style.opacity = 0;
    setTimeout(() => {
      splash.style.display = 'none';
      loginSection.style.display = 'flex'; // Show login section
    }, 1000);
  }, 3000);

  splashText.addEventListener('click', () => {
    splash.style.opacity = 0;
    setTimeout(() => {
      splash.style.display = 'none';
      loginSection.style.display = 'flex';
    }, 1000);
  });

  // Handle login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // In a real app, you would validate credentials here.
    // For this example, we'll just transition to the main app.
    loginSection.style.opacity = 0;
    setTimeout(() => {
      loginSection.style.display = 'none';
      mainContent.classList.remove('d-none'); // Show main content
      fetchWeather("Delhi"); // Load weather data for the default city
    }, 1000);
  });

  // Your existing weather app code below
  const cityNameElem = document.getElementById("cityName");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  function updateTableRow(city, data) {
    const tableBody = document.querySelector('table tbody');
    let tableRow = document.querySelector(`tr[data-city="${city}"]`);
    const current = data.current;
    const forecastDay = data.forecast.forecastday[0].day;
    const astro = data.forecast.forecastday[0].astro;

    if (!tableRow) {
      tableRow = document.createElement('tr');
      tableRow.setAttribute('data-city', city);
      tableRow.innerHTML = `
        <th scope="row" class="text-start">${city}</th>
        <td class="temp"></td>
        <td class="feels-like"></td>
        <td class="condition"></td>
        <td class="humidity"></td>
        <td class="wind"></td>
        <td class="max-temp"></td>
        <td class="min-temp"></td>
        <td class="sunrise"></td>
        <td class="sunset"></td>
      `;
      tableBody.appendChild(tableRow);
    }
    tableRow.querySelector('.temp').textContent = `${current.temp_c} °C`;
    tableRow.querySelector('.feels-like').textContent = `${current.feelslike_c} °C`;
    tableRow.querySelector('.condition').textContent = current.condition.text;
    tableRow.querySelector('.humidity').textContent = `${current.humidity}%`;
    tableRow.querySelector('.wind').textContent = `${current.wind_kph} km/h ${current.wind_dir}`;
    tableRow.querySelector('.max-temp').textContent = `${forecastDay.maxtemp_c} °C`;
    tableRow.querySelector('.min-temp').textContent = `${forecastDay.mintemp_c} °C`;
    tableRow.querySelector('.sunrise').textContent = astro.sunrise;
    tableRow.querySelector('.sunset').textContent = astro.sunset;
  }

  async function fetchWeather(city) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=bd5122ec35a2407d98f143110252508&q=${city}&days=1&aqi=yes`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        alert(`City not found: ${data.error.message}`);
        return;
      }
      const current = data.current;
      const forecastDay = data.forecast.forecastday[0].day;
      const astro = data.forecast.forecastday[0].astro;
      cityNameElem.textContent = data.location.name;
      document.getElementById("temperature").textContent = `${current.temp_c} °C`;
      document.getElementById("feels-like").textContent = `${current.feelslike_c} °C`;
      document.getElementById("condition").textContent = current.condition.text;
      document.getElementById("humidity").textContent = `${current.humidity}%`;
      document.getElementById("wind").textContent = `${current.wind_kph} km/h ${current.wind_dir}`;
      document.getElementById("max-temp").textContent = `${forecastDay.maxtemp_c} °C`;
      document.getElementById("min-temp").textContent = `${forecastDay.mintemp_c} °C`;
      document.getElementById("sunrise").textContent = astro.sunrise;
      document.getElementById("sunset").textContent = astro.sunset;
      updateTableRow(data.location.name, data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
      fetchWeather(city);
      searchInput.value = "";
    }
  });
});
/* Global Variables */

// A date constant to store today's date
const date = new Date().toLocaleDateString();

// A constant to store my OpenWeatherMap's API Key
const API_KEY = "96f9137b3ebc18e13dc2b0d3723fc541";

// A constant to store the base url used throughout the app
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const fetchWeatherTemp = async (baseURL, zip, apiKey) => {
  const url = `${baseURL}?zip=${zip}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const postWeatherData = async (url, data) => {
  const response = fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return response;
};

const updateEntry = async (url) => {
  const response = await fetch(url);
  const data = response.json().then((data) => {
    document.querySelector("#date").innerHTML = data.date;
    document.querySelector("#temp").innerHTML = data.temp;
    document.querySelector("#content").innerHTML = data.userResponse;
  });
};

const onClickHandler = () => {
  const zipCode = document.querySelector("#zip").value;
  const feelings = document.querySelector("#feelings").value;

  fetchWeatherTemp(BASE_URL, zipCode, API_KEY)
    .then((data) => {
      console.log(data);
      return postWeatherData("/data", {
        temp: data.main.temp,
        date: date,
        userResponse: feelings
      });
    })
    .then(() => {
      updateEntry("/data");
    })
    .catch((err) => {
      console.log(err);
    });
};

// Register event listener to the Generate Button
document.querySelector("#generate").addEventListener("click", onClickHandler);

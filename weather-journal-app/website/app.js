/* Global Variables */

// A date constant to store today's date
const date = new Date().toLocaleDateString();

// A constant to store my OpenWeatherMap's API Key
const API_KEY = "96f9137b3ebc18e13dc2b0d3723fc541";

// A constant to store the base url used throughout the app
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// A function to validate inputs
const validateInputs = (zip, feelings) => {
  if (zip === "") {
    alert("ZIP Code cannot be empty!");
    return false;
  } else if (zip.length != 5 || isNaN(parseInt(zip))) {
    alert("ZIP Code must be a number consisting of 5 digits!");
    return false;
  } else if (feelings === "") {
    alert("Feelings cannot be empty!");
    return false;
  }
  return true;
};

// An asynchronus function that sends an HTTP GET request to OpenWeatherMap API to fetch the current temperature of a location given a zip code.
const fetchWeatherTemp = async (baseURL, zip, apiKey) => {
  const url = `${baseURL}?zip=${zip}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        "fetching temperature from Open Weather Map. Please ensure you entered a correct US ZIP Code!"
      );
    }
    const data = await response.json();
    return data;
  } catch (err) {
    alert(err);
  }
};

// An asynchronus function that sends an HTTP POST request to the node server to update the latest entry there.
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

// An asynchronus function that feteches the latest entry from the node server API and updates the page content accordingly.
const updateEntry = async (url) => {
  const response = await fetch(url);
  const data = response.json().then((data) => {
    document.querySelector("#date").innerHTML = data.date;
    document.querySelector("#temp").innerHTML = `${data.temp} Celsius`;
    document.querySelector("#content").innerHTML = data.userResponse;
  });
};

// onClick event handler for clicking the generate button.
const onClickHandler = () => {
  const zipCode = document.querySelector("#zip").value;
  const feelings = document.querySelector("#feelings").value;

  //Validate inputs and if returns false (invalid), immediately return
  if (!validateInputs(zipCode, feelings)) {
    return;
  }
  fetchWeatherTemp(BASE_URL, zipCode, API_KEY)
    .then((data) => {
      return postWeatherData("/data", {
        temp: data.main.temp,
        date: date,
        userResponse: feelings
      });
    })
    .then(() => {
      updateEntry("/data");
    })
    .catch(() => {
      alert(
        "Error: Could not post data to server nor update the UI since the temperature could not be fetched from Open Weather Map."
      );
    });
};

// Register event listener to the Generate Button
document.querySelector("#generate").addEventListener("click", onClickHandler);

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Port
const port = 3000;

// Require Express to run server and routes
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());
// Initialize the main project folder
app.use(express.static("website"));

// GET route that returns projectData object
app.get("/data", (req, res) => {
  console.log(projectData);
  res.send(JSON.stringify(projectData));
});

// POST route that adds incoming data to the global projectData object
app.post("/data", (req, res) => {
  const data = req.body;
  projectData.temp = data.temp;
  projectData.date = data.date;
  projectData.userResponse = data.userResponse;
  res.send("Data added successfully.");
});

// Setup Server
const server = app.listen(port, () => {
  console.log(`Listening to localhost:${port}`);
});

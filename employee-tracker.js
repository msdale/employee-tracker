const express = require('express');
const { promptTrackerAction } = require('./utils/tracker-inquirer')

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Start up the Employee Tracker
promptTrackerAction('Execute')
.catch(err => {
  console.log(err);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

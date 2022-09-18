const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const dbconfigs = require('./app/config/db.config');

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));

mongoose.connect(dbconfigs.mongoURI);

const db = mongoose.connection;

db.on('open', () => {
  console.log('Connected to database successfully');
});

db.on('error', () => {
  console.log('Error connecting to database');
});

require('./app/routes/user.routes')(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

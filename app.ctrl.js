// include express
const express = require('express');
const app = express();

// include the mustache template engine for express
const mustacheExpress = require('mustache-express');

// include the model so the controller can use its functions
const Model = require('./app.model.js');

// create database connection
Model.makeConnection();

// registers the mustache engine with express
app.engine('mustache', mustacheExpress());

// sets mustache to be the view engine
app.set('view engine', 'mustache');

// sets /views to be the /views folder
// files should have the extension filename.mustache
app.set('views', __dirname + '/views');

app.get('/', async function (req, res) {
  console.log('GET /');
  try {
    const businessArray = await Model.getAllBusinesses();

    res.render('main_page', {
      businesses: businessArray,
    });
  } catch (error) {
    console.error(error);
  }
});

// catch-all router case intended for static files
app.get(/^(.+)$/, function (req, res) {
  res.sendFile(__dirname + req.params[0]);
});

app.listen(3000, function () {
  console.log('server listening on port 3000...');
});

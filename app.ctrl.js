// include express
const express = require('express');
const app = express();

// include the mustache template engine for express
const mustacheExpress = require('mustache-express');

// include the model so the controller can use its functions
const Model = require('./app.model.js');

app.use(express.urlencoded({ extended: true }));

// create database connection
Model.makeConnection();

// registers the mustache engine with express
app.engine('mustache', mustacheExpress());

// sets mustache to be the view engine
app.set('view engine', 'mustache');

// sets /views to be the /views folder
// files should have the extension filename.mustache
app.set('views', __dirname + '/views');

global.userId = null;

app.get('/', async function (req, res) {
  console.log('GET /');
  try {
    const businessArray = await Model.getAllBusinesses();

    res.render('main_page', {
      businesses: businessArray,
      userId: global.userId,
    });
  } catch (error) {
    console.error(error);
  }
});

// Show signup form
app.get('/signupform', async function (req, res) {
  try {
    const businessArray = await Model.getAllBusinesses();

    res.render('main_page', {
      businesses: businessArray,
      showSignupForm: true,
    });
  } catch (error) {
    console.error(error);
  }
});

// Show login form
app.get('/loginform', async function (req, res) {
  try {
    const businessArray = await Model.getAllBusinesses();

    res.render('main_page', {
      businesses: businessArray,
      showLoginForm: true,
    });
  } catch (error) {
    console.error(error);
  }
});

// Show business info for update
app.get('/updateform', async function (req, res) {
  try {
    // Get business info for logged-in user
    const businessArray = await Model.getAllBusinesses();

    // For regular requests, render the page with the modal showing
    res.render('main_page', {
      businesses: businessArray,
      showUpdateForm: true,
      userId: global.userId,
    });
  } catch (error) {
    console.error(error);
  }
});

// Change password form
app.get('/passwordform', async function (req, res) {
  try {
    const businessArray = await Model.getAllBusinesses();

    res.render('main_page', {
      businesses: businessArray,
      showPasswordForm: true,
    });
  } catch (error) {
    console.error(error);
  }
});

// Business user signup
app.post('/signup', async function (req, res) {
  console.log('Received form data:', req.body);
  const result = await Model.createBusinessUser(
    req.body.userName,
    req.body.password,
    req.body.businessName,
    req.body.phone,
    req.body.email,
    parseInt(req.body.price)
  );

  res.redirect('/');
});

// Business user login
app.post('/login', async function (req, res) {
  try {
    const user = await Model.loginBusinessUser(req.body.userName, req.body.password);

    global.userId = user.user_id;

    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
});

// Update business info
app.post('/update', async function (req, res) {
  try {
    await Model.updateBusinessInfo(
      req.body.userId,
      req.body.businessName,
      req.body.phone,
      req.body.email,
      parseInt(req.body.price)
    );

    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
});

// Delete account
app.get('/delete', async function (req, res) {
  try {
    await Model.deleteBusinessAccount(global.userId);

    global.userId = null;

    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
});

// Logout
app.get('/logout', function (req, res) {
  global.userId = null;

  res.redirect('/');
});

// Change password
app.post('/changepassword', async function (req, res) {
  try {
    await Model.changePassword(global.userId, req.body.newPassword);

    res.redirect('/');
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

// include express
const express = require('express');
const app = express();
const session = require('express-session');

// include the mustache template engine for express
const mustacheExpress = require('mustache-express');

// include the model so the controller can use its functions
const Model = require('./app.model.js');

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'tire-change-secret',
    resave: false,
    saveUninitialized: true,
  })
);

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
      userId: req.session.userId,
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
    const businessInfo = await Model.getBusinessInfo(req.session.userId);

    // For regular requests, render the page with the modal showing
    res.render('main_page', {
      businesses: businessArray,
      showUpdateForm: true,
      userId: req.session.userId,
      updateData: businessInfo,
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
      userId: req.session.userId,
    });
  } catch (error) {
    console.error(error);
  }
});

// Business user signup
app.post('/signup', async function (req, res) {
  let errors = {};

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate phone (digits only)
  const phoneRegex = /^\d+$/;
  if (!phoneRegex.test(req.body.phone)) {
    errors.phone = 'Phone number must contain only digits';
  }

  // Check if username already exists
  const existingUser = await Model.GetUserInfo(req.body.userName);

  if (existingUser) {
    errors.userName = 'Username already exists';
  }

  // validation errors exist
  if (Object.keys(errors).length > 0) {
    const businessArray = await Model.getAllBusinesses();
    return res.render('main_page', {
      businesses: businessArray,
      signupData: req.body,
      signupErrors: errors,
      showSignupForm: true,
    });
  }

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

    req.session.userId = user.user_id;
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/loginform');
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
    await Model.deleteBusinessAccount(req.session.userId);

    req.session.destroy();
    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
});

// Logout
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

// Change password
app.post('/changepassword', async function (req, res) {
  try {
    await Model.changePassword(req.session.userId, req.body.newPassword);

    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
});

// Business search by price
app.get('/search', async function (req, res) {
  try {
    const maxPrice = req.query.maxPrice;
    let businessArray;

    if (maxPrice && !isNaN(maxPrice)) {
      businessArray = await Model.searchBusinessByPrice(maxPrice);
    } else {
      businessArray = await Model.getAllBusinesses();
    }

    res.render('main_page', {
      businesses: businessArray,
      searchPrice: maxPrice,
      userId: req.session.userId,
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

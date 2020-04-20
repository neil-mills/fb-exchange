const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errors');
const Bundler = require('parcel-bundler');
const { entryFiles, options } = require('./parcel.config');
require('./handlers/passport');
// create our Express app
const app = express();

const bundler = new Bundler(entryFiles, options);

app.use(bundler.middleware());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); 

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport js for handling logins
app.use(passport.initialize());
app.use(passport.session());

// Use flashes
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals = {
    ...res.locals,
    h: helpers,
    flashes: req.flash(),
    user: req.user || null,
    currentPath: req.path
  }
  next();
});

// Routes
require('./routes')(app);

// If no matching routes, set 404 and goto nect error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
//app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;

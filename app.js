const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const debugInit = require('debug')('econgress:init')

// Environment variables setup
require('dotenv').config()

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// HELPERS
const database = require('./helpers/database')
const auth = require('./helpers/auth')

// ROUTES
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// EXPRESS SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// START
database.connect()
	.then(setupPassport)
	.then(setupRoutes)
	.then(() => {
		debugInit('Application initialization finished successfully!')
	})
	.catch((err) => {
		debugInit('Error found while initializing the application: ' + err)
	})

// PASSPORT
function setupPassport() {
	return new Promise((resolve, reject) => {
		debugInit('Setting up Passport...')
		app.use(session({ // Session initialization
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: true,
			cookie: {
				secure: true,
				maxAge: 604800000, // 7 days
				httpOnly: true // helps mitigate some attacks
			},
			store: new MongoStore({
				mongooseConnection: database.get()
			})
		}))
		app.use(passport.initialize())
		app.use(passport.session())

		// Local Strategy initialization
		passport.use(new LocalStrategy(auth))

		passport.serializeUser(function (user, done) {
			done(null, user._id)
		})

		const User = require('./models/User')
		passport.deserializeUser(function (id, done) {
			User.findById(id, (err, user) => {
				done(err, user)
			})
		})
		debugInit('Done')
		resolve()
	})
}


// SET ROUTES
function setupRoutes() {
	return new Promise((resolve, reject) => {
		debugInit('Setting up routes...')
		app.use('/', indexRouter);
		app.use('/users', usersRouter);
		// catch 404 and forward to error handler
		app.use(function (req, res, next) {
			next(createError(404));
		})

		// error handler
		app.use(function (err, req, res, next) {
			// set locals, only providing error in development
			res.locals.message = err.message;
			res.locals.error = req.app.get('env') === 'development' ? err : {};

			// render the error page
			res.status(err.status || 500);
			res.render('error');
		})
		debugInit('Done')
		resolve()
	})
}


module.exports = app;

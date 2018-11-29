/*
 * Copyright 2018 Diego Ortín Fernández
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const debugInit = require('debug')('econgress:init')

// Environment variables setup
require('dotenv').config()

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// HELPERS
const database = require('./helpers/database')
const auth = require('./helpers/auth')
const addRenderingData = require('./helpers/addRenderingData')

// ROUTES
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const signupRouter = require('./routes/signup')
const loginRouter = require('./routes/login')

const app = express()

// EXPRESS SETUP
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// START
database.connect()
	.then(setupPassport)
	.then(setupRoutes)
	.then(() => {
		debugInit('Application initialization finished successfully!')
	})
	.catch((err) => {
		debugInit('Error found while initializing the application: ' + err)
		console.error(err)
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
		app.use(addRenderingData)
		app.use('/', indexRouter)
		app.use('/users', usersRouter)
		app.use('/signup', signupRouter)
		app.use('/login', loginRouter)
		// catch 404 and forward to error handler
		app.use(function (req, res, next) {
			next(createError(404))
		})

		app.post('/auth', passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		}))

		// error handler
		app.use(function (err, req, res, next) {
			// set locals, only providing error in development
			res.locals.message = err.message
			res.locals.error = req.app.get('env') === 'development' ? err : {}

			// render the error page
			res.status(err.status || 500)
			res.render('error')
		})
		debugInit('Done')
		resolve()
	})
}


module.exports = app

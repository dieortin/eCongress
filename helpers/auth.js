const bcrypt = require('bcrypt')
const User = require('../models/User.js')
const debugAuth = require('debug')('econgress:auth')

function verifyCredentials(username, password, done) {
	findUser(username, password, done, verifyPassword)
}

function findUser(username, password, done, callback) {
	User.findOne({'username': username}, 'username passwordHash', (err, user) => {
		if (err) {
			return console.error(err)
		}
		if (!user) {
			debugAuth('username ' + username + ' not found!')
			return done(null, false, {
				message: 'Incorrect username or password'
			})
		} else {
			debugAuth('Verifying password ' + password + ' for username ' + username)
			return callback(null, user, password, done)
		}
	})
}

function verifyPassword(err, user, password, done) {
	/// Always use hashed passwords and fixed time comparison
	bcrypt.compare(password, user.passwordHash, (err, isValid) => {
		if (err) {
			return done(err)
		}
		if (!isValid) {
			debugAuth('The password ' + password + ' is invalid for user ' + user.username)
			return done(null, false, {
				message: 'Incorrect username or password.'
			})
		}
		debugAuth('The password ' + password + ' is valid for user ' + user.username)
		return done(null, user)
	})
}

module.exports = verifyCredentials
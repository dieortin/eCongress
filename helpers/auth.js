/*
 * Copyright 2018 Diego Ortín Fernández
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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
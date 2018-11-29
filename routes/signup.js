/*
 * Copyright 2018 Diego Ortín Fernández
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const express = require('express')
const debugSignup = require('debug')('econgress:signup')
const bcrypt = require('bcrypt')
const router = express.Router()

const User = require('../models/User')

router.post('/', function (req, res, next) {
	const username = req.body.username
	const password = req.body.password

	debugSignup(`New registration attempt: username="${username}" password="${password}"`)
	if (!username || !password) {
		debugSignup(`Registration attempt with empty fields rejected`)
		req.app.locals.renderingOptions.message = 'Ni el nombre de usuario ni la contraseña pueden estar vacíos'
		res.render('notice', req.app.locals.renderingOptions)
	} else {
		usernameIsTaken(username, (err, isTaken) => {
			if (err) {
				debugSignup(`Error while checking if the username ${username} is taken`)
				return next(err)
			} else if (isTaken) {
				req.app.locals.renderingOptions.message = 'Ya existe una cuenta con este nombre de usuario'
				res.render('notice', req.app.locals.renderingOptions)
			} else {
				bcrypt.hash(password, 10, function (err, hash) {
					const newUser = new User({
						username: username,
						passwordHash: hash
					})
					newUser.save((err, newUser) => {
						if (err) {
							return next(err)
						}
						debugSignup(`New User registered: username:${username} hash:${hash}`)
						req.login(newUser, (err) => {
							if (err) {
								return next(err)
							}
							debugSignup('Successfully logged in new user')
							return res.redirect('/')
						})
					})
				})
			}
		})
	}
})

function usernameIsTaken(username, callback) {
	User.countDocuments({username: username}, (err, count) => {
		if (err) {
			debugSignup(err)
			return callback(err)
		}
		callback(null, count !== 0)
	})
}

module.exports = router

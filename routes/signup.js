/*
 * Copyright 2018 Diego Ortín Fernández
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var express = require('express')
const debugSignup = require('debug')('econgress:signup')
const bcrypt = require('bcrypt')
var router = express.Router()

const User = require('../models/User')

router.post('/', function (req, res, next) {
	const username = req.body.username
	const password = req.body.password

	debugSignup(`New registration attempt: ${username} ${password}`)
	if (!username || !password) {
		debugSignup(`Registration attempt with empty fields rejected`)
		res.render('notice', {message: 'Ni el nombre de usuario ni la contraseña pueden estar vacíos'})
	} else {
		bcrypt.hash(password, 10, function (err, hash) {
			const newUser = new User({
				username: username,
				passwordHash: hash
			})
			newUser.save((err /*, newUser*/) => {
				if (err) {
					return console.error(err)
				}
				debugSignup(`New User registered: username:${username} hash:${hash}`)
				res.redirect('https://google.es')
			})
		})
	}
})

module.exports = router
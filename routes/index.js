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
const router = express.Router()

//const debugIndex = require('debug')('econgress:index')

/* GET home page. */
router.get('/', function (req, res/*, next*/) {
	req.app.locals.renderingOptions.login = false
	sendWelcomeOrHomepage(req, res)
});

router.get('/login', function (req, res/*, next*/) {
	req.app.locals.renderingOptions.login = true
	sendWelcomeOrHomepage(req, res)
})

function sendWelcomeOrHomepage(req, res) {
	if (req.isAuthenticated()) {
		//debugIndex('Request authenticated')
		res.render('index', req.app.locals.renderingOptions)
	} else {
		//debugIndex('Request NOT authenticated')
		res.render('welcome', req.app.locals.renderingOptions)
	}
}

module.exports = router;

/*
 * Copyright 2018 Diego Ortín Fernández
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to
 * do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const express = require('express')
const router = express.Router()

const checkAuth = require('../helpers/checkAuth')
const Proposal = require('../models/Proposal')

//const debugIndex = require('debug')('econgress:index')
const debugProposals = require('debug')('econgress:proposals')

/* GET home page. */
router.get('/', function (req, res/*, next*/) {
	Proposal.find({}, function (err, proposals) {
		req.app.locals.renderingOptions.proposals = proposals
		sendWelcomeOrHomepage(req, res)
	})
});

router.get('/login', function (req, res/*, next*/) {
	req.app.locals.renderingOptions.login = true
	sendWelcomeOrHomepage(req, res)
})

router.get('/newProposal', function (req, res) {
	req.app.locals.renderingOptions.newProposal = true
	sendWelcomeOrHomepage(req, res)
})

router.post('/newProposal', checkAuth, function (req, res, next) {
	const proposalName = req.body.name
	const proposalExplanation = req.body.explanation

	const newProposal = new Proposal({
		name: proposalName,
		explanation: proposalExplanation,
		user: req.user.username,
		votes: [req.user.username]
	})

	newProposal.save((err, savedProposal) => {
		if (err) return next(err)
		debugProposals(`New proposal added: name:${proposalName} with date ${savedProposal.dateAdded}`)
		res.redirect('/')
	})
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

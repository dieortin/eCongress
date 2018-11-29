/*
 * Copyright 2018 Diego Ortín Fernández
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const debugDb = require('debug')('econgress:db')
const mongoose = require('mongoose')
require('dotenv').config()

const dbopt = {
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	pass: process.env.DATABASE_PASSWORD,
	port: process.env.DATABASE_PORT,
	path: process.env.DATABASE_PATH
}
const dbCredString = dbopt.user + ':' + dbopt.pass
const dbHostString = dbopt.host + ':' + dbopt.port + '/' + dbopt.path
const dbCompletePath = dbCredString + '@' + dbHostString

let db = null

exports.connect = function () {
	if (containsEmptyStrings(dbopt)) {
		throw new Error('Some needed database connection parameters are blank, check your environment variables')
	}
	debugDb('Connecting to database on ' + dbHostString)
	return new Promise((resolve, reject) => {
		mongoose.connect('mongodb://' + dbCompletePath, {useNewUrlParser: true})
			.then(() => {
				db = mongoose.connection
				debugDb('Connected to the database successfully!')
				resolve()
			})
			.catch((err) => {
				console.log('Error while connecting to the database!: ' + err)
				reject()
			})
	})
}

exports.get = function () {
	return db
}

exports.disconnect = function (done) {
	if (db) {
		db.close((err) => {
			done(err)
		})
	}
}

function containsEmptyStrings(obj) {
	for (const p in obj) {
		if (obj.hasOwnProperty(p) && (obj[p] === '' || obj[p] === null)) return true
	}
	return false
}
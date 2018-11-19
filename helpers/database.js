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
	for (var p in obj) {
		if (obj.hasOwnProperty(p) && (obj[p] === '' || obj[p] === null)) return true
	}
	return false
}
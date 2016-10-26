const fs		= require('fs')
const bayes 	= require('bayes')
const stemmer 	= require('porter-stemmer').stemmer
const sw		= require('stopword')

const dataFile			= __dirname+'/../data/data.json'
const classifierFile 	= __dirname+'/../data/classifier.json'

let classifier = bayes()

module.exports = {
	classifier: classifier,
	train: 		trainBaseClassifier,
	add: 		addToClassifier,
	classify: 	classifyText 
}

function trainBaseClassifier() {
	fs.readFile(dataFile, 'utf8', (err, data) => {
		if (err) throw err
		data = JSON.parse(data)
		data.forEach( (item) => {
			classifier.learn(preprocess(item.text), item.sentiment)
		})
		fs.writeFile(classifierFile, classifier.toJson(), (err => {
			if (err) throw err
		}))
		
	})
}

function addToClassifier(item) {
	fs.readFile(classifierFile, 'utf8', (err, data) => {
		let classifier = bayes.fromJson(data)
		classifier.learn(preprocess(item.text), item.sentiment)
		fs.writeFile(classifierFile, classifier.toJson(), (err) => {
			if (err) throw err
		})
	})
}

function classifyText(text, callback) {
	fs.readFile(classifierFile, (err, data) => {
		let classifier = bayes.fromJson(data)
		let sentiment = classifier.categorize(preprocess(text))
		let output = {
			text: 		text,
			sentiment: 	sentiment
		}
		callback(output)
	})
}

function preprocess(string) {
	return sw.removeStopwords(string.split(' '))
		.map( (item) => { return stemmer(item) })
		.join(' ')
}
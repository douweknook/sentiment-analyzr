const fs		= require('fs')
const bayes 	= require('bayes')
const stemmer 	= require('porter-stemmer').stemmer
const sw		= require('stopword')

const corpusData		= __dirname+'/../data/corpus.json'
const dataFile			= __dirname+'/../data/data.json'
const classifierFile 	= __dirname+'/../data/classifier.json'

let classifier = bayes()

module.exports = {
	classifier: classifier,
	train: 		trainBaseClassifier,
	add: 		addToClassifier,
	classify: 	classifyText 
}

function trainBaseClassifier(corpus) {
	fs.readFile(dataFile, 'utf8', (err, data) => {
		if (err) throw err
		data = JSON.parse(data)
		data.forEach( (item) => {
			classifier.learn(preprocess(item.text), item.sentiment)
		})
		if (corpus) {
			fs.readFile(corpusData, 'utf8', (err, data) => {
				if (err) throw err
				data = JSON.parse(data)
				data.forEach( (item) => {
					classifier.learn(preprocess(item.text), item.sentiment)
				})
				fs.writeFile(classifierFile, classifier.toJson(), (err => {
					if (err) throw err
				}))
			})
		} else {
			fs.writeFile(classifierFile, classifier.toJson(), (err => {
				if (err) throw err
			}))
		}	
	})
}

function addToClassifier(item) {
	classifier.learn(preprocess(item.text), item.sentiment)
	fs.writeFile(classifierFile, classifier.toJson(), (err) => {
		if (err) throw err
	})
}

function classifyText(text, callback) {
	let sentiment = classifier.categorize(preprocess(text))
	let output = {
		text: 		text,
		sentiment: 	sentiment
	}
	callback(output)
}

function preprocess(string) {
	return sw.removeStopwords(string.split(' '))
		.map( (item) => { return stemmer(item) })
		.join(' ')
}
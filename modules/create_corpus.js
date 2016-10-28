/*
Module to re-format data from AFINN.json to make it suitable for training our classifier.
The AFINN.json file was taken from the npm sentiment package (https://www.npmjs.com/package/sentiment)
*/

const fs = require('fs')

let inputFile = __dirname+'/../data/AFINN.json'
let outputFile = __dirname+'/../data/corpus.json'

function getData(inputFile, outputFile) {
	fs.readFile(inputFile, (err, data) => {
		if (err) throw err
		data = JSON.parse(data)
		// Data {word: sentiment} (negative = negtive number; postivie = positive number)
		let output = []
		for (prop in data) {
			if (data[prop] > 0) {
				data[prop] = "positive"
			} else if (data[prop] < 0) {
				data[prop] = "negative"
			}
			else {
				data[prop] = "neutral"
			}
			if (data.hasOwnProperty(prop)) {
				output.push({
					text: 		prop,
					sentiment: 	data[prop]
				})
			}
		}
		fs.writeFile(outputFile, JSON.stringify(output, null, 2), (err) => {
			if (err) throw err
		})
	})
}

getData(inputFile, outputFile)
const fs 			= require('fs')
const express		= require('express')
const bodyParser 	= require('body-parser')

const classifier	= require(__dirname+'/modules/classifier')
const twitter 		= require(__dirname+'/modules/twitter')

const app = express()
const dataFile = __dirname+'/data/data.json'

app.use(express.static('views'))

app.set('view engine', 'pug')
app.set('views', __dirname+'/views')

app.get('/', (req, res) => {
	res.render('index')
})

app.get('/add', (req, res) => {
	res.render('add')
})

app.get('/twitter', (req, res) => {
	let amount = 5
	twitter.search( amount, 
		(err) => { console.log(err) }, 
		(data)=> {
			data = JSON.parse(data)
			let tweets = data.statuses.map( (x) => {
				return {
					handle: 	x.user.screen_name, 
					username: 	x.user.name, 
					tweet_id: 	x.id, 
					text: 		x.text 
				}
			})
			res.render('twitter', {tweets: tweets, amount: amount})
	} )
})

app.post('/send-data', bodyParser.urlencoded({extended: true}), (req, res) => {
	for (let z = req.body.input.length - 1; z >= 0; z--) {
		classifier.add(req.body.input[z])
	}
	fs.readFile(dataFile, (err, data) => {
		if (err) throw err
		data = JSON.parse(data)
		data = data.concat(req.body.input)
		fs.writeFile(dataFile, JSON.stringify(data, null, 2), (err) => {
			if (err) throw err
			// send a response message back on last iteration!
			res.send("Input added to database, classifier updated. Thank you.")
		})
	})
})

app.post('/classify', bodyParser.urlencoded({extended: true}), (req, res) => {
	classifier.classify(req.body.text, (data) => {
		res.send(data)
	})
})

app.listen(8000, ()=>{
	classifier.train(true)
	console.log('Server running...')
})


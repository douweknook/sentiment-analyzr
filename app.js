const fs 			= require('fs')
const express		= require('express')
const bodyParser 	= require('body-parser')
const classifier	= require(__dirname+'/modules/classifier')

const app = express()
const dataFile = __dirname+'/data/data.json'

app.use(express.static('views'))

app.set('view engine', 'pug')
app.set('views', __dirname+'/views')

app.get('/', (req, res) => {
	res.render('index')
})

app.post('/send-data', bodyParser.urlencoded({extended: true}), (req, res) => {
	console.log(req.body)
	fs.readFile(dataFile, (err, data) => {
		if (err) throw err
		data = JSON.parse(data)
		data.push(req.body)
		fs.writeFile(dataFile, JSON.stringify(data, null, 2), (err) => {
			if (err) throw err
			// send some response message back!
			classifier.add(req.body)
			res.send("Input added to database, classifier updated.")
		})
	})
})

app.get('/add', (req, res) => {
	res.render('add')
})

app.post('/classify', bodyParser.urlencoded({extended: true}), (req, res) => {
	classifier.classify(req.body.text, (data) => {
		res.send(data)
	})
})

app.listen(8000, ()=>{
	classifier.train()
	console.log('Server running...')
})


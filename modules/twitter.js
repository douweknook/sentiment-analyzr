const Twitter 	= require('twitter-node-client').Twitter
const dotenv 	= require( 'dotenv' )
dotenv.load()

let configFile 	= __dirname+'/../data/twitter_config'

let twitter = new Twitter({
	consumerKey: 		process.env.CONSUMER_KEY,
	consumerSecret: 	process.env.CONSUMER_SECRET,
	accessToken: 		process.env.ACCESS_TOKEN,
	accessTokenSecret: 	process.env.ACCESS_TOKEN_SECRET,
	callBackUrl: 		process.env.CALLBACK_URL
})

module.exports = {
	twitter: twitter,
	search:	 search
}

function error(err, response, body) {
		console.log("ERROR")
		console.log(err)
}

function success(data) {
		console.log(data)
}

function search(query, amount) {
	twitter.getSearch({'q':query,'count':amount}, error, (data) => {
		return data
	});
}


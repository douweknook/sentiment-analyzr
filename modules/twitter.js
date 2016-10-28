const Twitter 		= require('twitter-node-client').Twitter
const randomWords 	= require('random-words');
const dotenv 		= require( 'dotenv' )
dotenv.load()

let configFile 	= __dirname+'/../data/twitter_config'

// Set up connection with twittet API
let twitter = new Twitter({
	consumerKey: 		process.env.CONSUMER_KEY,
	consumerSecret: 	process.env.CONSUMER_SECRET,
	accessToken: 		process.env.ACCESS_TOKEN,
	accessTokenSecret: 	process.env.ACCESS_TOKEN_SECRET,
	callBackUrl: 		process.env.CALLBACK_URL
})

module.exports = {
	twitter:	twitter,
	search:		search
}

// Search specified amount of tweets for specified query (error and success = fail/success callbacks)
function search(amount, error, success) {
	let query = randomWords(1).join()
	twitter.getSearch({'q':query,'count':amount, lang:'en'}, error, success)
}

// function error(err, response, body) {
// 	console.log("ERROR")
// 	console.log(err)
// }

// function success(data) {
// 	console.log(data)
// }
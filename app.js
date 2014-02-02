var oauth = require('oauth').OAuth;
var https = require('https');
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var querystring = require('querystring');
var twitterOauth = new oauth (
		"https://api.twitter.com/oauth/request_token",
		"https://api.twitter.com/oauth/access_token",
		"TBb8Ikz7FmU9r24fD8Lyw",
		"O7vsd4X5W5lMGxCAxrQNqs1a5dT0YSGsW6VMJqZHg",
		"1.0A",
		null,
		"HMAC-SHA1"
);
var token = "39563947-xFt1GO9wKRgspfRrCyviGimHDekKyMAsjjAjoYHtx";
var token_secret = "qMD3J51GWSQkvNpfN3UnIpWbbU4L5LPYeqPejoYRvI";

// var healthcare_data_db;
// MongoClient.connect('mongodb://127.0.0.1:27017/healthcare-watch', function(err, db) {
//     if(err) throw err;
//     healthcare_data_db = db;
// });

var healthcare_watch_db;
MongoClient.connect('mongodb://127.0.0.1:27017/healthcare-watch', function(err, db) {
    if(err) throw err;
    healthcare_watch_db = db;
});

var request = twitterOauth.post("https://stream.twitter.com/1.1/statuses/filter.json", token, token_secret, { locations : "34.219335602000465,-86.16237513199964,34.223335602000465,-86.15917513199964", language:"en"});

request.on('response', function (response) {
	response.setEncoding('utf8');
	response.on('data', function (chunk) {
		console.log(new Date());
		console.log("Got Data");
		if(chunk) {
			try{
				var data = JSON.parse(chunk);
				console.log(data.text);
				healthcare_watch_db.collection('tweets').insert(data, function(err, docs) {
					if(err) console.log(err);
				});
			} 
			catch(e) {
				console.log("Keep Alive Message");
			}
		}
	});
	response.on('end', function () {
		console.log('--- END ---');
		console.log(body);
	});
});
request.on('error', function(e) {
	console.log("Got error");
	console.log(e);
});
request.end();

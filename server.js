const { URL, URLSearchParams } = require('url');
const request = require('request');
const express = require('express');
const app = express();

const url = new URL('https://renass.unistra.fr/fdsnws/event/1/query?');

// http://localhost:3000/api/2017-03-18/2017-08-18/6

app.get('/api/:start/:end/:mag', (req, res) => {
	console.log(req.params);
	const params = new URLSearchParams();
	params.append('minmagnitude', req.params.mag);
	params.append('starttime', req.params.start);
	params.append('endtime', req.params.end);
	params.append('orderby', 'time');
	params.append('format', 'json');
	console.log(url + params.toString());

	request(url + params.toString(), (error, response, body) => {
		if (!error && response.statusCode == 200) {
			const info = JSON.parse(body);
			console.log(info);
			res.send(info);
		}
	});
});

app.listen(3000, () => console.log('running'));
//Include require library
var express = require('express');
var http = require("http");
var querystring = require('querystring');
var fs = require('fs');	
var path = require('path');
var util = require('util');
var Open311 = require('./lib/open311').Open311;
var app = express();
app.use(express.bodyParser());

//Declare which type of files are accepted by server
app.get('/*.(js|css|gif|png|jpeg|jpg)',function(request,response){
	response.sendfile('./'+request.url);
});

//Final json Output variable
var finaljson = null;
//Meadia folder variables
var nodeServerPath = 'http://23.23.193.45';
var mediaFolder   = '/uploadimages/';

//--------------------------------------------------------------------------
//To get list of categories
app.get('/getCategories',function(request,response){

	//Set Open311 Config
	var jurisdiction_id = request.query.jurisdiction_id;
	if(jurisdiction_id == null)jurisdiction_id="baltimorecity.gov";
	var hostpath = request.query.hostpath;
	if(hostpath == null)hostpath="311test.baltimorecity.gov";
	
	//Basic options for open311 categories list RESTAPI
	var options = {
		host: hostpath,
		port: 80,
		path: '/open311/v2/services.json',
		method: 'GET'
	};

	var req = http.request(options, function(res) {
	
		res.setEncoding('utf8');
		response.writeHead(200,{'Content-Type':'json', 'Access-Control-Allow-Orgin':'*'});			
		var body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function () {
			finaljson = body;
			response.write(finaljson);
			response.end();			
		});
	});	
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);	 
		response.write(finaljson);
		response.end();	
	});
	req.end();
});

//--------------------------------------------------------------------------
//To get list of reuested services
app.get('/getTickets',function(request,response){

	//Set Open311 Config
	var jurisdiction_id = request.query.jurisdiction_id;
	if(jurisdiction_id == null)jurisdiction_id="baltimorecity.gov";
	var hostpath = request.query.hostpath;
	if(hostpath == null)hostpath="311test.baltimorecity.gov";
	
	//Basic options for open311 Service requests RESTAPI
	var options = {
		host: hostpath,
		port: 80,
		path: '/open311/v2/requests.json?jurisdiction_id='+jurisdiction_id,
		method: 'GET'
	};

	var req = http.request(options, function(res) {
	
		res.setEncoding('utf8');
		response.writeHead(200,{'Content-Type':'json', 'Access-Control-Allow-Orgin':'*'});				
		var body = '';
		
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function () {
			finaljson = body;
			response.write(finaljson);
			response.end();			
		});
		
	});	
	req.on('error', function(e) {
	
		console.log('problem with request: ' + e.message);
		response.write(finaljson);
		response.end();	
		
	});
	req.end();
});

//--------------------------------------------------------------------------
//To submit service request
app.post('/postTicket',function(request,response){

	//Set Open311 Config
	var hostpath = request.query.hostpath;
	if(hostpath == null)hostpath="311test.baltimorecity.gov";
	var jurisdiction_id = request.query.jurisdiction_id;
	if(jurisdiction_id == null)jurisdiction_id="baltimorecity.gov";
	var api_key = request.query.api_key;
	if(api_key == null)api_key="dc189c48f1047585aecd09333a597b7a";
	
	if(request.body.media_data != null) {
		var base64Image = request.body.media_data;
		var randomno = Math.floor((Math.random()*1000000)+1);
		var decodedImage = new Buffer(base64Image, 'base64');
		fs.writeFile(__dirname+mediaFolder+randomno+'.jpg', decodedImage, function(err) {});
		var media_url = nodeServerPath+mediaFolder+randomno+'.jpg'
	}else {
		var media_url ='';
	}

	//Basic options for open311 categories list RESTAPI
	var options = {
		'endpoint': hostpath,
		'service_path': '/open311/v2/',
		'jurisdiction_id': jurisdiction_id
	};
	
	var parameters = {
		'service_code':request.body.service_code,
		'lat':request.body.latitude,
		'long':request.body.longitude,
		'description':request.body.description,
		'address_string':request.body.address_string,
		'media_url': media_url
		//'media_url':'http://twitpic.com/1n6s2k' //sample image		
	};

	// Create a new Open311 object.
	var report = new Open311(options);

	// Call postServiceRequest to create a new service request.
	report.postServiceRequest('json', request.body.service_code, api_key, parameters, function(error, data) {
		//console.log("final output "+data);
		response.writeHead(200,{'Content-Type':'json', 'Access-Control-Allow-Orgin':'*'});			
		response.write(data);
		response.end();			
		util.puts(util.inspect(data));
	});
	
});

//--------------------------------------------------------------------------
app.listen(8080);
console.log("Server Running on port 8080, but you don't need specify 8080. Just use http://23.23.193.45/ ...");
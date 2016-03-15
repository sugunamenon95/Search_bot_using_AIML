var express = require('express');
var router = express.Router();
var appl = require('../app');
var io = require('socket.io')(3300);
aimlHigh = require('aiml-high');

var botAttributes = {name:'WireInterpreter', age:'42'};

var interpret = new aimlHigh(botAttributes);
interpret.loadFiles(['./test.aiml.xml']);

var request = require('request');
var http = require('http');

var qs=require('querystring');
var query_res,query;
var dataString = {"methodName": "searchPersons",
    "parameters": ["e6e0fbe182df8cc705878cfe52c09893", "nirav"],
    "serviceName": "com.avinashi.meraCRM.services.search.SearchService"};
var callback = function(answer, wildCardArray, input){
  console.log(answer + ' | ' + wildCardArray + ' | ' + input);

  //var request = require('request');

  var headers = {
    'Content-Type': 'application/json'
  };


  var options = {
    url: 'http://client.meracrm.com',
    method: 'POST',
    headers: headers,
    body: dataString
  };


  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      query_res=JSON.stringify(body);
      /*router.get('/',function(req, res, next) {
       res.render('index', { result: body });
       });*/
    }
  }

  request(options, callback);
};


io.on('connection',function(client) {
  console.log('client connected...');

  client.on('search', function (data) {
    query = data;
    console.log(query);
  });
});


interpret.findAnswer(query,callback);



/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: query_res });
});

module.exports = router;

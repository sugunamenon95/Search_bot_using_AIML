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
var query_res;
var dataString;
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
    dataString=data;
  });
});


interpret.findAnswer('search person nirav',callback);



/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: query_res });
});

module.exports = router;

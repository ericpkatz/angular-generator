var express = require('express');
var path = require('path');
var app = express();

app.use('/browser', express.static(path.join(__dirname, 'browser')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;

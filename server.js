var express = require('express');
var mongoose = require('mongoose');

var app = express();
var db = mongoose.connect('mongodb://localhost/wally');
var Schema = mongoose.Schema;

// maping for the stock object in mongo
var StockSchema = new Schema({
  name: String,
  symbol: String,
  price: Number
});
var Stock = mongoose.model('Stock', StockSchema);

app.get('/', function(req, res){
  res.send('Hello World');
});

app.get('/stocks', function(req, res, next){

});

app.listen('3000');
console.log('Server is running...');


var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var db = mongoose.connect('mongodb://localhost/Wally');

// MONGO config for the project
var Schema = mongoose.Schema;
// maping for the stock object in mongo
var StockSchema = new Schema({
  name: String,
  symbol: String,
  price: Number
});
var Stock = mongoose.model('Stock', StockSchema);

// serve static files
app.use(express.static(__dirname + '/public'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
// parse body of request in json
app.use(bodyParser.json());

app.route('/stocks')
.get(function(req, res, next){
  Stock.find({}, function(err, stocks){
    if(err){
      return next(err);
    } else {
      res.json(stocks);
    }
  })
})
.post(function(req, res, next){
    var stock = new Stock(req.body);
    stock.save(function(err){
      if(err){
        return next(err);
      } else {
        return res.json(stock);
      }  
  });
});

app.listen('3000');
console.log('Server is running...');


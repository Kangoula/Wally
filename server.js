var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();
var db = mongoose.connect('mongodb://localhost/Wally');

// MONGO config for the project
var Schema = mongoose.Schema;
// maping for the stock object in mongo
var StockSchema = new Schema({
  name: String,
  symbol: String,
  price: Number,
  dateAdded: { type: Date, default: Date.now }
});
var Stock = mongoose.model('Stock', StockSchema);

// serve static files
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
// parse body of request in json
app.use(bodyParser.json());

app.route('/api/stocks')
  .get(function (req, res, next) {
    Stock.find({}, function (err, stocks) {
      if (err) {
        return next(err);
      } else {
        res.json(stocks);
      }
    })
  })
  .post(function (req, res, next) {
    var stock = new Stock(req.body);
    stock.dateAdded = Date.now;
    stock.save(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.json(stock);
      }
    });
  });

app.route('/api/search/:symbol')
  .get(function (req, res, next) {
    var symbol = req.params.symbol;

    var query = encodeURIComponent('select * from yahoo.finance.quotes where symbol = "' + symbol + '"');
    var url = "https://query.yahooapis.com/v1/public/yql?q=env%20'store%3A%2F%2Fdatatables.org%2Falltableswithkeys'%3B%20" + query + "&format=json"

    request(url, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var b = JSON.parse(body);

        if (b.query.results && b.query.results.quote.Ask) {
          return res.send(body);
        }
      }
      res.sendStatus(404);
    });
  });


app.listen('3000');
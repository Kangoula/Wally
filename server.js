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
  dateAdded: Date
});
var Stock = mongoose.model('Stock', StockSchema);

// serve static files
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
// parse body of request in json
app.use(bodyParser.json());

app.route('/api/stocks')
  .get(function (req, res, next) {
    // get all stocks ordered by date
    Stock.find({}).sort({
      dateAdded: 'desc'
    }).exec(function (err, stocks) {
      if (err) {
        return next(err);
      } else {
        res.json(stocks);
      }
    })
  })
  .post(function (req, res, next) {

    // create a stock with the values in request body
    var s = {
      symbol: req.body.symbol.toUpperCase(),
      price: req.body.price,
      name: req.body.name,
      dateAdded: new Date(req.body.dateAdded)
    };

    var stock = new Stock(s);

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

    // search yahoo finance for the symbol
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

// get stats for the wallet amount
app.route('/api/stats/wallet')
  .get(function (req, res, next) {
    // get all stocks ordered by date, from the last to the most recent
    Stock.find({}).sort({
      dateAdded: 'asc'
    }).exec(function (err, stocks) {
      if (err) {
        return next(err);
      } else {
        var x = [];
        var y = [];
        var total = 0;
        // compute wallet total amount
        stocks.forEach(function (elem) {
          x.push(elem.dateAdded);
          total += elem.price;
          y.push(total);
        });
        return res.json({
          x: x,
          y: y
        });
      }
    });
  });

// get stats for the calendar view
app.route('/api/stats/calendar')
  .get(function (req, res, next) {
    var map = new Map();

    Stock.find({}).sort({
      dateAdded: 'asc'
    }).exec(function (err, stocks) {
      if (!err) {
        // handle sorting and counting with a Map
        stocks.forEach(function (elem) {
          var d = new Date(elem.dateAdded);
          var parsed = d.getFullYear() + '/' + parseMonth(d.getMonth()) + '/' + d.getDate();

          if (map.has(parsed)) {
            map.set(parsed, map.get(parsed) + 1);
          } else {
            map.set(parsed, 1);
          }
        });

        // array of object to return
        var array = [];
        map.forEach(function (v, k) {
          array.push({
            date: k,
            value: v
          });
        });

        return res.json(array);
      } else {
        return next(err);
      }
    });
  });

function parseMonth(month) {
  if (month < 9) {
    return '0' + (month + 1);
  } else {
    return (month + 1);
  }
}

app.listen('3000');
var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

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

var WalletSchema = new Schema({
  date: Date,
  total: Number
});

var Stock = mongoose.model('Stock', StockSchema);
var Wallet = mongoose.model('Wallet', WalletSchema);

// serve static files
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// parse body of request in json
app.use(bodyParser.json());
app.use('/api', router);

Stock.findAll = function (callback) {
  const stock = this;

  stock.aggregate([{
      "$sort": {
        'symbol': -1,
        'price': 1
      }
    },
    {
      "$group": {
        _id: {
          "name": "$name",
          "price": "$price",
        },
        result: {
          "$last": {
            id: "$_id",
            symbol: "$symbol"
          }
        },
        count: {
          $sum: 1
        }
      }
    }
  ]).exec((err, array) => {
    if (!err) {
      var stocks = array.map((val) => {
        return {
          "_id": val.result.id,
          "name": val._id.name,
          "symbol": val.result.symbol,
          "price": val._id.price,
          "count": val.count,
        }
      });
      return callback(null, stocks);
    } else {
      return callback(err, null);
    }
  });
}

// STOCKS 
router.route('/stocks')
  // get all stocks 
  .get((req, res, next) => {
    console.log("[GET] /stocks ");
    Stock.findAll(function (err, stocks) {
      if (!err) {
        return res.json(stocks);
      } else {
        next(err);
      }
    });
  })
  // create new stock
  .post((req, res, next) => {
    console.log("[POST] /stocks");
    // create a stock with the values in request body
    var stock = new Stock({
      symbol: req.body.symbol.toUpperCase(),
      price: req.body.price,
      name: req.body.name,
      dateAdded: new Date()
    });

    stock.save((err) => {
      if (err) {
        return next(err);
      } else {
        console.log("Created new stock with id : " + stock._id);
        
        return res.json(stock);
      }
    });
  });

router.route('/stocks/:id')
  // delete stock
  .delete((req, res, next) => {
    console.log("[DELETE] /stocks/" + req.params.id);

    Stock.remove({
      _id: req.params.id
    }).exec((err) => {
      if (err) {
        return next(err);
      } else {
        return res.send(204);
      }
    });
  });

// WALLET
router.route('/wallet')
  // add a new entry
  .post((req, res, next) => {
    console.log("[POST] /wallet ");
    // get date, operation type and price of the stock in request body
    var {
      price,
      type,
      date
    } = req.body;
    // get latest wallet value
    Wallet.find()
      .limit(1)
      .sort({
        date: -1
      })
      .exec((err, response) => {
        if (!err) {
          if (response.length > 0) {
            total = response[0].total;
            // compute total
            total = type === '-' ? (new Number(total) - new Number(price)) : (new Number(total) + new Number(price));
          } else {
            total = price;
          }
          // save wallet
          var wallet = new Wallet({
            date: new Date(),
            total: total
          });

          wallet.save((err) => {
            if (err) {
              return next(err);
            } else {
              console.log("new wallet entry with value : " + wallet.total);
              return res.json(wallet);
            }
          });
        }
      });
  })
  // get all wallet values for stat purposes
  .get((req, res, next) => {
    console.log("[GET] /wallet ");
    Wallet.find()
      .sort({
        date: -1
      })
      .exec((err, values) => {
        if (!err) {
          var x = [];
          var y = [];
          var total = 0;
          // compute wallet total amount
          values.forEach((elem) => {
            x.push(elem.date);
            y.push(elem.total);
          });
          return res.json({
            x: x,
            y: y
          });

        } else {
          return next(err);
        }
      });
  });

// SEARCH
router.route('/search/:symbol')
  .get((req, res, next) => {
    var symbol = req.params.symbol;
    console.log("[GET] /search/" + symbol);

    var query = encodeURIComponent('select * from yahoo.finance.quotes where symbol = "' + symbol + '"');
    var url = "https://query.yahooapis.com/v1/public/yql?q=env%20'store%3A%2F%2Fdatatables.org%2Falltableswithkeys'%3B%20" + query + "&format=json"

    // search yahoo finance for the symbol
    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        var b = JSON.parse(body);

        if (b.query.results && b.query.results.quote.Ask) {
          return res.send(body);
        }
      }
    });
  });

// STATS
router.route('/stats/calendar')
  .get((req, res, next) => {
    console.log("[GET] /stats/calendar");
    var map = new Map();

    Stock.find().sort({
      dateAdded: 'asc'
    }).exec((err, stocks) => {
      if (!err) {
        // handle sorting and counting with a Map
        stocks.forEach((elem) => {
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
        map.forEach((v, k) => {
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
console.log("Server started :-)");

//
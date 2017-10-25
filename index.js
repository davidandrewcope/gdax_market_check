var _ = require('lodash');
var async = require('async');
var Gdax = require('gdax');
var apiURI = 'https://api.gdax.com';
var sandboxURI = 'https://api-public.sandbox.gdax.com';

var gdax = require('./config.json');

var publicClient = new Gdax.PublicClient();

async.series([
  function(callback) {
    getPrice('BTC', callback);
  },
  function(callback) {
    getPrice('ETH', callback);
  },
  function(callback) {
    getPrice('LTC', callback);
  },
  function(callback) {
    callback(null, {USD: 1});
  }

], function(err, prices) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Price against USD:");
  var price = {};

  for (var i=0,ii=prices.length;i<ii;i++){
    price[_.keys(prices[i])[0]] = _.values(prices[i])[0];
  }
  console.log(price);

  // Defaults to https://api.gdax.com if apiURI omitted
var authedClient = new Gdax.AuthenticatedClient(
  gdax.key, gdax.b64secret, gdax.passphrase, apiURI);

var gdax_acct_value = 0;
var cb_acct_value = 0;

    async.series([function(callback) {

        authedClient.getAccounts(
          function(err, response, data) {
            if (err) {
              return callback(err);
            }

            for (var i=0,ii=data.length;i<ii;i++) {
              var curr_total = parseFloat(data[i].balance, 10);
              //console.log("curr_total of " + data[i].currency + " is: " + curr_total);
              var curr_usd_val = curr_total * price[data[i].currency];

              //console.log("curr_usd_val: "  + data[i].currency + " is: " + curr_usd_val);
              gdax_acct_value = gdax_acct_value +  curr_usd_val;
              //console.log("gdax_acct_value: " + gdax_acct_value);
            }

            console.log("Total GDAX Value in USD is:     $" + gdax_acct_value.toFixed(2));
            callback(null, gdax_acct_value);
          }
        );

      },
      function(callback) {


        authedClient.getCoinbaseAccounts(
          function(err, response, data) {
            if (err) {
              return callback(err);
            }

            for (var i=0,ii=data.length;i<ii;i++) {
              var curr_total = parseFloat(data[i].balance, 10);
              //console.log("curr_total of " + data[i].currency + " is: " + curr_total);
              var curr_usd_val = curr_total * price[data[i].currency];

              //console.log("curr_usd_val: "  + data[i].currency + " is: " + curr_usd_val);
              cb_acct_value = cb_acct_value +  curr_usd_val;
              //console.log("cb_acct_value: " + cb_acct_value);
            }

            console.log("Total Coinbase Value in USD is: $" + cb_acct_value.toFixed(2));
            callback(null, cb_acct_value);
          }
        );

      }], function(err, results) {
            if (err) {
              console.log(err);
              return;
            }

        var total = results[0] + results[1];
        console.log("Total account value is:         $"+total.toFixed(2));

    });


});


function getPrice(product, cb) {
  var id = product + '-USD';
  publicClient.productID = id;
  publicClient.getProductTicker(function(err, response, data){
    if (err) { return cb(err) };
    var rs = {};
    rs[product] = parseFloat(data.price, 10);
    return cb(null, rs);
  });
}

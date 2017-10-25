This is a simple program to quickly convert the value of all your digital
holdings on the GDAX trading platform to US Dollars.

To use, copy config-sample.json to config.json and enter your API credential.

<pre>
{
  "key":"[your GDAX key]",
  "b64secret":"[your GDAX secret]",
  "passphrase":"[your GDAX passphrase]",
  "other":
    [
        {
            "currency": "BTC",
            "balance": [your other BTC holdings]
        },{
            "currency": "ETH",
            "balance": [your other ETH holdings]
        },{
            "currency": "LTC",
            "balance": [your other LTC holdings]
        },{
            "currency": "USD",
            "balance": [your other USD holdings]
        }
    ]
}
</pre>

Install with `npm install` start with `node index.js`

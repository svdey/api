const express = require("express");
const app = express();
const router = require("express").Router();
const axios = require("axios");
app.use(express.json());

const port = 5000; //  port for node Server

//  Create the route

router.route("/:currencycode").get((req, res) => {
  axios
    .get("https://open.er-api.com/v6/latest/INR")
    .then((responce) => {
      //  get the currency Value in INR

      const value = Number(responce.data.rates[req.params.currencycode]);

      axios
        .get("https://api.wazirx.com/sapi/v1/tickers/24hr")
        .then((criptoData) => {
          //  get the bitcoin in INR

          const item = criptoData.data.find((item) => item.symbol === "btcinr");

          //  send the data for bitcoin in that currency.

          res.json({
            baseAsset: "btc",
            quoteAsset: req.params.currencycode,
            openPrice: Number(item.openPrice) * value,
            lowPrice: Number(item.lowPrice) * value,
            highPrice: Number(item.highPrice) * value,
            lastPrice: Number(item.lastPrice) * value,
            volume: Number(item.volume) * value,
            bidPrice: Number(item.bidPrice) * value,
            askPrice: Number(item.askPrice) * value,
          });
        });
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//  routing

app.use("/get", router);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

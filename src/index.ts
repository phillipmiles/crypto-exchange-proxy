import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import ftxApi from './api';
import axios from 'axios';

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/markets/:marketId/candles', async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.API_ENDPOINT}/markets/${req.params.marketId}/candles`,
      {
        params: {
          resolution: req.query.resolution,
          limit: req.query.limit,
          // seconds since 1970-01-01, NOT milliseconds
          start_time: req.query.start_time,
          // seconds since 1970-01-01, NOT milliseconds
          end_time: req.query.end_time,
        },
      },
    );
    res.send(response.data);
  } catch (error) {
    console.log('ERROR');
    console.log(error.response);
    res.status(error.response.status);
    // res.stat
    // res.statusText = error.response.statusText;
    res.send(error.response.data);
  }
});

app.get('/markets', async (req, res) => {
  console.log('do it');
  const response = await ftxApi.getMarkets();
  console.log(response);
  res.send(response);
});

// Filter any signals that contain the words 'high risk' or 'higher risk'

app.get('/signal/performance', async (req, res) => {
  // Use events object []
  // Keep track of last candle timestamp used for calculations.
  // Only recalculate from after that candle. No need to calculate again from the
  // start.
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

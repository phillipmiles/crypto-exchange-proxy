"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./api"));
const axios_1 = __importDefault(require("axios"));
const app = express_1.default();
const port = 3000;
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.get('/markets/:marketId/candles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${process.env.API_ENDPOINT}/markets/${req.params.marketId}/candles`, {
            params: {
                resolution: req.query.resolution,
                limit: req.query.limit,
                // seconds since 1970-01-01, NOT milliseconds
                start_time: req.query.start_time,
                // seconds since 1970-01-01, NOT milliseconds
                end_time: req.query.end_time,
            },
        });
        res.send(response.data);
    }
    catch (error) {
        console.log('ERROR');
        console.log(error.response);
        res.status(error.response.status);
        // res.stat
        // res.statusText = error.response.statusText;
        res.send(error.response.data);
    }
}));
app.get('/markets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('do it');
    const response = yield api_1.default.getMarkets();
    console.log(response);
    res.send(response);
}));
// Filter any signals that contain the words 'high risk' or 'higher risk'
app.get('/signal/performance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Use events object []
    // Keep track of last candle timestamp used for calculations.
    // Only recalculate from after that candle. No need to calculate again from the
    // start.
}));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

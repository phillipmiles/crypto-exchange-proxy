"use strict";
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
const axios_1 = __importDefault(require("axios"));
// XXX Caution. There are issues with extending Error.
// https://stackoverflow.com/questions/41102060/typescript-extending-error-class
class ApiError extends Error {
    constructor(message) {
        // 'Error' breaks prototype chain here
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
// XXXX TODO!!!!!
// I should probably convert what's returned from FTX api calls into
// typed interfaces in each api function below. This way I can ensure that if FTX
// changes/depreciates properties from what's returned it won't fill my app with
// dirt data.
// XXXX TODO!!!!!
const createAxiosError = (axiosError) => {
    console.log(axiosError);
    const error = new ApiError();
    if (!axiosError.response) {
        return error;
    }
    error.code = axiosError.response.status;
    error.codeText = axiosError.response.statusText;
    error.request = axiosError.response.config;
    error.response = axiosError.response.data;
    error.message = axiosError.response.data.error;
    return error;
};
const callApi = (apiCall) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    try {
        response = yield apiCall();
    }
    catch (error) {
        // / XXXX If error code is whatever unauthorised is then
        // reattempt call a few times before throwing error.
        throw createAxiosError(error);
    }
    return response.data.result;
});
// PUBLIC API CALLS
const getHistoricalPrices = (marketId, timeframe) => __awaiter(void 0, void 0, void 0, function* () {
    return callApi(() => axios_1.default.get(`${process.env.API_ENDPOINT}/markets/${marketId}/candles`, {
        params: {
            resolution: timeframe,
            limit: 100,
        },
    }));
});
function getMarkets() {
    return __awaiter(this, void 0, void 0, function* () {
        return callApi(() => axios_1.default.get(`${process.env.API_ENDPOINT}/markets`));
    });
}
function getMarket(marketId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`${process.env.API_ENDPOINT}/markets/${marketId}`);
        return response.data.result;
    });
}
exports.default = {
    getHistoricalPrices,
    getMarkets,
    getMarket,
};

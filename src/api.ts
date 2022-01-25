import axios, { AxiosResponse, AxiosError } from 'axios';
import { Market } from './types';


// XXX Caution. There are issues with extending Error.
// https://stackoverflow.com/questions/41102060/typescript-extending-error-class
class ApiError extends Error {
  code: number | undefined;
  codeText: string | undefined;
  request: unknown;
  response: unknown;

  constructor(message?: string) {
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

const createAxiosError = (axiosError: AxiosError) => {
  console.log(axiosError)
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

const callApi = async (apiCall: () => Promise<AxiosResponse>): Promise<any> => {
  let response;
  try {
    response = await apiCall();
  } catch (error) {
    // / XXXX If error code is whatever unauthorised is then
    // reattempt call a few times before throwing error.
    throw createAxiosError(error);
  }
  return response.data.result;
};

// PUBLIC API CALLS

const getHistoricalPrices = async (marketId: string, timeframe: number) => {
  return callApi(() =>  axios.get(
    `${process.env.API_ENDPOINT}/markets/${marketId}/candles`,
    {
      params: {
        resolution: timeframe,
        limit: 100,
      },
    },
  ));
}

async function getMarkets(): Promise<Market[]> {
  return callApi(() => axios.get(`${process.env.API_ENDPOINT}/markets`));
}

async function getMarket(marketId: string): Promise<Market> {
  const response = await axios.get(
    `${process.env.API_ENDPOINT}/markets/${marketId}`,
  );

  return response.data.result;
}

export default {
  getHistoricalPrices,
  getMarkets,
  getMarket,
  
};

import axios, {AxiosInstance} from 'axios';
import { BaseURL } from './ApiConstants';

class BaseClient {
  static client = (): AxiosInstance => {
    const instance = axios.create({
      baseURL: BaseURL.stage,
    });

    // intercept response
    instance.interceptors.response.use(
      async (response: any) => {
        // log the response
        console.log(
          '%cResponse: ---->',
          'color: ' + '#00ff3b' + 'AF' + '; font-weight: bold',
          {
            header: response.config.headers,
            address: `${response.config.baseURL}${response.config.url}`,
            responseBody: response.data,
          },
        );
        // return the response
        return Promise.resolve(response);
      },
      (error: any) => {
        return Promise.reject(error);
      },
    );

    // intercept request
    instance.interceptors.request.use(
      (config: any) => {
        // log the request
        console.log(
          '%cRequest: ------>',
          'color: ' + '#e100ff' + 'AF' + '; font-weight: bold',
          {
            header: config.headers,
            address: `${config.baseURL}${config.url}`,
            requestBody: config.data,
          },
        );
        // return the request config
        return config;
      },
      function (error: any) {
        return Promise.reject(error);
      },
    );

    return instance;
  };
}

const ClientInstance = BaseClient.client();

export {ClientInstance};

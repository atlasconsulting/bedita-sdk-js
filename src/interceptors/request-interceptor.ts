import { AxiosRequestConfig } from 'axios';
import { BEditaApiClient } from '../bedita-api-client.js';
import { RequestInterceptorInterface } from '../types/interceptor.js';

/**
 * Base class to implement request interceptors.
 */
export default abstract class RequestInterceptor implements RequestInterceptorInterface {

  /**
   * Keep the BEditaApiClient instance.
   */
  protected beditaClient: BEditaApiClient;

  /**
   * Constructor.
   *
   * @param beditaClient The bedita api client
   */
  constructor(beditaClient: BEditaApiClient) {
    this.beditaClient = beditaClient;
  }

  /**
   * @inheritdoc
   */
  public requestHandler(config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> {
    return config;
  }

  /**
   * @inheritdoc
   */
  public errorHandler(error: any): Promise<any> {
    return Promise.reject(error);
  }
}

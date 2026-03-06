import { BEditaApiClient } from '../bedita-api-client';
import { AxiosResponse } from 'axios';
import { ResponseInterceptorInterface } from '../types/interceptor';
import { BEditaClientResponse } from '../types/api';

/**
 * Base class to implement response interceptors.
 */
export default abstract class ResponseInterceptor implements ResponseInterceptorInterface {

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
  public responseHandler(response: AxiosResponse): Promise<BEditaClientResponse<any> | AxiosResponse<any>> {
    return Promise.resolve(response);
  }

  /**
   * @inheritdoc
   */
  public errorHandler(error: any): Promise<any> {
    return Promise.reject(error);
  }
}

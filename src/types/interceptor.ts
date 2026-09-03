import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Interface for a Request interceptor
 */
export interface RequestInterceptorInterface {
  /**
   * The request handler called before the request is sent.
   * Useful for modify request config before it is used for build the request.
   *
   * @param config The request configuration
   */
  requestHandler(config: AxiosRequestConfig):  AxiosRequestConfig | Promise<AxiosRequestConfig>;

  /**
   * The error handler called if something goes wrong before the request was sent.
   *
   * @param error The axios error
   */
  errorHandler(error: any): Promise<any>;
}

/**
 * Interface for a Response interceptor
 */
export interface ResponseInterceptorInterface {
  /**
   * The response handler called on request success.
   * Useful for edit data before return response.
   *
   * @param config The request configuration
   */
  responseHandler(response: AxiosResponse): AxiosResponse<any> | Promise<AxiosResponse<any>>;

  /**
   * The error handler called if something goes wrong.
   *
   * @param error The axios error
   */
  errorHandler(error: any): Promise<any>;
}

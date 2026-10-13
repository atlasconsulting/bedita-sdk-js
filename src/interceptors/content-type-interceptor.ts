import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import RequestInterceptor from './request-interceptor.js';

/**
 * ContentType interceptor.
 * It responsible to add Content-Type to request if it needs.
 */
export default class ContentTypeInterceptor extends RequestInterceptor {

  /**
   * Default Content Type header
   */
  readonly CONTENT_TYPE_HEADER = { 'Content-Type': 'application/json' };

  /**
   * If missing from headers and the request has body then add json content type.
   *
   * @param config The axios request config
   */
  public requestHandler(config: InternalAxiosRequestConfig) {
    if (config.data) {
      config.headers = AxiosHeaders.from({...this.CONTENT_TYPE_HEADER, ...config.headers});
    }

    return Promise.resolve(config);
  }
}

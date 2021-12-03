import { AxiosRequestConfig } from 'axios';
import RequestInterceptor from './request-interceptor';

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
     * @param config
     */
    public requestHandler(config: AxiosRequestConfig) {
        if (config.data) {
            config.headers = {...this.CONTENT_TYPE_HEADER, ...config.headers};
        }

        return Promise.resolve(config);
    }
}

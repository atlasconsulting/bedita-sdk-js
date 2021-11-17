import { AxiosRequestConfig } from 'axios';
import RequestInterceptor from './request-interceptor';

/**
 * Auth interceptor.
 * It responsible to add Authorization header if it needs.
 */
export default class AuthInterceptor extends RequestInterceptor {

    /**
     * If present it adds access token to Authorization header.
     *
     * @param config
     */
    public requestHandler(config: AxiosRequestConfig) {
        const accessToken = this.beditaClient.getStorageService().accessToken;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    }
}

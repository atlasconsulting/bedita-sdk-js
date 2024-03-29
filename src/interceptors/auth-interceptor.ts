import { AxiosRequestConfig } from 'axios';
import { GrantType } from '../bedita-api-client';
import RequestInterceptor from './request-interceptor';

/**
 * Auth interceptor.
 * It responsible to add Authorization header if it needs.
 */
export default class AuthInterceptor extends RequestInterceptor {

    /**
     * If present it adds access token to Authorization header.
     *
     * @param config The axios request config
     */
    public async requestHandler(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        config = await this.setAuthorizationHeader(config);

        // Authorization header set so go ahead
        if (config.headers?.Authorization) {
            return config;
        }

        // trying client credentials auth so go ahead
        if (config.url === '/auth' && config.data?.grant_type === GrantType.ClientCredentials) {
            return config;
        }

        if (!this.beditaClient.getConfig('clientId')) {
            return config;
        }

        await this.beditaClient.clientCredentials();

        return await this.setAuthorizationHeader(config);
    }

    /**
     * Set Authorization header if not already set and access token is present.
     *
     * @param config The axios request config
     */
    protected async setAuthorizationHeader(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        const accessToken = await this.beditaClient.getStorageService().getAccessToken();
        if (accessToken && !config.headers?.Authorization) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    }
}

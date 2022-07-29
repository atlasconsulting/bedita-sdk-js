import ResponseInterceptor from './response-interceptor'
import { AxiosResponse } from 'axios';

/**
 * If access token is not valid try to renew authentication
 * and retry the previous call.
 */
export default class RefreshAuthInterceptor extends ResponseInterceptor {

    /**
     * If the error is 401 for token expired try to renew tokens re-send the original request.
     *
     * @param error The original error.
     */
    public async errorHandler(error: any): Promise<any> {
        if (!error.response || !this.isTokenExpired(error.response)) {
            // Not an expired token's fault.
            if (error.response?.status === 401) { // if 401 clear tokens
                const storage = this.beditaClient.getStorageService();
                await storage.clearTokens();
                await storage.remove('user');
            }

            return Promise.reject(error);
        }

        await this.beditaClient.renewTokens();
        delete error.config.headers.Authorization;

        return await this.beditaClient.request(error.config);
    }

    /**
     * Return `true` if it's a token expired response error.
     *
     * @param response The response
     */
    protected isTokenExpired(response: AxiosResponse): boolean {
        const code = response.data && response.data.error && response.data.error.code;

        return response.status === 401 && code === 'be_token_expired';
    }
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse }  from 'axios';
import AuthInterceptor from './interceptors/auth-interceptor';
import StorageService from './services/storage-service';

/**
 * Interface for API client configuration.
 *
 * - baseUrl: the BEdita API base URL
 * - apiKey: the API KEY to use (optional)
 * - name: the name of the client instance (optional, default 'bedita')
 */
export interface ApiClientConfig {
    baseUrl: string,
    apiKey?: string,
    name?: string,
}

/**
 * Interface for a successfully API response body.
 */
export interface ApiResponseBodyOk {
    data: { [s: string]: any },
    meta: { [s: string]: any },
    links?: { [s: string]: any },
    included?: { [s: string]: any }[],
}

/**
 * Interface for a errored API response body.
 */
export interface ApiResponseBodyError {
    error: { [s: string]: any },
    links?: { [s: string]: any },
    meta?: { [s: string]: any },
}

/**
 * BEdita API client.
 */
export class BEditaApiClient {

    /**
     * The Api client configuration.
     */
    #config: ApiClientConfig;

    /**
     * Keep The axios instance.
     */
    #axiosInstance: AxiosInstance;

    /**
     * Keep the token service instance.
     */
    #storageService: StorageService;

    /**
     * Constructor.
     *
     * @param config The configuration for the API client
     */
    constructor(config: ApiClientConfig) {
        if (!config.name) {
            config.name = 'bedita';
        }
        this.#config = config;

        const axiosConfig: AxiosRequestConfig = {
            baseURL: config.baseUrl,
            headers: {
                Accept: 'application/vnd.api+json',
            },
        };

        if (config.apiKey) {
            axiosConfig.headers['X-Api-Key'] = config.apiKey;
        }

        this.#axiosInstance = axios.create(axiosConfig);
        this.#storageService = new StorageService(config.name);

        this.addDefaultInterceptors();
    }

    /**
     * Return the client configuration.
     * If key is specified return only the value related.
     */
    public getConfig(key?: string): ApiClientConfig | any {
        if (key) {
            return this.#config[key];
        }

        return this.#config;
    }

    /**
     * Add default interceptors.
     */
    protected addDefaultInterceptors(): void {
        const authInterceptor = new AuthInterceptor(this);
        this.#axiosInstance.interceptors.request.use(authInterceptor.requestHandler.bind(authInterceptor));
    }

    /**
     * Return the Axios instance.
     */
    public getHttpClient(): AxiosInstance {
        return this.#axiosInstance;
    }

    /**
     * Return the token service.
     */
    public getStorageService(): StorageService {
        return this.#storageService;
    }

    /**
     * Proxy to axios GET
     *
     * @param url The endpoint URL path to invoke
     * @param config Request configuration
     */
    public get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.#axiosInstance.get(url, config);
    }

    /**
     * Proxy to axios POST
     *
     * @param url The endpoint URL path to invoke
     * @param data Payload to send
     * @param config Request configuration
     */
    public post(url: string, data?: { [s: string]: any }, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.#axiosInstance.post(url, data, config);
    }

    /**
     * Proxy to axios PATCH
     *
     * @param url The endpoint URL path to invoke
     * @param data Payload to send
     * @param config Request configuration
     */
    public patch(url: string, data?: { [s: string]: any }, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.#axiosInstance.patch(url, data, config);
    }

    /**
     * Proxy to axios DELETE
     *
     * @param url The endpoint URL path to invoke
     * @param data Payload to send
     * @param config Request configuration
     */
    public delete(url: string, data?: { [s: string]: any }, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        if (data) {
            config.data = data;
        }

        return this.#axiosInstance.delete(url, config);
    }

    /**
     * Authenticate a user, saving in storage access and refresh token.
     *
     * @param username The username
     * @param password The password
     */
    public async authenticate(username: string, password: string): Promise<AxiosResponse<any> | string> {
        const data = { username, password };
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const response = await this.post('/auth', data, config);
        const tokens = response.data.meta || {};
        if (!tokens.jwt || !tokens.renew) {
            return Promise.reject('Something was wrong with response data.');
        }
        this.#storageService.accessToken = tokens.jwt;
        this.#storageService.refreshToken = tokens.renew;

        return response;
    }

    /**
     * Get the authenticated user.
     */
    public async getUserAuth(): Promise<{data: { [s: string]: any; }, roles: any[]}> {
        const response = await this.get('/auth/user');
        const responseData: ApiResponseBodyOk = response.data;
        const { data, included = false } = responseData;
        let roles = [];
        if (Array.isArray(included)) {
            roles = included.filter(item => item.type === 'roles')
                .map(item => item.name);
        }

        const user = {data, roles};
        this.#storageService.set('user', JSON.stringify(user));

        return user;
    }
}

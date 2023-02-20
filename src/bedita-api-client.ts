import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse }  from 'axios';
import AuthInterceptor from './interceptors/auth-interceptor';
import RefreshAuthInterceptor from './interceptors/refresh-auth-interceptor';
import StorageService from './services/storage-service';
import FormatUserInterceptor from './interceptors/format-user.interceptor';
import ContentTypeInterceptor from './interceptors/content-type-interceptor';
import { RequestInterceptorInterface } from './interceptors/request-interceptor';
import { ResponseInterceptorInterface } from './interceptors/response-interceptor';
import { MapIncludedInterceptor } from './interceptors/map-included-interceptor';
import StorageAdapterInterface from './services/adapters/storage-adapter-interface';
import LocalStorageAdapter from './services/adapters/local-storage-adapter';

/**
 * Interface for API client configuration.
 *
 * - baseUrl: the BEdita API base URL
 * - apiKey: the API KEY to use (optional). Deprecated, you are encouraged to use `clientId` and `clientSecret` instead.
 * - name: the name of the client instance (optional, default 'bedita')
 * - clientId: the client id used for client credentials flow (optional)
 * - clientSecret: the client secret used for client credentials flow (optional)
 * - storageAdapter: the adapter used by storage service
 */
export interface ApiClientConfig {
    baseUrl: string,
    apiKey?: string,
    name?: string,
    clientId?: string,
    clientSecret?: string,
    storageAdapter?: StorageAdapterInterface,
}

/**
 * Interface of JSON API resource object
 *
 * see https://jsonapi.org/format/#document-resource-objects
 */
export interface JsonApiResourceObject {
    type: string,
    id?: string,
    attributes?: { [s: string]: any },
    relationships?:  { [s: string]: any },
    links?: { [s: string]: any },
    meta?:  { [s: string]: any },
}

/**
 * Interface for a successfully API response body.
 */
export interface ApiResponseBodyOk {
    data: JsonApiResourceObject | JsonApiResourceObject[],
    meta: { [s: string]: any },
    links?: { [s: string]: any },
    included?: JsonApiResourceObject[],
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
 * Interface for configuration used for BEdita API requests.
 * Extends AxiosRequestConfig adding configuration for
 * dynamic uses of request and response interceptors.
 */
export interface BEditaClientRequestConfig extends AxiosRequestConfig {
    requestInterceptors?: RequestInterceptorInterface[],
    responseInterceptors?: ResponseInterceptorInterface[],
}

/**
 * Interface of BEdita client response.
 * It extends AxiosResponse adding an optional `formatData`
 * that can be used to store fromatted data.
 */
export interface BEditaClientResponse<T = any> extends AxiosResponse {
    formattedData?: T;
}

/**
 * String enums for grant types.
 */
export enum GrantType {
    Password = 'password',
    ClientCredentials = 'client_credentials',
    RefreshToken = 'refresh_token',
}

/**
 * String enums for upload resource types.
 */
export enum UploadResourceType {
    streams = 'streams',
    images = 'images',
    audio = 'audio',
    video = 'videos',
    files = 'files',
}

/**
 * Interface describing data used for auth action.
 */
export interface AuthData {
    username?: string,
    password?: string,
    client_id?: string,
    client_secret?: string,
    [s: string]: any,
    grant_type: GrantType | string,
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
     * Map of request interceptors added to avoid double addition.
     *
     * The values are the interceptor contructor names
     * and the keys are the corresponding index in Axios.
     */
    #requestInterceptorsMap: Map<string, number> = new Map();

    /**
     * Map of response interceptors added to avoid double addition.
     *
     * The values are the interceptor contructor names
     * and the keys are the corresponding index in Axios.
     */
    #responseInterceptorsMap: Map<string, number> = new Map();

    /**
     * Constructor.
     *
     * @param config The configuration for the API client
     */
    constructor(config: ApiClientConfig) {
        if (!config.name) {
            config.name = 'bedita';
        }

        const axiosConfig: AxiosRequestConfig = {
            baseURL: config.baseUrl,
            headers: {
                Accept: 'application/vnd.api+json',
            },
        };

        if (config.clientId) {
            delete config.apiKey; // remove deprecated API key
        }

        if (config.apiKey) {
            axiosConfig.headers['X-Api-Key'] = config.apiKey;
        }

        this.#config = { ...config };
        this.#axiosInstance = axios.create(axiosConfig);
        const storageAdapter = config?.storageAdapter || new LocalStorageAdapter();
        this.#storageService = new StorageService(config.name, storageAdapter);

        this.addDefaultInterceptors();
    }

    /**
     * Return the client configuration.
     * If key is specified return only the value related.
     */
    public getConfig(key?: string): ApiClientConfig | any {
        if (key) {
            return this.#config?.[key] || null;
        }

        return this.#config;
    }

    /**
     * Add default interceptors.
     */
    protected addDefaultInterceptors(): void {
        this.addInterceptor(new AuthInterceptor(this));
        this.addInterceptor(new ContentTypeInterceptor(this));
        this.addInterceptor(new RefreshAuthInterceptor(this));
    }

    /**
     * Add an interceptor to the axios instance.
     *
     * @param interceptor The interceptor instance
     */
    public addInterceptor(interceptor: RequestInterceptorInterface | ResponseInterceptorInterface): number {
        const name = interceptor.constructor.name;
        if ('requestHandler' in interceptor) {
            if (this.#requestInterceptorsMap.has(name)) {
                return this.#requestInterceptorsMap.get(name);
            }

            const idx = this.#axiosInstance.interceptors.request.use(
                interceptor.requestHandler.bind(interceptor),
                interceptor.errorHandler.bind(interceptor)
            );
            this.#requestInterceptorsMap.set(name, idx);

            return idx;
        }

        if (this.#responseInterceptorsMap.has(name)) {
            return this.#responseInterceptorsMap.get(name);
        }

        const index = this.#axiosInstance.interceptors.response.use(
            interceptor.responseHandler.bind(interceptor),
            interceptor.errorHandler.bind(interceptor)
        );
        this.#responseInterceptorsMap.set(name, index);

        return index;
    }

    /**
     * Say if interceptor is already present.
     *
     * @param interceptor The interceptor instance
     */
    public hasInterceptor(interceptor: RequestInterceptorInterface | ResponseInterceptorInterface): boolean {
        const name = interceptor.constructor.name;
        if ('requestHandler' in interceptor) {
            return this.#requestInterceptorsMap.has(name);
        }

        return this.#responseInterceptorsMap.has(name);
    }

    /**
     * Remove an interceptor from axios instance.
     *
     * @param id The interceptor id
     * @param type The interceptor type
     */
    public removeInterceptor(id: number, type: 'request' | 'response'): void {
        if (type === 'request') {
            for (const item of this.#requestInterceptorsMap) {
                if (item[1] === id) {
                    this.#requestInterceptorsMap.delete(item[0]);
                    break;
                }
            }

            return this.#axiosInstance.interceptors.request.eject(id);
        }

        for (const item of this.#responseInterceptorsMap) {
            if (item[1] === id) {
                this.#responseInterceptorsMap.delete(item[0]);
                break;
            }
        }

        this.#axiosInstance.interceptors.response.eject(id);
    }

    /**
     * Return the request interceptors map
     */
    public getRequestInterceptorsMap(): Map<string, number>
    {
        return this.#requestInterceptorsMap;
    }

    /**
     * Return the response interceptors map
     */
    public getResponseInterceptorsMap(): Map<string, number>
    {
        return this.#responseInterceptorsMap;
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
     * Proxy to axios generic request.
     * It assure to resolve the Promise with a BEditaClientResponse.
     *
     * @param config Request configuration
     */
    public async request(config: BEditaClientRequestConfig): Promise<BEditaClientResponse<any>> {
        const reqIntercetorsIds = [], respInterceptorsIds = [];
        if (config.requestInterceptors) {
            config.requestInterceptors.forEach(interceptorInstance => {
                if (!this.hasInterceptor(interceptorInstance)) {
                    reqIntercetorsIds.push(this.addInterceptor(interceptorInstance));
                }
            });

            delete config.requestInterceptors;
        }

        if (config.responseInterceptors) {
            config.responseInterceptors.forEach(interceptorInstance => {
                if (!this.hasInterceptor(interceptorInstance)) {
                    respInterceptorsIds.push(this.addInterceptor(interceptorInstance));
                }
            });

            delete config.responseInterceptors;
        }
        const response = await this.#axiosInstance.request(config);

        reqIntercetorsIds.forEach(id => this.removeInterceptor(id, 'request'));
        respInterceptorsIds.forEach(id => this.removeInterceptor(id, 'response'));

        return response as BEditaClientResponse;
    }

    /**
     * Send a GET request.
     *
     * @param url The endpoint URL path to invoke
     * @param config Request configuration
     */
    public get(url: string, config?: BEditaClientRequestConfig): Promise<BEditaClientResponse<any>> {
        config = config || {}
        config.method = 'get';
        config.url = url;

        return this.request(config);
    }

    /**
     * Send a POST request.
     *
     * @param url The endpoint URL path to invoke
     * @param data Payload to send
     * @param config Request configuration
     */
    public post(url: string, data?: any, config?: BEditaClientRequestConfig): Promise<BEditaClientResponse<any>> {
        config = config || {}
        config.method = 'post';
        config.url = url;
        config.data = data || null;

        return this.request(config);
    }

    /**
     * Send a PATCH request.
     *
     * @param url The endpoint URL path to invoke
     * @param data Payload to send
     * @param config Request configuration
     */
    public patch(url: string, data?: any, config?: BEditaClientRequestConfig): Promise<BEditaClientResponse<any>> {
        config = config || {}
        config.method = 'patch';
        config.url = url;
        config.data = data || null;

        return this.request(config);
    }

    /**
     * Send a DELETE request.
     *
     * @param url The endpoint URL path to invoke
     * @param data Payload to send
     * @param config Request configuration
     */
    public delete(url: string, data?: any, config?: BEditaClientRequestConfig): Promise<BEditaClientResponse<any>> {
        config = config || {}
        config.method = 'delete';
        config.url = url;
        config.data = data || null;

        return this.request(config);
    }

    /**
     * Authenticate a user, saving in storage access and refresh token.
     *
     * @param username The username
     * @param password The password
     */
    public async authenticate(username: string, password: string): Promise<BEditaClientResponse<any>> {
        if (this.getConfig('apiKey')) {
            await this.#storageService.clearTokens();
        }
        await this.#storageService.remove('user');
        const data: AuthData = { username, password, grant_type: GrantType.Password };

        return await this.auth(data);
    }

    /**
     * Execute an auth request.
     *
     * @param data The auth data
     * @param config Additional request configuration
     */
    protected async auth(data: AuthData, config?: BEditaClientRequestConfig): Promise<BEditaClientResponse<any>> {
        const response = await this.post('/auth', data, config);
        const tokens = response.data && response.data.meta || {};
        if (!tokens.jwt || !tokens.renew) {
            return Promise.reject('Something was wrong with response data.');
        }
        await this.#storageService.setAccessToken(tokens.jwt);
        await this.#storageService.setRefreshToken(tokens.renew);

        return response;
    }

    /**
     * Client credentials auth.
     */
    public async clientCredentials(): Promise<BEditaClientResponse<any>> {
        const data: AuthData = {
            client_id: this.getConfig('clientId'),
            client_secret: this.getConfig('clientSecret'),
            grant_type: GrantType.ClientCredentials,
        };

        return await this.auth(data);
    }

    /**
     * Get the authenticated user and store it.
     * Format user data using `FormatUserInterceptor`.
     * If `include` is passed than `MapIncludedInterceptor` will be used too
     * to put related objects inside the relative relationship key.
     *
     * @param include A list of relationships to include
     */
    public async getUserAuth(include?: Array<string>): Promise<BEditaClientResponse<any>> {
        const responseInterceptors: Array<ResponseInterceptorInterface> = [new FormatUserInterceptor(this)];
        const params: any = {};
        if (include && include.length > 0) {
            responseInterceptors.unshift(new MapIncludedInterceptor());
            params.include = include.join(',');
        }

        const response = await this.get('/auth/user', {
            params,
            responseInterceptors,
        });

        await this.#storageService.set('user', JSON.stringify(response.formattedData));

        return response;
    }

    /**
     * Renew access and refresh tokens.
     */
    public async renewTokens(): Promise<BEditaClientResponse<any>> {
        const refreshToken = await this.#storageService.getRefreshToken();
        if (!refreshToken) {
            return Promise.reject('Missing refresh token.');
        }

        const config = {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        };

        try {
            return await this.auth({ grant_type: GrantType.RefreshToken }, config);
        } catch (error) {
            await this.#storageService.clearTokens();
            await this.#storageService.remove('user');
            throw error;
        }
    }

    /**
     * Save a resource.
     * If data contains `id` then it create new one resource
     * else it update existing resource.
     *
     * @param type The resource type
     * @param data The data to save
     */
    public async save(type: string, data: {[s: string]: any}): Promise<BEditaClientResponse> {
        if (!type) {
            throw new Error('Missing required type');
        }

        const body: {data: JsonApiResourceObject} = { data: {type} };
        const id: string|null = data?.id;
        if (id) {
            body.data.id = id;
        }
        delete data.id;
        body.data.attributes = data;

        if (id) {
            return await this.patch(`${type}/${id}`, body);
        }

        return await this.post(`${type}`, body);
    }

    /**
     * Upload file creating the resource specified by type.
     * If no file name is passed then it tries to get it from File object.
     *
     * @param file File|Blob to upload
     * @param type The resource type (streams, images, videos, files, audio)
     * @param name The file name
     * @param config Optional request configuration
     */
    public async upload(file: File|Blob, type: UploadResourceType, name?: string, config?: BEditaClientRequestConfig): Promise<BEditaClientResponse> {
        name = encodeURIComponent(name || file?.name || Date.now());
        config = { ...{ headers: {} }, ...config };
        config.headers['Content-Type'] = file.type;

        return await this.post(`/${type}/upload/${name}`, await file.arrayBuffer(), config);
    }
}

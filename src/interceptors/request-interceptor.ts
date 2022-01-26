import { AxiosRequestConfig } from 'axios';
import { BEditaApiClient } from '../bedita-api-client';

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

import { BEditaApiClient, BEditaClientResponse } from '../bedita-api-client';
import { AxiosResponse } from 'axios';

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

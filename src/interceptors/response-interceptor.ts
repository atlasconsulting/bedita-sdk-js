import { BEditaApiClient } from '../bedita-api-client';
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
    errorHandler(error: any): any;
}

/**
 * Base class useful to implments a request interceptor.
 */
export default abstract class ResponseInterceptor implements ResponseInterceptorInterface {

    /**
     * Keep the BEditaApiClient instance.
     */
    protected beditaClient: BEditaApiClient;

    /**
     * Constructor.
     *
     * @param axiosInstance
     */
    constructor(beditaClient: BEditaApiClient) {
        this.beditaClient = beditaClient;
    }

    /**
     * @inheritdoc
     */
    public responseHandler(response: AxiosResponse): AxiosResponse<any> | Promise<AxiosResponse<any>> {
        return response;
    }

    /**
     * @inheritdoc
     */
    public errorHandler(error: any): any {
        return Promise.reject(error);
    }
}

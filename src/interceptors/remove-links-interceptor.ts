import { AxiosResponse } from 'axios';
import { ResponseInterceptorInterface } from './response-interceptor';
import { BEditaClientResponse, JsonApiResourceObject } from '../bedita-api-client';


/**
 * Remove links attribute from JSON API response.
 */
export default class RemoveLinksInterceptor implements ResponseInterceptorInterface  {

    /**
     * Remove links from JSON API response.
     *
     * @param response The response.
     */
    public responseHandler(response: AxiosResponse): Promise<BEditaClientResponse<any> | AxiosResponse<any>> {
        if (!response.data) {
            return Promise.resolve(response);
        }

        delete response.data?.links;
        delete response.data?.meta?.schema;
        if (!response.data?.data || (!Array.isArray(response.data.data) && response.data.data.constructor !== Object)) {
            return Promise.resolve(response);
        }

        response.data.data = this.removeLinks(response.data.data);
        if (response.data?.included) {
            response.data.included = this.removeLinks(response.data.included);
        }

        return Promise.resolve(response);
    }

    /**
     * Remove links from JSON API resource object.
     *
     * @param data The resource object.
     */
    protected removeLinks(data: JsonApiResourceObject|JsonApiResourceObject[]): JsonApiResourceObject|JsonApiResourceObject[] {
        if (Array.isArray(data)) {
            return data.map((d) => this.removeLinks(d)) as JsonApiResourceObject[];
        }

        delete data?.links;

        Object.keys(data?.relationships || []).forEach((rel) => {
            delete data?.relationships[rel]?.links;
        });

        return data;
    }

    /**
     * @inheritdoc
     */
    public errorHandler(error: any): Promise<any> {
        return Promise.reject(error);
    }
}

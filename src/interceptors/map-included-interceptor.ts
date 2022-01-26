import { ResponseInterceptorInterface } from './response-interceptor';
import { AxiosResponse } from 'axios';
import { ApiResponseBodyOk, BEditaClientResponse, JsonApiResourceObject } from '../bedita-api-client';

/**
 * Formatter interceptor for mapping include data inside the related object data
 */
export default class MapIncludedInterceptor implements ResponseInterceptorInterface {

    /**
     * When response has included data format the response data as
     *
     * ```
     * {
     *     "data": {
     *          "id": "123",
     *          "type": "resource-one",
     *          "attributes": {},
     *          "relationships": {
     *              "rel_one": [
     *                  {
     *                      "id": "234",
     *                      "type": "resource-two",
     *                      "attributes": {},
     *                      ...
     *                  },
     *                  ...
     *              ],
     *              "rel_two": [],
     *              ...
     *          }
     *      }
     * }
     * ```
     *
     * It works also when `data` is an array of resources.
     *
     * @param response The response.
     */
    public responseHandler(response: AxiosResponse): Promise<BEditaClientResponse<any>> {
        const responseData: ApiResponseBodyOk = response.data;
        let { data } = responseData;
        const { included = false } = responseData;

        if (included !== false && included.length > 0) {
            data = this.prepareData(data, included);
        }

        const beditaResponse = response as BEditaClientResponse;
        beditaResponse.formattedData = {data};

        return Promise.resolve(beditaResponse);
    }

    /**
     * @inheritdoc
     */
    public errorHandler(error: any): Promise<any> {
        return Promise.reject(error);
    }

    /**
     * Prepare data mapping the resource inside included array
     * in the relative relation inside relationships object.
     *
     * @param data The starting data
     * @param included The included resources
     */
    protected prepareData(data: JsonApiResourceObject | JsonApiResourceObject[], included: JsonApiResourceObject[]) {
        if (!Array.isArray(data)) {
            return this.mapIncluded(data, included);
        }

        return data.map(d => this.mapIncluded(d, included));
    }

    /**
     * For every relationships it maps the related included resource data in relationships itself.
     *
     * @param data The Json API resource obejct
     * @param included The included data
     */
    protected mapIncluded(data: JsonApiResourceObject, included: Array<JsonApiResourceObject>): JsonApiResourceObject {
        const relationships = data?.relationships || {};

        Object.keys(relationships).forEach((rel) => {
            let d: Array<JsonApiResourceObject> = relationships[rel]?.data || [];
            if (d.length > 0) {
                d = d.map(dItem => included.find(includedItem => includedItem.id === dItem.id));
            }

            relationships[rel] = d;
        });

        data.relationships = relationships;

        return data;
    }
}

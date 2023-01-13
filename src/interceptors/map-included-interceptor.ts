import { ResponseInterceptorInterface } from './response-interceptor';
import { AxiosResponse } from 'axios';
import { ApiResponseBodyOk, BEditaClientResponse, JsonApiResourceObject } from '../bedita-api-client';

/**
 * Interface for MapIncludedInterceptor configuration.
 *
 * - replaceWithTranslation: translation language (replace main objects fields with translated fields if not empty)
 */
export interface MapIncludedConfig {
    replaceWithTranslation?: string,
}

/**
 * Formatter interceptor for mapping include data inside the related object data
 */
export class MapIncludedInterceptor implements ResponseInterceptorInterface {

    /**
     * Interceptor configuration
     */
    #config: MapIncludedConfig;

    /**
     * Constructor.
     *
     * @param config The configuration for the interceptor.
     */
    public constructor(config: MapIncludedConfig = {}) {
        this.setConfig(config);
    }

    /**
     * Set configuration.
     *
     * @param config The config data.
     * @param merge If config should be merged or not
     */
    public setConfig(config: MapIncludedConfig, merge = true): void {
        if (!merge) {
            this.#config = config;

            return;
        }

        this.#config = { ...this.#config, ...config };
    }

    /**
     * Get the interceptor configuration.
     */
    public getConfig(): MapIncludedConfig {
        return this.#config;
    }

    /**
     * When response has included data they are formatted as
     *
     * ```
     * {
     *     "data": {
     *          "id": "123",
     *          "type": "resource-one",
     *          "attributes": {},
     *          "relationships": {
     *              "rel_one": {
     *                  "data": [
     *                      {
     *                          "id": "234",
     *                          "type": "resource-two",
     *                          "attributes": {},
     *                          ...
     *                      },
     *                      ...
     *                  ],
     *              },
     *              "rel_two": {},
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
                d = d.map(dItem => {
                    const includedData = included.find(includedItem => includedItem.id === dItem.id);
                    if (rel === 'translations' && includedData.attributes?.lang === this.#config?.replaceWithTranslation) {
                        data.attributes = { ...data.attributes, ...this.extractTranslatedFields(includedData) };
                    }

                    return includedData;
                });
            }

            relationships[rel].data = d;
        });

        data.relationships = relationships;

        return data;
    }

    /**
     * Extract `translated_fields` removing empty values.
     *
     * @param data The data to analyse
     * @returns
     */
    protected extractTranslatedFields(data: JsonApiResourceObject) {
        const translatedFields = { ...data?.attributes?.translated_fields || {} };
        Object.keys(translatedFields).forEach(key => {
            if (!translatedFields[key] || translatedFields[key] === '') {
                delete translatedFields[key];
            }
        });

        return translatedFields;
    }
}

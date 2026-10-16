import { ResponseInterceptorInterface } from '../types/interceptor.js';
import { AxiosResponse } from 'axios';
import { BEditaClientResponse, JsonApiResourceObject, JsonApiResourceFlat } from '../types/api.js';
import { flattenJsonApiResource, isJsonApiResourceObject } from '../api-helpers.js';

/**
 * Interface for MapIncludedInterceptor configuration.
 *
 * - replaceWithTranslation: translation language (replace main objects fields with translated fields if not empty)
 * - flatten: flatten all objects merging attributes, meta and relationships at root level
 */
export interface MapIncludedConfig {
  replaceWithTranslation?: string,
  flatten?: boolean,
}

/**
 * Formatter interceptor for mapping include data inside the related object data
 */
export class MapIncludedInterceptor implements ResponseInterceptorInterface {

  /**
   * Interceptor configuration
   */
  #config: MapIncludedConfig = {};

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
    if (!response.data?.data) {
      return Promise.resolve(response);
    }

    const responseData = response.data;
    let { data } = responseData;
    const { included = false } = responseData;

    if (included !== false && included.length > 0) {
      data = this.prepareData(data, included);
    }

    if (this.#config?.flatten || response.config?.interceptorOptions?.MapIncludedInterceptor?.flatten) {
      data = this.flattenData(data);
    }

    const beditaResponse = response as BEditaClientResponse;
    beditaResponse.formattedData = { data };

    return Promise.resolve(beditaResponse);
  }

  /**
   * @inheritdoc
   */
  public errorHandler(error: any): Promise<any> {
    return Promise.reject(error);
  }

  /**
   * Flatten the given data if it is a JSON API resource object or an array of such objects.
   *
   * @param data The data to flatten
   */
  protected flattenData(data: JsonApiResourceObject | JsonApiResourceObject[] | unknown): JsonApiResourceFlat | JsonApiResourceFlat[] | unknown {
    if (Array.isArray(data)) {
      return data.map(d => isJsonApiResourceObject(d, { id: true }) ? flattenJsonApiResource(d) : d);
    }

    return isJsonApiResourceObject(data, { id: true }) ? flattenJsonApiResource(data) : data;
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
          if (rel === 'translations' && includedData && includedData.attributes?.lang === this.#config?.replaceWithTranslation) {
            data.attributes = { ...data.attributes, ...this.extractTranslatedFields(includedData) };
          }

          return includedData || dItem;
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

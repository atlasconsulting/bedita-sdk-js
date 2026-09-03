import { AxiosRequestConfig, AxiosResponse } from "axios";
import { RequestInterceptorInterface, ResponseInterceptorInterface } from "./interceptor.js";
import { StorageAdapterInterface } from "./service.js";

/**
 * Interface of JSON API resource object
 *
 * see https://jsonapi.org/format/#document-resource-objects
 */
export interface JsonApiResourceObject<T extends string = string> {
  type: T,
  id?: string,
  attributes?: { [s: string]: any },
  relationships?:  { [s: string]: any },
  links?: { [s: string]: any },
  meta?:  { [s: string]: any },
}

/**
 * Interface of flattened JSON API resource object
 */
export interface JsonApiResourceFlat<T extends string = string> {
  id: string;
  type: T;
  [key: string]: unknown;
  _attributes: string[];
  _relationships: string[];
  _meta: string[];
}

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
 * that can be used to store formatted data.
 */
export interface BEditaClientResponse<T = unknown> extends AxiosResponse {
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

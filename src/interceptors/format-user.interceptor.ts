import ResponseInterceptor from './response-interceptor';
import { AxiosResponse } from 'axios';
import { ApiResponseBodyOk, BEditaClientResponse } from '../bedita-api-client';

/**
 * Formatter interceptor for user data.
 */
export default class FormatUserInterceptor extends ResponseInterceptor {

    /**
     * Format user data as
     * ```
     * {
     *     "data": {}, // user attributes
     *     "roles": [], // array of user's roles
     * }
     * ```
     *
     * @param response The response.
     */
    public responseHandler(response: AxiosResponse): Promise<BEditaClientResponse<any>> {
        const responseData: ApiResponseBodyOk = response.data;
        const { data, included = false } = responseData;
        let roles = [];
        if (Array.isArray(included)) {
            roles = included.filter(item => item.type === 'roles')
                .map(item => item.attributes.name);
        }

        const beditaResponse = response as BEditaClientResponse;
        beditaResponse.formattedData = {data, roles};

        return Promise.resolve(beditaResponse);
    }
}

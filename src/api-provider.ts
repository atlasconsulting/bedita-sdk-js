import { BEditaApiClient, ApiClientConfig } from './bedita-api-client';

/**
 * ApiProvider is responsible to create a `BEditaApiClient` and return the instance.
 *
 */
export default class ApiProvider {

    /**
     * A map of clients created.
     */
    static #registry: { [s: string]: BEditaApiClient } = {};

    /**
     * Get an API client already created or try to create new one.
     * If a client registered with `name` is found then returns it.
     *
     * @param name The name to use for register the API client
     * @param config The configuration to use for create new client.
     */
    public static get(name: string, config?: ApiClientConfig): BEditaApiClient {
        if (this.has(name)) {
            return this.#registry[name];
        }

        if (!config || !config.baseUrl) {
            throw new Error('Missing required API configuration');
        }

        config.name = name;
        this.#registry[name] = new BEditaApiClient(config);

        return this.#registry[name];
    }

    /**
     * Return `true` if an API client with that `name` is in the registry.
     *
     * @param name  The name of registered API client
     */
    public static has(name: string): boolean {
        if (this.#registry[name]) {
            return true;
        }

        return false;
    }

    /**
     * Remove an API client istance from the registry.
     *
     * @param name The name to look for in the registry
     */
    public static remove(name: string): void {
        if (!this.#registry[name]) {
            return;
        }

        delete this.#registry[name];
    }
}

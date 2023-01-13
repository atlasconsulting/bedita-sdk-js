import StorageAdapterInterface from "./adapters/storage-adapter-interface";

/**
 * Storage service class.
 * Help to read/write/remove tokens as access_token and refresh_token.
 */
export default class StorageService {

    /**
     * The storage name. Used to prefix localStorage var
     */
    #name: string;

    /**
     * The storage adapter.
     */
    #adapter: StorageAdapterInterface;

    /**
     * Key namespace seprator.
     * For example with `#name` 'bedita' the key 'access_token' become `bedita.access_token`.
     */
    #namespaceSeparator = '.';

    /**
     * The access token key
     */
    readonly ACCESS_TOKEN_KEY: string = 'access_token';

    /**
     * The refresh token key
     */
    readonly REFRESH_TOKEN_KEY: string = 'refresh_token';

    /**
     * Constructor.
     * It sets the access token and refresh token keys.
     *
     * @param name The name used as prefix for store in localStorage
     * @param adapter The storage adapter
     */
    public constructor(name = 'bedita', adapter: StorageAdapterInterface) {
        this.#name = name;
        this.#adapter = adapter;
    }

    /**
     * Get access token.
     */
    public getAccessToken(): Promise<string|null> {
        return this.get(this.ACCESS_TOKEN_KEY);
    }

    /**
     * Set access token.
     *
     * @param value access token value.
     */
    public setAccessToken(value: string): Promise<any> {
        return this.set(this.ACCESS_TOKEN_KEY, value);
    }

    /**
     * Get refresh token.
     */
    public getRefreshToken(): Promise<string|null> {
        return this.get(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Set refresh token.
     *
     * @param value refresh token value.
     */
    public setRefreshToken(value: string): Promise<any> {
        return this.set(this.REFRESH_TOKEN_KEY, value);
    }

    /**
     * Remove all tokens.
     */
    public async clearTokens(): Promise<any> {
        await this.remove(this.ACCESS_TOKEN_KEY);
        await this.remove(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Set the namespace separator.
     *
     * @param separator The namespace separator to use
     */
    public setNamespaceSeparator(separator: string): void
    {
        this.#namespaceSeparator = separator;
    }

    /**
     * Get namespaced key.
     *
     * @param key The key.
     */
    protected getNamespacedKey(key: string): string {
        return `${this.#name}${this.#namespaceSeparator}${key}`;
    }

    /**
     * Get the storaged value.
     */
    public get(key: string): Promise<any> {
        return this.#adapter.get(this.getNamespacedKey(key));
    }

    /**
     * Set a value in the storage.
     *
     * @param key The starage key
     * @param value The value
     */
    public set(key: string, value: any): Promise<any> {
        return this.#adapter.set(this.getNamespacedKey(key), value);
    }

    /**
     * Remove a key from the storage.
     *
     * @param key The key to remove
     */
    public remove(key: string): Promise<any> {
        return this.#adapter.remove(this.getNamespacedKey(key));
    }
}

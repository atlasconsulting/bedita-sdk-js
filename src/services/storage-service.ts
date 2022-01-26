/**
 * Storage service class.
 * Help to read/write/remove tokens as access_token and refresh_token.
 * Use localStorage to store data.
 */
export default class StorageService {

    /**
     * The storage name. Used to prefix localStorage var
     */
    #name: string;

    /**
     * The access token key
     */
    readonly ACCESS_TOKEN_KEY: string = 'access_token';

    /**
     * The refresh token key
     */
    readonly REFRESH_TOKEN_KEY: string = 'refresh_token';

    /**
     * Csontructor.
     * It sets the access token and refresh token keys.
     *
     * @param name The name used as prefix for store in localStorage
     */
    public constructor(name = 'bedita') {
        this.#name = name;
    }

    /**
     * Getter for access token.
     */
    get accessToken(): string|null {
        return this.get(this.ACCESS_TOKEN_KEY);
    }

    /**
     * Setter for access token.
     */
    set accessToken(value: string) {
        this.set(this.ACCESS_TOKEN_KEY, value);
    }

    /**
     * Getter for refresh token.
     */
    get refreshToken(): string|null {
        return this.get(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Setter for refresh token.
     */
    set refreshToken(value: string) {
        this.set(this.REFRESH_TOKEN_KEY, value);
    }

    /**
     * Remove all tokens.
     * Return this for chainability.
     */
    public clearTokens(): StorageService {
        return this.remove(this.ACCESS_TOKEN_KEY)
            .remove(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Get namespaced key.
     *
     * @param key The key.
     */
    protected getNamespacedKey(key: string): string {
        return `${this.#name}.${key}`;
    }

    /**
     * Get the storaged value.
     *
     * @todo JSON parse if value a re json stringified
     */
    public get(key: string): any {
        return localStorage.getItem(this.getNamespacedKey(key));
    }

    /**
     * Set a value in the storage.
     * Return this for chainability.
     *
     * @param key The starage key
     * @param value The value
     *
     * @todo JSON stringify value that represents objects
     */
    public set(key: string, value: string): StorageService {
        localStorage.setItem(this.getNamespacedKey(key), value);

        return this;
    }

    /**
     * Remove a key from the storage.
     *
     * @param key The key to remove
     */
    public remove(key: string): StorageService {
        localStorage.removeItem(this.getNamespacedKey(key));

        return this;
    }
}

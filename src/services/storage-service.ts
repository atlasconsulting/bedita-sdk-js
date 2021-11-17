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
    readonly ACCESS_TOKEN_KEY: string;

    /**
     * The refresh token key
     */
    readonly REFRESH_TOKEN_KEY: string;

    /**
     * Csontructor.
     * It sets the access token and refresh token keys.
     *
     * @param name The name used as prefix for store in localStorage
     */
    public constructor(name: string = 'bedita') {
        this.ACCESS_TOKEN_KEY = `${name}.access_token`;
        this.REFRESH_TOKEN_KEY = `${name}.refresh_token`;
        this.#name = name;
    }

    /**
     * Getter for access token.
     */
    get accessToken(): string|null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    /**
     * Setter for access token.
     */
    set accessToken(value: string) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, value);
    }

    /**
     * Getter for refresh token.
     */
    get refreshToken(): string|null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Setter for refresh token.
     */
    set refreshToken(value: string) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, value);
    }

    /**
     * Remove all tokens.
     */
    public clearTokens() {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Get the storaged value.
     *
     * @todo JSON parse if value a re json stringified
     */
    public get(key: string): any {
        return localStorage.getItem(`${this.#name}.${key}`);
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
        localStorage.setItem(`${this.#name}.${key}`, value);

        return this;
    }
}

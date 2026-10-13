import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    interceptorOptions?: {
      [interceptorName: string]: Record<string, unknown>;
    };
  }
}

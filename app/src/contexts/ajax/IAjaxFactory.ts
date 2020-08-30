import { IOauthFactory } from ".";

export default interface IAjaxFactory {
  send: (url: string, options?: RequestInit) => Promise<Response>;
  get: (url: string, options?: RequestInit) => Promise<Response>;
  post: (url: string, data?: any, options?: RequestInit) => Promise<Response>;
  put: (url: string, data?: any, options?: RequestInit) => Promise<Response>;
  remove: (url: string, data?: any, options?: RequestInit) => Promise<Response>;
  oauth?: IOauthFactory;
}

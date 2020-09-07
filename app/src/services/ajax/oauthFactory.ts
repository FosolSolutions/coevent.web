import {
  factory as ajaxFactory,
  IRequestInit,
  IAjaxFactory,
} from "./ajaxFactory";
import { IToken } from "./IToken";
import JwtDecode from "jwt-decode";
import { IAccessToken } from "../";
import Cookies from "js-cookie";
import Constants from "settings/Constants";

export interface IOauthInit extends IRequestInit {
  refreshTokenUrl?: string;
  onAuthenticate?: (oauth: IOauthFactory) => void;
}

export interface IOauthFactory extends IAjaxFactory {
  initOauth: (init: IOauthInit) => void;
  isAuthenticated: () => boolean;
  setToken: (token: IToken | string | null) => void;
  getToken: () => IToken;
}

export interface IOauthState {
  isAuthenticated: boolean;
  token?: IToken;
}

const state: IOauthState = {
  isAuthenticated: false,
  token: undefined,
};

/**
 * The token types that are stored.
 */
export enum TokenType {
  /** An access token is used to authenticate and authorize requests. */
  Access = "access",
  /** A refresh token is used to fetch a new access token. */
  Refresh = "refresh",
}

/**
 * AJAX Factory wrapper to enable automatic JWT authentication and refresh.
 * Note - If using the singleton 'Oauth' object you will need to call the `Oauth.initOauth(...)` function to setup.
 * @param init Request initialization options that will be applied to all requests.
 */
export const factory = (init?: IOauthInit): IOauthFactory => {
  let _init = init;
  const ajax = ajaxFactory(_init);

  const oauthFactory = {
    ...ajax,
    initOauth: (init: IOauthInit) => {
      _init = { ..._init, ...init };
    },
    isAuthenticated: () => state.isAuthenticated,
    setToken: (token: string | IToken | null) => {
      if (token === null) {
        state.token = undefined;
        state.isAuthenticated = false;
        Cookies.remove(Constants.cookieName);
      } else if (typeof token === "string") {
        const access = JwtDecode(token) as IAccessToken;
        const expiresIn = new Date(0);
        expiresIn.setUTCSeconds(access.exp as number);
        state.token = {
          accessToken: token,
          expiresIn: expiresIn,
        } as IToken;
        state.isAuthenticated =
          !!access && !!access.exp && expiresIn > new Date();

        Cookies.set(Constants.cookieName, token, {
          expires: state.token?.refreshExpiresIn,
        });
      } else {
        const access = JwtDecode(token.accessToken) as IAccessToken;
        const expiresIn = new Date(0);
        expiresIn.setUTCSeconds(access.exp as number);
        state.token = {
          ...token,
          expiresIn: expiresIn,
        };
        state.isAuthenticated =
          !!access && !!access.exp && expiresIn > new Date();

        if (token.refreshToken) {
          const refresh = JwtDecode(token.refreshToken) as IAccessToken;
          const refreshExpiresIn = new Date(0);
          refreshExpiresIn.setUTCSeconds(refresh.exp as number);
          state.token.refreshExpiresIn = refreshExpiresIn;
        }

        Cookies.set(Constants.cookieName, token, {
          expires: state.token?.refreshExpiresIn,
        });
      }

      if (_init?.onAuthenticate) {
        _init?.onAuthenticate(oauthFactory);
      }
    },
    getToken: (type?: TokenType) => {
      switch (type) {
        case TokenType.Access:
          return state.token?.accessToken;
        case TokenType.Refresh:
          return state.token?.refreshToken;
        default:
          return state.token;
      }
    },
    send: async (info: RequestInfo, init?: IRequestInit | undefined) =>
      await ajax.send(info, await refreshtoken(init)),
    get: async (info: RequestInfo, init?: IRequestInit | undefined) =>
      await ajax.get(info, await refreshtoken(init)),
    post: async (
      info: RequestInfo,
      body?:
        | string
        | Blob
        | ArrayBufferView
        | ArrayBuffer
        | FormData
        | URLSearchParams
        | ReadableStream<Uint8Array>
        | null
        | undefined
        | any,
      init?: IRequestInit | undefined
    ) => await ajax.post(info, body, await refreshtoken(init)),
    put: async (
      info: RequestInfo,
      body?:
        | string
        | Blob
        | ArrayBufferView
        | ArrayBuffer
        | FormData
        | URLSearchParams
        | ReadableStream<Uint8Array>
        | null
        | undefined
        | any,
      init?: IRequestInit | undefined
    ) => await ajax.put(info, body, await refreshtoken(init)),
    delete: async (
      info: RequestInfo,
      body?:
        | string
        | Blob
        | ArrayBufferView
        | ArrayBuffer
        | FormData
        | URLSearchParams
        | ReadableStream<Uint8Array>
        | null
        | undefined
        | any,
      init?: IRequestInit | undefined
    ) => await ajax.delete(info, body, await refreshtoken(init)),
  } as IOauthFactory;

  /**
   * Every request should include the authorization header with the JWT.
   * If the access token has expired and there is a refresh token, refresh the access token.
   * @param init The request initialization options.
   * @returns An new instance of a request initialization options, which will include the JWT if possible
   */
  const refreshtoken = async (
    init?: RequestInit
  ): Promise<RequestInit | undefined> => {
    const now = new Date();
    try {
      if (
        _init?.refreshTokenUrl &&
        state.token &&
        state.token.expiresIn &&
        state.token.expiresIn <= now &&
        state.token.refreshToken &&
        state.token.refreshExpiresIn &&
        state.token.refreshExpiresIn > now
      ) {
        // The access token has expired.
        // Make a request to refresh the token.
        const refreshOptions = {
          ..._init,
          headers: {
            ..._init.headers,
            Authorization: `Bearer ${state.token.refreshToken}`,
          },
        };
        const tokenResponse = await ajax.post(
          _init?.refreshTokenUrl,
          undefined,
          refreshOptions
        );
        const token = (await tokenResponse.json()) as IToken;
        oauthFactory.setToken(token);
      }

      if (
        state.token?.accessToken &&
        state.token?.expiresIn &&
        state.token?.expiresIn > now
      ) {
        // Add JWT to request if it hasn't expired.
        return Promise.resolve({
          ...init,
          headers: {
            ...init?.headers,
            Authorization: `Bearer ${state.token?.accessToken}`,
          },
        } as IRequestInit);
      }

      return Promise.resolve(init);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Get the token from the cookie to initialize authentication.
  const token = Cookies.getJSON(Constants.cookieName) as IToken;
  if (token) {
    oauthFactory.setToken(token);
  }

  return oauthFactory;
};

export const Oauth = factory();

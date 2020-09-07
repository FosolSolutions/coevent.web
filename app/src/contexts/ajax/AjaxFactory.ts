import { ILogin, IToken } from "../../services";
import { IIdentity } from "../identity";
import {
  IOauthFactory,
  IAjaxState,
  IAjaxFactory,
  prepareBody,
  IValidationError,
} from ".";

const parseError = (error: IValidationError): string => {
  let msg = error.title;
  const props = Object.keys(error.errors);
  props.forEach((p) => (msg += `\n${p}:${error.errors[p].join("\n")}`));
  return msg;
};

/**
 * Handle a failed request and generate a friendly error message.
 * @param response HTTP Response message.
 */
const handleFailure = async (response: Response): Promise<never> => {
  let error = `Request failed [${response.status}]`;
  try {
    const data = (await response.json()) as any;
    if (data.error) error = data.error;
    else if (data.errors) error = parseError(data as IValidationError);
  } catch (ex) {
    console.log(ex);
  }
  return Promise.reject(new Error(error));
};

/**
 * Makes an HTTP Ajax request and will refresh the access token if it has expired.
 * @param url The URL to the endpoint.
 * @param options
 * @param state
 * @param setState
 * @param setCookie
 */
const makeRequest = async (
  url: string,
  options?: RequestInit,
  props?: IAjaxFactoryProps
) => {
  const [state, setState] = props?.ajaxContext ?? [];
  const [identity] = props?.identityContext ?? [];
  if (setState)
    setState((s) => {
      return { ...s, requestCount: s.requestCount + 1 };
    });
  const now = new Date();
  // Check if the access token has expired. // TODO: If the refresh token has expired need to throw.
  if (
    state &&
    setState &&
    props?.refreshUrl &&
    url !== props?.refreshUrl && // Don't send a request to refresh if we already are.
    identity?.refreshToken &&
    identity?.expiresIn &&
    identity.expiresIn <= now
  ) {
    // Make a request to refresh the access token.
    const token = (await refresh(props)) as IToken;
    identity.accessToken = token.accessToken; // Need to do this because state isn't guarenteed to be updated yet.
  }

  // If there is an access token include it in the request.
  const init = identity?.accessToken
    ? {
        ...options,
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${identity.accessToken}`,
          ...options?.headers,
        },
      }
    : options;
  return fetch(url, init)
    .then((response) => {
      if (!response.ok) return handleFailure(response);

      if (setState) {
        setState((state) => {
          return {
            ...state,
            error: undefined,
          };
        });
      }

      return response;
    })
    .catch((error) => {
      console.log(error);
      if (setState) {
        setState((state) => {
          return {
            ...state,
            error: error.message,
          };
        });
      }
      return Promise.reject(error);
    })
    .finally(() => {
      // TODO: Find out why this is firing twice for the first request.
      if (setState)
        setState((s) => {
          return { ...s, requestCount: s.requestCount - 1 };
        });
    });
};

export const send = (
  url: string,
  options?: RequestInit,
  props?: IAjaxFactoryProps
) => makeRequest(url, options, props);

export const get = (
  url: string,
  options?: RequestInit,
  props?: IAjaxFactoryProps
) => makeRequest(url, { ...options, method: "Get" }, props);

export const post = (
  url: string,
  data?: any,
  options?: RequestInit,
  props?: IAjaxFactoryProps
) => makeRequest(url, { ...prepareBody(data, options), method: "Post" }, props);

export const put = (
  url: string,
  data?: any,
  options?: RequestInit,
  props?: IAjaxFactoryProps
) => makeRequest(url, { ...prepareBody(data, options), method: "Put" }, props);

export const remove = (
  url: string,
  data?: any,
  options?: RequestInit,
  props?: IAjaxFactoryProps
) =>
  makeRequest(url, { ...prepareBody(data, options), method: "Delete" }, props);

export const token = async (
  credentials: ILogin | string,
  props?: IAjaxFactoryProps
) => {
  try {
    if (!props?.tokenUrl) return Promise.resolve();

    const url =
      typeof props.tokenUrl === "function"
        ? props.tokenUrl(credentials)
        : props.tokenUrl;
    const response = await post(
      url,
      typeof credentials == "string" ? "" : credentials,
      {},
      props
    );

    const token = (await response.json()) as IToken;
    return token;
  } catch (error) {
    throw error;
  }
};

export const refresh = async (props?: IAjaxFactoryProps) => {
  try {
    if (!props?.refreshUrl) return Promise.resolve();

    const [identity] = props.identityContext;
    const response = await post(
      props.refreshUrl,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${identity.refreshToken}`,
        },
      },
      props
    );

    const token = (await response.json()) as IToken;
    return token;
  } catch (error) {
    throw error;
  }
};

export interface IAjaxFactoryProps {
  tokenUrl?: (o: any) => string;
  refreshUrl?: string;
  ajaxContext: [IAjaxState, React.Dispatch<React.SetStateAction<IAjaxState>>];
  identityContext: [IIdentity, React.Dispatch<React.SetStateAction<IIdentity>>];
}

export const ajaxFactory = (props?: IAjaxFactoryProps) => {
  return {
    send: (url: string, options?: RequestInit) => send(url, options, props),
    get: (url: string, options?: RequestInit) => get(url, options, props),
    post: (url: string, data?: any, options?: RequestInit) =>
      post(url, data, options, props),
    put: (url: string, data?: any, options?: RequestInit) =>
      put(url, data, options, props),
    remove: (url: string, data?: any, options?: RequestInit) =>
      remove(url, data, options, props),
    oauth: {
      token: (credentials: ILogin | string) => token(credentials, props),
      refresh: () => refresh(props),
    } as IOauthFactory,
  } as IAjaxFactory;
};

export default ajaxFactory;

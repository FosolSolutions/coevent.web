import prepareBody from "./prepareBody";

export interface ISendProps {
  info: RequestInfo;
  init?: IRequestInit;
}

export interface IRequestInit extends RequestInit {
  /** Provides a way to modify the request options before the request is sent. */
  onSend?: (request: ISendProps) => Promise<IRequestInit | any>;
  /** If the request was succesful this event will trigger. */
  onSuccess?: (response: Response) => Promise<Response>;
  /** If the request failed this event will trigger. */
  onFailure?: (request: ISendProps) => Promise<any>;
}

/**
 * Send the AJAX request.
 * - Trigger the `onSend(...)` before the request is sent.
 * - Trigger the `onSuccess(...)` if the request was successful.
 * - Trigger the `onFailure(...)` if a request fails.
 * @param info The request information (i.e. URL).
 * @param init The request options.
 */
const send = async (
  info: RequestInfo,
  init?: IRequestInit
): Promise<Response | any> => {
  try {
    const doSendResult = init?.onSend
      ? await init?.onSend({
          info: info,
          init: init,
        })
      : defaultAjaxInit.onSend({ info, init });

    const options = {
      ...init,
      ...doSendResult,
    };

    const doSend = doSendResult === undefined || !!doSendResult;
    if (doSend) {
      const response = await fetch(info, options);

      return options?.onSuccess
        ? await options?.onSuccess(response)
        : defaultAjaxInit.onSuccess(response);
    }

    return Promise.resolve(doSendResult);
  } catch (error) {
    return init?.onFailure
      ? await init?.onFailure(error)
      : defaultAjaxInit.onFailure(error);
  }
};

export interface IAjaxFactory {
  init: (init: IRequestInit) => void;
  send: (
    info: RequestInfo,
    init?: IRequestInit | undefined
  ) => Promise<Response>;
  get: (
    info: RequestInfo,
    init?: IRequestInit | undefined
  ) => Promise<Response>;
  post: (
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
  ) => Promise<Response>;
  put: (
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
  ) => Promise<Response>;
  delete: (
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
  ) => Promise<Response>;
  onSend: (request: ISendProps) => Promise<IRequestInit | any>;
  onSuccess: (response: Response) => Promise<Response>;
  onFailure: (request: ISendProps) => Promise<boolean | any>;
}

/**
 * AJAX factory service.
 * Provides a wrapper for the `fetch` library.
 * @param init AJAX request initialiation options to be applied to all requests.
 */
export const factory = (init?: IRequestInit): IAjaxFactory => {
  let _init = init;
  return {
    init: (init: IRequestInit) => {
      _init = {
        ..._init,
        ...init,
      };
    },
    send: send,
    get: (info: RequestInfo, init?: IRequestInit) =>
      send(info, {
        ..._init,
        ...init,
        method: "GET",
      }),
    post: (
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
      init?: IRequestInit
    ) => {
      return send(info, {
        ..._init,
        ...init,
        method: "POST",
        ...prepareBody(body ?? init?.body, init),
      });
    },
    put: (
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
      init?: IRequestInit
    ) =>
      send(info, {
        ..._init,
        ...init,
        method: "PUT",
        ...prepareBody(body ?? init?.body, init),
      }),
    delete: (
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
      init?: IRequestInit
    ) =>
      send(info, {
        ..._init,
        ...init,
        method: "DELETE",
        ...prepareBody(body ?? init?.body, init),
      }),
    onSend: init?.onSend ? init.onSend : defaultAjaxInit.onSend,
    onSuccess: init?.onSuccess ? init.onSuccess : defaultAjaxInit.onSuccess,
    onFailure: init?.onFailure ? init.onFailure : defaultAjaxInit.onFailure,
  };
};

export const defaultAjaxInit = {
  onSend: (request: ISendProps) => Promise.resolve(request.init),
  onSuccess: (response: Response) => Promise.resolve(response),
  onFailure: (error: any) => error,
};

export const Ajax = factory();

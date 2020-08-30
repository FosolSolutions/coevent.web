// string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null | undefined
export default (data?: any, options?: RequestInit): RequestInit => {
  const headers = {
    ...options?.headers,
  } as any;
  const type = typeof data;
  if (
    headers["Content-Type"] === "multipart/form-data" &&
    !(data instanceof FormData)
  ) {
    debugger;
    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
      form.append(key, `${value}`);
    }
    return {
      ...options,
      body: form,
      headers: {
        ...headers,
      },
    };
  }
  if (type === "string" && data?.length > 0 && data[0] === "{")
    return {
      ...options,
      body: data,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };
  if (
    data === undefined ||
    data === null ||
    data instanceof String ||
    data instanceof Blob ||
    data instanceof ArrayBuffer ||
    data instanceof ArrayBuffer ||
    data instanceof FormData ||
    data instanceof URLSearchParams ||
    data instanceof ReadableStream
  )
    return { ...options, body: data };
  if (data instanceof Number)
    return {
      ...options,
      body: data.toString(),
      headers: headers,
    };
  if (data instanceof FormData)
    return {
      ...options,
      body: data,
      headers: {
        "Content-Type": "multipart/form-data",
        ...headers,
      },
    };
  if (data instanceof Object)
    return {
      ...options,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };
  return {
    ...options,
    body: data,
    headers: headers,
  };
};

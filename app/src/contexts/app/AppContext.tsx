import React from "react";
import { IAjaxError, IValidationError } from "services/api";
import { Oauth } from "services/ajax";

export interface IAppContext {
  error?: IValidationError | IAjaxError | string;
  errorMessage?: string;
}

export const AppContext = React.createContext<
  [IAppContext, React.Dispatch<React.SetStateAction<IAppContext>>]
>([{}, () => {}]);

const extractError = (
  error: IValidationError | IAjaxError | string
): string => {
  if (error instanceof String) return error as string;
  else if ((error as IValidationError).errors) {
    const validationError = error as IValidationError;
    const keys = Object.keys(validationError.errors);
    const messages = keys
      .map((k) => `${k}:${validationError.errors[k]}`)
      .join(", ");
    return `${validationError.title} ${messages}`;
  } else if ((error as IAjaxError).error) {
    const ajaxError = error as IAjaxError;
    return ajaxError.error as string;
  }
  return error as string;
};

/**
 * Application context provider.
 * @param props Context properties
 */
export const AppProvider = (props?: React.PropsWithChildren<any>) => {
  const [app, setApp] = React.useState<IAppContext>({});
  Oauth.init({
    onFailure: (error: any) => {
      setApp((s) => ({
        ...s,
        error: error,
        errorMessage: extractError(error),
      }));
      return Promise.reject(error);
    },
  });

  return (
    <AppContext.Provider value={[app, setApp]}>
      {props.children}
    </AppContext.Provider>
  );
};
export const AppConsumer = AppContext.Consumer;
export default AppContext;

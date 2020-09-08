import { IValidationError, IAjaxError } from "../../services/api";

export enum ErrorAction {
  set = "set-error",
  clear = "clear-error",
}

export interface IErrorAction {
  type: ErrorAction;
  error?: IValidationError | IAjaxError | string;
}

export const setError = (
  error: IValidationError | IAjaxError | string
): IErrorAction => {
  return {
    type: ErrorAction.set,
    error: error,
  };
};

export const clearError = (): IErrorAction => {
  return {
    type: ErrorAction.clear,
  };
};

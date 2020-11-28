import { ErrorAction, IErrorAction, IErrorState } from "../actions";
import { IValidationError, IAjaxError } from "services";

export const initialState: IErrorState = {
  error: undefined,
  message: undefined,
};

/**
 * Extract the error message from the error.
 * @param error Error object
 */
const extractError = (
  error?: IValidationError | IAjaxError | string
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

export const errorReducer = (
  state: IErrorState = initialState,
  action: IErrorAction
): IErrorState => {
  switch (action.type) {
    case ErrorAction.set:
      return {
        ...state,
        error: action.error,
        message: extractError(action.error),
      };
    case ErrorAction.clear:
      return {
        ...state,
        error: undefined,
        message: undefined,
      };
    default:
      return state;
  }
};

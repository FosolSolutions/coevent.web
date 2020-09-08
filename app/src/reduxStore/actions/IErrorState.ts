import { IValidationError, IAjaxError } from "../../services/api";

export interface IErrorState {
  error?: IValidationError | IAjaxError | string;
  message?: string;
}

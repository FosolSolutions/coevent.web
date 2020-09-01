import { IAjaxError } from ".";

export default interface IAjaxState {
  error: string | any | IAjaxError;
  requestCount: number;
}

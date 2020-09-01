export default interface IValidationError {
  status: number;
  title: string;
  traceId: string;
  type: string;
  errors: any;
}

export interface IValidationError {
  member: "IValidationError";
  status: number;
  title: string;
  traceId: string;
  type: string;
  errors: any;
}

export default IValidationError;

import { IQuestionOption } from "services";

export default interface IQuestion {
  id: number;
  caption: string;
  text: string;
  answerType: number;
  isRequired: boolean;
  sequence: number;
  maxLength: number;
  allowOther: boolean;
  options: IQuestionOption[];
}

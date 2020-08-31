import { IQuestionOption } from "services";

export default interface IAnswer {
  openingId: number;
  questionId: number;
  participantId: number;
  text: string;
  options: IQuestionOption[];
}

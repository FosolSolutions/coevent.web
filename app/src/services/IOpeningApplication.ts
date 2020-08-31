import { IParticipant, IAnswer } from "services";

export default interface IOpeningApplication {
  openingId: number;
  state: number;
  participant: IParticipant;
  answers: IAnswer[];
}

import {
  IParticipant,
  IQuestion,
  IOpeningApplication,
  ICriteria,
} from "services";

export default interface IOpening {
  id: number;
  activityId: number;
  name: string;
  maxParticipants: number;
  minParticipants: number;
  participants: IParticipant[];
  questions: IQuestion[];
  rowVersion: string;
  applications: IOpeningApplication[];
  criteria: ICriteria[];
}

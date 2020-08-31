import { IAttribute } from "services";

export default interface IParticipant {
  id: number;
  key: string;
  displayName: string;
  state: number;
  userId?: number;
  calendarId: number;
  email: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: number;
  attributes: IAttribute[];
}

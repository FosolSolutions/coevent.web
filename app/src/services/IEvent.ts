import { IActivity } from "services";

export default interface IEvent {
  id: number;
  key: string;
  calendarId: number;
  name: string;
  description?: string;
  startOn: Date;
  endOn: Date;
  state: number;
  activities: IActivity[];
  criteria: [];
}

import { IEvent } from "services";

export default interface ICalendar {
  id: number;
  name?: string;
  events: IEvent[];
}

import { IOpening, ICriteria } from "services";

export default interface IActivity {
  id: number;
  eventId: number;
  name: string;
  openings: IOpening[];
  criteria: ICriteria[];
  criteriaRule: number;
}

import { ICondition } from "services";

export default interface ICriteria {
  logicalOperator: number;
  conditions: ICondition[];
}

import React from "react";
import { IActivity, IOpening, IEvent } from "../../../services";

export interface IOpeningCardProps {
  /** The event this opening belongs to. */
  event: IEvent;
  /** The activity this opening belongs to. */
  activity?: IActivity;
  /** The opening for the activity. */
  opening?: IOpening;
  /** Whether applications can be submitted to this activity. */
  showApply?: boolean;
}

export const OpeningCard = (props: IOpeningCardProps) => {
  return <span className="opening-label">{props.opening?.name}</span>;
};

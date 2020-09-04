import React from "react";
import { IActivity, IOpening } from "../../../services";

export interface IOpeningCardProps {
  /** The event activity for this opening. */
  activity?: IActivity;
  /** The opening for the activity. */
  opening?: IOpening;
}

export const OpeningCard = (props: IOpeningCardProps) => {
  return <span className="opening-label">{props.opening?.name}</span>;
};

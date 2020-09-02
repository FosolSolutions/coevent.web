import React from "react";
import { IActivity } from "../../services";
import { OpeningCard } from ".";

export interface IActivityCardProps {
  /** The event activity. */
  activity: IActivity;
}

/**
 * Displays an event activity.
 * @param props Component properties.
 * @param props.activity The event activity.
 */
export const ActivityCard = (props: IActivityCardProps) => {
  return (
    <div>
      <div>{props.activity.name}</div>
      {props.activity.openings.map((opening) => {
        return (
          <OpeningCard
            key={opening.id}
            activity={props.activity}
            opening={opening}
          ></OpeningCard>
        );
      })}
    </div>
  );
};

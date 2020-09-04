import React from "react";
import { IActivity, IEvent } from "../../services";
import { OpeningCard } from ".";

export interface IActivityCardProps {
  /** The event this activity belongs to. */
  event: IEvent;
  /** The event activity. */
  activity: IActivity;
}

/**
 * Displays an event activity.
 * @param props Component properties.
 * @param props.event The event this activity belongs to.
 * @param props.activity The activity.
 */
export const ActivityCard = (props: IActivityCardProps) => {
  return (
    <div>
      <div>{props.activity.name}</div>
      {props.activity.openings.map((opening) => {
        return (
          <OpeningCard
            event={props.event}
            key={opening.id}
            activity={props.activity}
            opening={opening}
          ></OpeningCard>
        );
      })}
    </div>
  );
};

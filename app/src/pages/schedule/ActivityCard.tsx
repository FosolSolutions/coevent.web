import React from "react";
import { IActivity } from "../../services";
import { OpeningCard } from ".";

export interface IActivityCardProps {
  activity: IActivity;
}

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

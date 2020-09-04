import React from "react";
import { IActivity, IOpening, IEvent } from "../../../services";
import { OpeningCard } from "..";

export interface IActivityCardProps {
  /** The event this activity belongs to. */
  event: IEvent;
  /** The activity. */
  activity?: IActivity;
  /** The opening for this activity. */
  opening?: IOpening;
  /** Whether to display the opening title. */
  showTitle?: boolean;
  /** Whether applications can be submitted to this activity. */
  showApply?: boolean;
}

export const ActivityCard = (props: IActivityCardProps) => {
  return (
    <>
      {!!props.opening ? (
        <OpeningCard
          event={props.event}
          activity={props.activity as IActivity}
          opening={props.opening}
          showTitle={props.showTitle}
          showApply={props.showApply}
        ></OpeningCard>
      ) : (
        props.activity?.openings.map((o) => (
          <OpeningCard
            key={o.id}
            event={props.event}
            activity={props.activity as IActivity}
            opening={o}
            showTitle={props.showTitle}
            showApply={props.showApply}
          ></OpeningCard>
        ))
      )}
    </>
  );
};

ActivityCard.defaultProps = {
  showTitle: true,
};

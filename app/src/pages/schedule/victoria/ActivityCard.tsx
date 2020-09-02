import React from "react";
import { IActivity, IOpening } from "../../../services";
import { OpeningCard } from "..";

export interface IActivityCardProps {
  /** The event activity. */
  activity?: IActivity;
  opening?: IOpening;
  showTitle?: boolean;
}

export const ActivityCard = (props: IActivityCardProps) => {
  return (
    <>
      {!!props.opening ? (
        <OpeningCard
          activity={props.activity as IActivity}
          opening={props.opening}
          showTitle={props.showTitle}
        ></OpeningCard>
      ) : (
        props.activity?.openings.map((o) => (
          <OpeningCard
            activity={props.activity as IActivity}
            opening={o}
            showTitle={props.showTitle}
          ></OpeningCard>
        ))
      )}
    </>
  );
};

ActivityCard.defaultProps = {
  showTitle: true,
};

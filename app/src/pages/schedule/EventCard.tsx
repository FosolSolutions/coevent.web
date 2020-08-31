import React from "react";
import { IEvent } from "../../services";
import { Card } from "react-bootstrap";
import moment from "moment";
import { ActivityCard } from ".";

export interface IEventCardProps {
  event: IEvent;
}

export const EventCard = (props: IEventCardProps) => {
  return (
    <Card className="p-3" style={{ minWidth: "250px" }}>
      <Card.Header>
        <div>{moment(props.event.startOn).format("MMM dddd DD")}</div>
        <div>
          <h4>{props.event.name}</h4>
        </div>
      </Card.Header>
      <Card.Body>
        {props.event.activities.map((activity) => {
          return (
            <ActivityCard key={activity.id} activity={activity}></ActivityCard>
          );
        })}
      </Card.Body>
    </Card>
  );
};

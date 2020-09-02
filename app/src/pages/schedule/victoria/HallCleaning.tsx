import React from "react";
import { IEvent } from "../../../services";
import { Row, Col } from "react-bootstrap";
import moment from "moment";
import { ActivityCard } from ".";

export interface IHallCleaningProps {
  /** An array of calendar events for this schedule. */
  events: IEvent[];
}

/**
 * Displays a schedule, events, activities, openings and participants.
 * Provides a way for participants to apply or unapply to openings.
 */
export const HallCleaning = (props: IHallCleaningProps) => {
  const lectures = props.events.filter((e) => e.name === "Hall Cleaning");

  const getCleaning = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Cleaning");
  };
  return (
    <>
      <Row>
        <Col>
          <h3>Hall Cleaning</h3>
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col>Team</Col>
      </Row>
      {lectures.map((e, i) => {
        const cleaning = getCleaning(e);
        const oddRow = i % 2 === 0 ? { background: "#c5c9ed" } : {};
        return (
          <Row style={oddRow}>
            <Col>{moment(e.startOn).format("MMM DD")}</Col>
            <Col>
              <ActivityCard
                activity={cleaning}
                showTitle={false}
              ></ActivityCard>
            </Col>
          </Row>
        );
      })}
    </>
  );
};

export default HallCleaning;
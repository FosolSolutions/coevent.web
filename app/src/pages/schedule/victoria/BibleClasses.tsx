import React from "react";
import { IEvent } from "../../../services";
import { Row, Col } from "react-bootstrap";
import moment from "moment";
import { ActivityCard } from ".";

export interface IBibleClassesProps {
  /** An array of calendar events for this schedule. */
  events: IEvent[];
}

/**
 * Displays a schedule, events, activities, openings and participants.
 * Provides a way for participants to apply or unapply to openings.
 */
export const BibleClasses = (props: IBibleClassesProps) => {
  const lectures = props.events.filter((e) => e.name === "Bible Class");

  const getPresider = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Preside");
  };
  const getPianist = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Pianist");
  };
  const getSpeaker = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Speak");
  };
  return (
    <>
      <Row>
        <Col>
          <h3>Thursday Bible Classes</h3>
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col>Preside</Col>
        <Col>Pianist</Col>
        <Col>Speaker</Col>
      </Row>
      {lectures.map((e, i) => {
        const presider = getPresider(e);
        const pianist = getPianist(e);
        const speaker = getSpeaker(e);
        const oddRow = i % 2 === 0 ? { background: "#c5c9ed" } : {};
        return (
          <Row style={oddRow}>
            <Col>{moment(e.startOn).format("MMM DD")}</Col>
            <Col>
              <ActivityCard
                activity={presider}
                showTitle={false}
              ></ActivityCard>
            </Col>
            <Col>
              <ActivityCard activity={pianist} showTitle={false}></ActivityCard>
            </Col>
            <Col>
              <ActivityCard activity={speaker} showTitle={false}></ActivityCard>
            </Col>
          </Row>
        );
      })}
    </>
  );
};

export default BibleClasses;
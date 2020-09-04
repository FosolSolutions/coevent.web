import React from "react";
import { IEvent } from "../../../services";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import { ActivityCard } from ".";

export interface ILecturesProps {
  /** An array of calendar events for this schedule. */
  events: IEvent[];
}

/**
 * Displays a schedule, events, activities, openings and participants.
 * Provides a way for participants to apply or unapply to openings.
 */
export const Lectures = (props: ILecturesProps) => {
  const lectures = props.events.filter((e) => e.name === "Bible Talk");

  const getPresider = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Presider");
  };
  const getLecture = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Lecture");
  };
  return (
    <Container>
      <Row className="row-header">
        <Col></Col>
        <Col>Preside</Col>
        <Col>Speaker</Col>
      </Row>
      {lectures.map((e, i) => {
        const presider = getPresider(e);
        const lecture = getLecture(e);
        const oddRow = i % 2 === 0 ? "row-odd" : "";
        return (
          <Row className={oddRow}>
            <Col>{moment(e.startOn).format("MMM DD")}</Col>
            <Col>
              <ActivityCard
                event={e}
                activity={presider}
                showTitle={false}
              ></ActivityCard>
            </Col>
            <Col>
              <ActivityCard
                event={e}
                activity={lecture}
                showTitle={false}
              ></ActivityCard>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
};

export default Lectures;

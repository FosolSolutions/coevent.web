import React from "react";
import { IEvent } from "../../../services";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import { ActivityCard } from ".";

export interface ISundaySchoolProps {
  /** An array of calendar events for this schedule. */
  events: IEvent[];
}

/**
 * Displays a schedule, events, activities, openings and participants.
 * Provides a way for participants to apply or unapply to openings.
 */
export const SundaySchool = (props: ISundaySchoolProps) => {
  const teach = props.events.filter((e) => e.name === "Sunday School");

  const getTeacher = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Class");
  };
  return (
    <Container>
      <Row className="row-header">
        <Col></Col>
        <Col>Adult Class</Col>
      </Row>
      {teach.map((e, i) => {
        const teacher = getTeacher(e);
        const oddRow = i % 2 === 0 ? "row-odd" : "";
        return (
          <Row key={e.id} className={oddRow}>
            <Col>{moment(e.startOn).format("MMM DD")}</Col>
            <Col>
              <ActivityCard
                event={e}
                activity={teacher}
                showTitle={false}
              ></ActivityCard>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
};

export default SundaySchool;

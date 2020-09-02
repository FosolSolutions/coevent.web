import React from "react";
import { IEvent } from "../../../services";
import { Row, Col } from "react-bootstrap";
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
    <>
      <Row>
        <Col>
          <h3>Sunday Bible Talks</h3>
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col>Preside</Col>
        <Col>Speaker</Col>
      </Row>
      {lectures.map((e) => {
        const presider = getPresider(e);
        const lecture = getLecture(e);
        return (
          <Row>
            <Col>{moment(e.startOn).format("MMM DD")}</Col>
            <Col>
              <ActivityCard
                activity={presider}
                showTitle={false}
              ></ActivityCard>
            </Col>
            <Col>
              <ActivityCard activity={lecture} showTitle={false}></ActivityCard>
            </Col>
          </Row>
        );
      })}
    </>
  );
};

export default Lectures;

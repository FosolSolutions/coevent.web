import React from "react";
import { IEvent } from "../../../services";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import { ActivityCard } from ".";

export interface IMemorialMeetingsProps {
  /** An array of calendar events for this schedule. */
  events: IEvent[];
}

/**
 * Displays a schedule, events, activities, openings and participants.
 * Provides a way for participants to apply or unapply to openings.
 */
export const MemorialMeetings = (props: IMemorialMeetingsProps) => {
  const memorial = props.events.filter((e) => e.name === "Memorial Meeting");

  const getPresider = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Presider");
  };
  const getExhorter = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Exhorter");
  };
  const getPianist = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Pianist");
  };
  const getReadings = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Readings");
  };
  const getPrayers = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Prayers");
  };
  const getDoorKeeper = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Door Keeper");
  };
  return (
    <Container>
      <Row className="row-header">
        <Col></Col>
        <Col>Preside</Col>
        <Col>Exhort</Col>
        <Col>Pianist</Col>
        <Col>Readings</Col>
        <Col>Prayers</Col>
        <Col>Door</Col>
      </Row>
      {memorial.map((e, i) => {
        const presider = getPresider(e);
        const exhorter = getExhorter(e);
        const pianist = getPianist(e);
        const readings = getReadings(e);
        const prayers = getPrayers(e);
        const doorKeeper = getDoorKeeper(e);

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
                activity={exhorter}
                showTitle={false}
              ></ActivityCard>
            </Col>
            <Col>
              <ActivityCard
                event={e}
                activity={pianist}
                showTitle={false}
              ></ActivityCard>
            </Col>
            <Col>
              <ActivityCard event={e} activity={readings}></ActivityCard>
            </Col>
            <Col>
              <ActivityCard event={e} activity={prayers}></ActivityCard>
            </Col>
            <Col>
              <ActivityCard
                event={e}
                activity={doorKeeper}
                showTitle={false}
              ></ActivityCard>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
};

export default MemorialMeetings;

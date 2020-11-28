import React from "react";
import { IEvent } from "../../../services";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import { ActivityCard } from ".";
import _ from "lodash";

export interface ISundayMeetingsProps {
  /** An array of calendar events for this schedule. */
  events: IEvent[];
}

/**
 * Displays a schedule, events, activities, openings and participants.
 * Provides a way for participants to apply or unapply to openings.
 */
export const SundayMeetings = (props: ISundayMeetingsProps) => {
  const meetings = props.events.filter((e) => {
    return moment(e.startOn).day() === 0;
  });

  const sundays = Object.values(
    _.groupBy(meetings, (e) => {
      const date = moment(e.startOn);
      return `${date.month()}-${date.date()}`;
    })
  );

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
  const getLecture = (event: IEvent) => {
    return event.activities.find((a) => a.name === "Lecture");
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
        <Col>Bible Talk</Col>
      </Row>
      {sundays.map((e, i) => {
        const eMemorial = e[1];
        const eLecture = e[2];

        const date = moment(eMemorial.startOn).format("MMM DD");
        const presider = getPresider(eMemorial);
        const exhorter = getExhorter(eMemorial);
        const pianist = getPianist(eMemorial);
        const readings = getReadings(eMemorial);
        const prayers = getPrayers(eMemorial);
        const doorKeeper = getDoorKeeper(eMemorial);
        const lecture = getLecture(eLecture);

        const oddRow = i % 2 === 0 ? "row-odd flex-nowrap" : "flex-nowrap";
        return (
          <Row key={eMemorial.id} className={oddRow}>
            <Col>{date}</Col>
            <Col>
              <ActivityCard
                event={eMemorial}
                activity={presider}
                showTitle={false}
              ></ActivityCard>
            </Col>
            <Col>
              <ActivityCard
                event={eMemorial}
                activity={exhorter}
                showTitle={false}
              ></ActivityCard>
            </Col>
            <Col>
              <ActivityCard
                event={eMemorial}
                activity={pianist}
                showTitle={false}
              ></ActivityCard>
            </Col>
            <Col>
              <ActivityCard
                event={eMemorial}
                activity={readings}
              ></ActivityCard>
            </Col>
            <Col>
              <ActivityCard event={eMemorial} activity={prayers}></ActivityCard>
            </Col>
            <Col>
              <ActivityCard
                event={eMemorial}
                activity={doorKeeper}
                showTitle={false}
              ></ActivityCard>
            </Col>
            <Col>
              <ActivityCard
                event={eLecture}
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

export default SundayMeetings;

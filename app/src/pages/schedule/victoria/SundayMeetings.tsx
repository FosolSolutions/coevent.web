import React from "react";
import { IEvent } from "../../../services";
import { Row, Col } from "react-bootstrap";
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
      return `${date.month()}-${date.day()}`;
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
    <>
      <Row style={{ background: "#a6acde", fontSize: "1.25em" }}>
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
        const date = moment(e[0].startOn).format("MMM DD");
        const presider = getPresider(e[0]);
        const exhorter = getExhorter(e[0]);
        const pianist = getPianist(e[0]);
        const readings = getReadings(e[0]);
        const prayers = getPrayers(e[0]);
        const doorKeeper = getDoorKeeper(e[0]);
        const lecture = getLecture(e[1]);

        const oddRow = i % 2 === 0 ? { background: "#c5c9ed" } : {};
        return (
          <Row style={oddRow}>
            <Col>{date}</Col>
            <Col>
              <ActivityCard
                activity={presider}
                showTitle={false}
              ></ActivityCard>
            </Col>
            <Col>
              <ActivityCard
                activity={exhorter}
                showTitle={false}
              ></ActivityCard>
            </Col>
            <Col>
              <ActivityCard activity={pianist} showTitle={false}></ActivityCard>
            </Col>
            <Col>
              <ActivityCard activity={readings}></ActivityCard>
            </Col>
            <Col>
              <ActivityCard activity={prayers}></ActivityCard>
            </Col>
            <Col>
              <ActivityCard
                activity={doorKeeper}
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

export default SundayMeetings;

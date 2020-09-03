import React from "react";
import "./Schedule.scss";
import coEventLogoWh from "../../../content/logos/coEventLogoWh.svg";
import AjaxContext from "contexts/ajax";
import { IEvent, ICalendar } from "services";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import { ParticipantProvider } from "../../../contexts/participant/ParticipantContext";
import { getSchedule } from "../index";
import { SundayMeetings, BibleClasses, HallCleaning } from ".";

/**
 * Displays a schedule, events, activities, openings and participants.
 * Provides a way for participants to apply or unapply to openings.
 */
export const VictoriaSchedule = () => {
  const [, , ajax] = React.useContext(AjaxContext);
  const [calendar, setCalendar] = React.useState({
    id: 0,
    events: [] as IEvent[],
  } as ICalendar);

  React.useEffect(() => {
    getSchedule(ajax, setCalendar);
  }, [calendar.id]);
  return (
    <ParticipantProvider>
      <Container>
        <Row>
          <Col>
            <section className="background">
              <img className="logo" src={coEventLogoWh} alt="CoEvent" />
              <h1 className="valueProp">{calendar?.name}</h1>
            </section>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tabs defaultActiveKey="sunday" id="schedule">
              <Tab eventKey="sunday" title="Sunday Meetings">
                <SundayMeetings events={calendar.events}></SundayMeetings>
              </Tab>
              <Tab eventKey="bibleClasses" title="Bible Classes">
                <BibleClasses events={calendar.events}></BibleClasses>
              </Tab>
              <Tab eventKey="cleaning" title="Hall Cleaning">
                <HallCleaning events={calendar.events}></HallCleaning>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </ParticipantProvider>
  );
};

export default VictoriaSchedule;

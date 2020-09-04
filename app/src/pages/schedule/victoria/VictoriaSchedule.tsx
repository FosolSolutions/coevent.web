import React from "react";
import "./Schedule.scss";
import coEventLogoWh from "../../../content/logos/coEventLogoWh.svg";
import { Container, Row, Col, Tabs, Tab, Spinner } from "react-bootstrap";
import { ParticipantProvider } from "../../../contexts/participant/ParticipantContext";
import { SundayMeetings, BibleClasses, HallCleaning } from ".";
import { CalendarProvider, CalendarConsumer } from "../../../contexts/calendar";

/**
 * Displays a schedule, events, activities, openings and participants.
 * Provides a way for participants to apply or unapply to openings.
 */
export const VictoriaSchedule = () => {
  return (
    <ParticipantProvider>
      <CalendarProvider>
        <CalendarConsumer>
          {([state]) => (
            <Container>
              <Row>
                <Col>
                  <section className="background">
                    <img className="logo" src={coEventLogoWh} alt="CoEvent" />
                    <h1 className="valueProp">{state.calendar?.name}</h1>
                  </section>
                </Col>
              </Row>
              <Row>
                <Col>
                  {state.loading ? (
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  ) : null}
                  <Tabs defaultActiveKey="sunday" id="schedule">
                    <Tab eventKey="sunday" title="Sunday Meetings">
                      <SundayMeetings
                        events={state.calendar.events}
                      ></SundayMeetings>
                    </Tab>
                    <Tab eventKey="bibleClasses" title="Bible Classes">
                      <BibleClasses
                        events={state.calendar.events}
                      ></BibleClasses>
                    </Tab>
                    <Tab eventKey="cleaning" title="Hall Cleaning">
                      <HallCleaning
                        events={state.calendar.events}
                      ></HallCleaning>
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </Container>
          )}
        </CalendarConsumer>
      </CalendarProvider>
    </ParticipantProvider>
  );
};

export default VictoriaSchedule;

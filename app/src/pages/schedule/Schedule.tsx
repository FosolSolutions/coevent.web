import React from "react";
import coEventLogoWh from "../../content/logos/coEventLogoWh.svg";
import { IEvent } from "services";
import { CardDeck, Container, Row, Col } from "react-bootstrap";
import { ParticipantProvider } from "../../contexts/participant/ParticipantContext";
import { EventCard } from ".";
import { CalendarProvider, CalendarConsumer } from "../../contexts/calendar";

/**
 * Displays a schedule, events, activities, openings and participants.
 * Provides a way for participants to apply or unapply to openings.
 */
export const Schedule = () => {
  return (
    <ParticipantProvider>
      <CalendarProvider>
        <CalendarConsumer>
          {([state]) => (
            <Container className="background">
              <Row>
                <Col>
                  <img className="logo" src={coEventLogoWh} alt="CoEvent" />
                  <h1 className="valueProp">{state.calendar?.name}</h1>
                </Col>
              </Row>
              <Row>
                <Col>
                  <CardDeck>
                    {state.calendar.events.map((event: IEvent) => {
                      return (
                        <EventCard key={event.id} event={event}></EventCard>
                      );
                    })}
                  </CardDeck>
                </Col>
              </Row>
            </Container>
          )}
        </CalendarConsumer>
      </CalendarProvider>
    </ParticipantProvider>
  );
};

export default Schedule;

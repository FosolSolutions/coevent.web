import React from "react";
import coEventLogoWh from "../../content/logos/coEventLogoWh.svg";
import AjaxContext from "contexts/ajax";
import { IEvent, ICalendar } from "services";
import { CardDeck, Container, Row, Col } from "react-bootstrap";
import { ParticipantProvider } from "../../contexts/participant/ParticipantContext";
import { EventCard, getSchedule } from ".";

/**
 * Displays a schedule, events, activities, openings and participants.
 * Provides a way for participants to apply or unapply to openings.
 */
export const Schedule = () => {
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
      <section className="background">
        <Container
          style={{
            width: "100vw",
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "100vw",
          }}
        >
          <Row>
            <Col>
              <img className="logo" src={coEventLogoWh} alt="CoEvent" />
              <h1 className="valueProp">{calendar?.name}</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <CardDeck>
                {calendar.events.map((event: IEvent) => {
                  return <EventCard key={event.id} event={event}></EventCard>;
                })}
              </CardDeck>
            </Col>
          </Row>
        </Container>
      </section>
    </ParticipantProvider>
  );
};

export default Schedule;

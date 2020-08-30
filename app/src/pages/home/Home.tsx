import React from "react";
import coEventLogoWh from "../../content/logos/coEventLogoWh.svg";
import AjaxContext from "contexts/ajax";
import { DataCalendarsRoutes, DataEventsRoutes } from "services";
import Constants from "../../settings/Constants";
import { Card, CardDeck, Container, Row, Col } from "react-bootstrap";
import moment from "moment";

interface ICalendar {
  id: number;
  name?: string;
  events: IEvent[];
}

interface IEvent {
  id: number;
  key: string;
  calendarId: number;
  name: string;
  description?: string;
  startOn: Date;
  endOn: Date;
  state: number;
  activities: [];
  criteria: [];
}

export default () => {
  const [calendar, setCalendar] = React.useState({
    id: 0,
    events: [] as IEvent[],
  } as ICalendar);
  const [, , ajax] = React.useContext(AjaxContext);

  React.useEffect(() => {
    ajax
      .get(
        DataCalendarsRoutes.get(
          Constants.calendarId,
          Constants.startOn,
          Constants.endOn
        )
      )
      .then(async (response) => {
        const data = (await response.json()) as ICalendar;
        setCalendar((s) => {
          return {
            ...s,
            ...data,
          };
        });

        const eventIds = data.events.map((event) => event.id);

        ajax
          .get(DataEventsRoutes.getEvents(eventIds))
          .then(async (response) => {
            const data = (await response.json()) as IEvent[];
            setCalendar((s) => {
              return {
                ...s,
                events: [...data],
              };
            });
          });
      });
  }, [calendar.id]);
  return (
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
  );
};

interface IEventCardProps {
  event: IEvent;
}

const EventCard = (props: IEventCardProps) => {
  return (
    <Card className="p-3" style={{ minWidth: "250px" }}>
      <Card.Header>
        {moment(props.event.startOn).format("MMM dddd DD")}
      </Card.Header>
      <Card.Body>
        <Card.Text>{props.event.name}</Card.Text>
      </Card.Body>
    </Card>
  );
};

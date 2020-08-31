import React from "react";
import coEventLogoWh from "../../content/logos/coEventLogoWh.svg";
import AjaxContext from "contexts/ajax";
import {
  DataCalendarsRoutes,
  DataEventsRoutes,
  DataOpeningsRoutes,
  AuthRoutes,
  IParticipant,
  IEvent,
  ICalendar,
  IOpening,
} from "services";
import Constants from "../../settings/Constants";
import { CardDeck, Container, Row, Col } from "react-bootstrap";
import ParticipantContext, { IParticipantContext } from "./ParticipantContext";
import { EventCard } from ".";

export default () => {
  const [, , ajax] = React.useContext(AjaxContext);
  const [participant, setParticipant] = React.useState<IParticipantContext>({});

  React.useEffect(() => {
    ajax.get(AuthRoutes.identity()).then(async (response) => {
      const data = (await response.json()) as IParticipant;
      setParticipant((s) => {
        return { ...s, participant: data };
      });
    });
  }, []);

  const [calendar, setCalendar] = React.useState({
    id: 0,
    events: [] as IEvent[],
  } as ICalendar);

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
        const calendar = (await response.json()) as ICalendar;
        const eventIds = calendar.events.map((event) => event.id);

        ajax
          .get(DataEventsRoutes.getEvents(eventIds))
          .then(async (response) => {
            const events = (await response.json()) as IEvent[];
            const sorted = events.sort((e1, e2) => {
              if (e1.startOn < e2.startOn) return -1;
              if (e1.startOn > e2.startOn) return 1;
              return 0;
            });

            ajax
              .get(
                DataOpeningsRoutes.getOpeningsForCalendar(
                  Constants.calendarId,
                  Constants.startOn,
                  Constants.endOn
                )
              )
              .then(async (response) => {
                const openings = (await response.json()) as IOpening[];
                const events = sorted.map((event) => {
                  return {
                    ...event,
                    activities: [
                      ...event.activities.map((activity) => {
                        return {
                          ...activity,
                          openings: [
                            ...activity.openings.map((opening) => {
                              // find the matching opening returned from the ajax request.
                              const fo = openings.find(
                                (o) => o.id === opening.id
                              );
                              return fo ? fo : opening;
                            }),
                          ],
                        };
                      }),
                    ],
                  };
                });
                setCalendar((s) => {
                  return {
                    ...s,
                    ...calendar,
                    events: [...events],
                  };
                });
              });
          });
      });
  }, [calendar.id]);
  return (
    <ParticipantContext.Provider value={participant}>
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
    </ParticipantContext.Provider>
  );
};

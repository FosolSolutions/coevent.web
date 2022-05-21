import React from 'react';
import './Schedule.scss';
import coEventLogoWh from '../../../content/logos/coEventLogoWh.svg';
import { Container, Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap';
import { ParticipantProvider } from '../../../contexts/participant/ParticipantContext';
import { SundayMeetings, BibleClasses, HallCleaning, SundaySchool } from '.';
import { CalendarProvider, CalendarConsumer } from '../../../contexts/calendar';
import { InformationDialog } from 'components/dialog/InformationDialog';

/**
 * Displays a schedule, events, activities, openings and participants.
 * Provides a way for participants to apply or unapply to openings.
 */
export const VictoriaSchedule = () => {
  const [showInformationDialog, setShowInformationDialog] = React.useState(true);
  return (
    <ParticipantProvider>
      <InformationDialog
        show={showInformationDialog}
        onClose={() => setShowInformationDialog(false)}
      ></InformationDialog>
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
                    <Tab eventKey="school" title="Sunday School">
                      <SundaySchool events={state.calendar.events}></SundaySchool>
                    </Tab>
                    <Tab eventKey="sunday" title="Memorial and Bible Talk">
                      <button
                        className="btn btn-warning btn-lg btn-block"
                        onClick={() => setShowInformationDialog(true)}
                      >
                        Volunteers at Hall
                      </button>
                      <SundayMeetings events={state.calendar.events}></SundayMeetings>
                    </Tab>
                    <Tab eventKey="bibleClasses" title="Bible Classes">
                      <BibleClasses events={state.calendar.events}></BibleClasses>
                    </Tab>
                    <Tab eventKey="cleaning" title="Hall Cleaning">
                      <HallCleaning events={state.calendar.events}></HallCleaning>
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

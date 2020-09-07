import React from "react";
import {
  IActivity,
  IOpening,
  DataOpeningsRoutes,
  IAnswer,
  IEvent,
} from "../../services";
import { Form } from "react-bootstrap";
import { ApplicationModal, OpeningParticipantCard } from ".";
import ParticipantContext from "../../contexts/participant";
import moment from "moment";
import CalendarContext from "contexts/calendar";
import { Oauth } from "../../services/ajax";

export interface IOpeningCardProps {
  /** The event this opening belongs to. */
  event: IEvent;
  /** The event activity for this opening. */
  activity: IActivity;
  /** The opening for the activity. */
  opening: IOpening;
  /** Whether to show the opening name. */
  showTitle?: boolean;
  /** Whether applications can be submitted to this activity. */
  showApply?: boolean;
}

/**
 * Display the opening, the participants who have applied and the ability for the current participant to apply.
 * @param props Component properties
 * @param props.event The event this opening belongs to.
 * @param props.activity The activity this opening belongs to.
 * @param props.opening The opening for the activity.
 * @param props.showTitle Whether to show the opening name.
 * @param props.showApply Whether applications can be submitted to this activity.
 */
export const OpeningCard = (props: IOpeningCardProps) => {
  const participant = React.useContext(ParticipantContext);
  const [calendar] = React.useContext(CalendarContext);
  const [data, setData] = React.useState({
    show: false,
    activity: props.activity,
    opening: props.opening,
  });

  /**
   * Apply the current participant to the opening.
   * @param e The click event to apply.
   */
  const apply = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    const response = await Oauth.get(DataOpeningsRoutes.get(data.opening.id));
    const opening = (await response.json()) as IOpening;
    // It has already been filled by someone else.
    if (opening.maxParticipants <= opening.participants.length) {
      setData((s) => {
        return { ...s, opening: opening };
      });
    } else if (!opening.questions.length) {
      return submitApplication();
    } else {
      setData((s) => {
        return { ...s, opening: opening, show: true };
      });
    }
    return Promise.resolve();
  };

  /**
   * Unapply the current participant from the opening.
   * @param e The click event to unapply.
   */
  const unapply = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    const response = await Oauth.put(
      DataOpeningsRoutes.unapply(),
      data.opening
    );
    const opening = (await response.json()) as IOpening;
    setData((s) => {
      return { ...s, opening: opening };
    });

    unapplyToOtherOpenings(["Preside", "Presider"]);
  };

  /**
   * Submit an application for the opening.
   * Include answers to the questions (if there are any).
   * @param answers An array of answers.
   */
  const submitApplication = async (answers?: IAnswer[]) => {
    const application = {
      openingId: data.opening.id,
      answers: answers,
      rowVersion: data.opening.rowVersion,
    };

    try {
      const response = await Oauth.put(DataOpeningsRoutes.apply(), application);
      const opening = (await response.json()) as IOpening;

      setData((s) => {
        return { ...s, opening: opening, show: false };
      });

      // If the application is for presiding, then submit for all presiding events in the same week.
      if (data.opening.name === "Preside") {
        applyToOtherOpenings(["Preside", "Presider"]);
      }

      return opening;
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Find all events for this week that have a 'Preside' opening.
   * @param activityNames An array of activity names to find related openings.
   */
  const findOtherOpenings = (activityNames: string[]) => {
    const startOn = moment(props.event.startOn).week();
    // Find all events for this week that have a 'Preside' opening.
    const events = calendar.calendar.events.filter((e) => {
      return (
        e.id !== data.activity.eventId &&
        startOn === moment(e.startOn).week() &&
        e.activities.some((a) => activityNames.some((n) => n === a.name))
      );
    });
    return events
      .map((e, ei) =>
        e.activities.map((a, ai) => ({
          eventIndex: ei,
          activityIndex: ai,
          activity: a,
        }))
      )
      .reduce((a, b) => a.concat(b))
      .filter((a) => activityNames.some((n) => n === a.activity.name))
      .map((a) =>
        a.activity.openings.map((o, oi) => ({
          ...a,
          openingIndex: oi,
          opening: o,
        }))
      )
      .reduce((a, b) => a.concat(b));
  };

  /**
   *
   * @param activityNames
   * @param answers
   */
  const applyToOtherOpenings = async (
    activityNames: string[],
    answers?: IAnswer[]
  ): Promise<any> => {
    const openings = findOtherOpenings(activityNames);

    Promise.all(
      openings.map(async (o) => {
        try {
          // @ts-ignore
          const eres = await Oauth.put(DataOpeningsRoutes.apply(), {
            openingId: o.opening.id,
            answers: answers,
            rowVersion: o.opening.rowVersion,
          });
        } catch (e) {
          // Ignore error at this point in time.
          console.log(e);
        }
      })
    );
  };

  /**
   *
   * @param activityNames
   */
  const unapplyToOtherOpenings = async (
    activityNames: string[]
  ): Promise<any> => {
    const openings = findOtherOpenings(activityNames);

    Promise.all(
      openings.map(async (o) => {
        try {
          // @ts-ignore
          const eres = await Oauth.put(DataOpeningsRoutes.unapply(), o.opening);
        } catch (e) {
          // Ignore error at this point in time.
          console.log(e);
        }
      })
    );
  };

  // Whether this opening can still be applied to.
  const isOpen =
    data.opening.maxParticipants > data.opening.participants.length &&
    !data.opening.participants.some(
      (p) => p.id === participant.participant?.id
    );
  return (
    <Form.Group>
      <div>
        {props.showTitle ? (
          <span className="opening-label">{data.opening.name}:</span>
        ) : null}

        {data.show ? (
          <ApplicationModal
            show={data.show}
            hide={() =>
              setData((s) => {
                return { ...s, show: false };
              })
            }
            opening={data.opening}
            apply={submitApplication}
          ></ApplicationModal>
        ) : null}

        {data.opening.participants.map((p) => {
          return (
            <OpeningParticipantCard
              key={p.id}
              activity={data.activity}
              opening={data.opening}
              participant={p}
              isOpen={isOpen}
              apply={apply}
              unapply={unapply}
              showApply={props.showApply}
            ></OpeningParticipantCard>
          );
        })}
        <OpeningParticipantCard
          activity={data.activity}
          opening={data.opening}
          isOpen={isOpen}
          apply={apply}
          showApply={props.showApply}
        ></OpeningParticipantCard>
      </div>
    </Form.Group>
  );
};

OpeningCard.defaultProps = {
  showTitle: true,
};

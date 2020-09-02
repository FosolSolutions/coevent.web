import React from "react";
import {
  IActivity,
  IOpening,
  DataOpeningsRoutes,
  IAnswer,
} from "../../services";
import AjaxContext from "../../contexts/ajax";
import { Form } from "react-bootstrap";
import { ApplicationModal, OpeningParticipantCard } from ".";
import ParticipantContext from "../../contexts/participant";

export interface IOpeningCardProps {
  /** The event activity for this opening. */
  activity: IActivity;
  /** The opening for the activity. */
  opening: IOpening;
  /** Whether to show the opening name. */
  showTitle?: boolean;
}

/**
 * Display the opening, the participants who have applied and the ability for the current participant to apply.
 * @param props Component properties
 * @param props.activity The event activity for this opening.
 * @param props.opening The opening for the activity.
 */
export const OpeningCard = (props: IOpeningCardProps) => {
  const participant = React.useContext(ParticipantContext);
  const [, , ajax] = React.useContext(AjaxContext);
  const [data, setData] = React.useState({
    show: false,
    activity: props.activity,
    opening: props.opening,
  });

  /**
   * Apply the current participant to the opening.
   * @param e The click event to apply.
   */
  const apply = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    ajax.get(DataOpeningsRoutes.get(data.opening.id)).then(async (response) => {
      const data = (await response.json()) as IOpening;

      // It has already been filled by someone else.
      if (data.maxParticipants <= data.participants.length) {
        setData((s) => {
          return { ...s, opening: data };
        });
      } else if (!data.questions.length) {
        answerQuestions();
      } else {
        setData((s) => {
          return { ...s, opening: data, show: true };
        });
      }
    });
  };

  /**
   * Unapply the current participant from the opening.
   * @param e The click event to unapply.
   */
  const unapply = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    ajax
      .put(DataOpeningsRoutes.unapply(), data.opening)
      .then(async (response) => {
        const data = (await response.json()) as IOpening;

        setData((s) => {
          return { ...s, opening: data };
        });
      });
  };

  /**
   * Submit the answers to the questions.
   * @param answers An array of answers.
   */
  const answerQuestions = (answers?: IAnswer[]) => {
    const application = {
      openingId: data.opening.id,
      answers: answers,
      rowVersion: data.opening.rowVersion,
    };

    ajax
      .put(DataOpeningsRoutes.apply(), application)
      .then(async (response) => {
        const data = (await response.json()) as IOpening;

        setData((s) => {
          return { ...s, opening: data, show: false };
        });
      })
      .catch(() => {});
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
        {props.showTitle ? <span>{data.opening.name}:</span> : null}

        {data.show ? (
          <ApplicationModal
            show={data.show}
            hide={() =>
              setData((s) => {
                return { ...s, show: false };
              })
            }
            opening={data.opening}
            apply={answerQuestions}
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
            ></OpeningParticipantCard>
          );
        })}
        <OpeningParticipantCard
          activity={data.activity}
          opening={data.opening}
          isOpen={isOpen}
          apply={apply}
        ></OpeningParticipantCard>
      </div>
    </Form.Group>
  );
};

OpeningCard.defaultProps = {
  showTitle: true,
};

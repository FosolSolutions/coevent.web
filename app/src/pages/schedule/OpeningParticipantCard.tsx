import React from "react";
import { IOpening, IParticipant, ICriteria, IActivity } from "../../services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import ParticipantContext from "../../contexts/participant";
import { Button, Spinner } from "react-bootstrap";

export interface IOpeningParticipantCardProps {
  /** The activity this opening applies to */
  activity: IActivity;
  /** The opening the participant can apply to */
  opening: IOpening;
  /** The participant who is currently involved in this opening */
  participant?: IParticipant;
  /** Whether the opening is available to the participant */
  isOpen: boolean;
  /** The function to call to apply to the opportunity */
  apply: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLElement, MouseEvent>
  ) => Promise<any>;
  /** The function to call to unapply from the opportunity */
  unapply?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLElement, MouseEvent>
  ) => Promise<any>;
}

/**
 * Displays current participants for the opening and provides a way to apply to participate to the opening.
 * @param props Component props
 * @param props.activity The activity this opening applies to
 * @param props.opening The opening the participant can apply to
 * @param [props.participant] The participant who is currently involved in this opening
 * @param props.isOpen Whether the opening is available to the participant
 * @param props.apply The function to call to apply to the opportunity
 * @param [props.unapply] The function to call to unapply from the opportunity
 */
export const OpeningParticipantCard = (props: IOpeningParticipantCardProps) => {
  const participant = React.useContext(ParticipantContext);
  const [state, setState] = React.useState({
    loading: false,
  });

  // Find the application for the specified participant.
  const participantApplication = props.opening.applications.find(
    (a) => a.participant.id === props.participant?.id
  );

  const convertValue = (type: string, value: string) => {
    switch (type) {
      case "System.Boolean":
        return Boolean(value);
      case "System.Int32":
      case "System.Int64":
      case "System.Float":
      case "System.Double":
      case "System.Decimal":
        return Number(value);
      case "System.DateTime":
        return new Date(value);
      default:
        return value;
    }
  };

  const validateCriteria = (participant: IParticipant, criteria: ICriteria) => {
    return criteria.conditions.every((con) =>
      participant.attributes.some(
        (a) =>
          a.key === con.key &&
          convertValue(a.valueType, a.value) ===
            convertValue(con.valueType, con.value)
      )
    );
  };

  // Whether the currently logged in participant can apply to this opening.
  const canApply = props.activity.criteria.every((c) =>
    validateCriteria(participant.participant as IParticipant, c)
  );

  // Whether the currently logged in participant can unapply to this opening.
  const canUnapply = participant.participant?.key === props.participant?.key;
  return (
    <div>
      <div className="opening-participant">
        <span>{props.participant?.displayName ?? ""}</span>

        {canUnapply ? (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tt-o${props.opening.id}-p${props.participant?.id}`}>
                Unapply
              </Tooltip>
            }
          >
            <Button
              as="a"
              variant="danger"
              onClick={(e) => {
                if (props.unapply) {
                  setState((s) => {
                    return { ...s, loading: true };
                  });
                  props.unapply(e).finally(() =>
                    setState((s) => {
                      return { ...s, loading: false };
                    })
                  );
                }
              }}
              title="unapply"
              size="sm"
              disabled={state.loading}
            >
              {state.loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  area-hidden="true"
                ></Spinner>
              ) : (
                <FontAwesomeIcon icon={faMinusCircle} />
              )}
            </Button>
          </OverlayTrigger>
        ) : !props.participant && props.isOpen && canApply ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tt-o${props.opening.id}`}>Apply</Tooltip>}
          >
            <Button
              as="a"
              variant="light"
              onClick={(e) => {
                setState((s) => {
                  return { ...s, loading: true };
                });
                props.apply(e).finally(() => {
                  setState((s) => {
                    return { ...s, loading: false };
                  });
                });
              }}
              title="apply"
              size="sm"
              disabled={state.loading}
            >
              {state.loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  area-hidden="true"
                ></Spinner>
              ) : (
                <FontAwesomeIcon icon={faPlusCircle} />
              )}
            </Button>
          </OverlayTrigger>
        ) : null}
      </div>

      {participantApplication?.answers?.length ? (
        <p className="text-muted">
          {participantApplication.answers.map((a) => (
            <span key={a.questionId}>{a.text}</span>
          ))}
        </p>
      ) : null}
    </div>
  );
};

OpeningParticipantCard.defaultProps = {
  unapply: () => {},
};

export default OpeningParticipantCard;

import React from "react";
import { IOpening, IParticipant, ICriteria, IActivity } from "../../services";
import IdentityContext from "../../contexts/identity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import ParticipantContext from "./ParticipantContext";

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
  apply: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  /** The function to call to unapply from the opportunity */
  unapply?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
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
  const [identity] = React.useContext(IdentityContext);
  const participant = React.useContext(ParticipantContext);

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

  const validateCriteria = (criteria: ICriteria) => {
    return criteria.conditions.every((con) =>
      participant.participant?.attributes.some(
        (a) =>
          a.key === con.key &&
          convertValue(a.valueType, a.value) ===
            convertValue(con.valueType, con.value)
      )
    );
  };

  // This means the participant is allowed to apply.
  const canApply =
    props.participant && props.activity.criteria.every(validateCriteria);
  return (
    <div>
      {props.participant ? <span>{props.participant.displayName}</span> : null}

      {identity.key === props.participant?.key ? (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tt-o${props.opening.id}-p${props.participant?.id}`}>
              Unapply
            </Tooltip>
          }
        >
          <a
            href={`#unapply-o${props.opening.id}`}
            onClick={props.unapply}
            style={{ color: "red" }}
          >
            <FontAwesomeIcon icon={faMinusCircle} />
          </a>
        </OverlayTrigger>
      ) : !props.participant && props.isOpen && canApply ? (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tt-o${props.opening.id}`}>Apply</Tooltip>}
        >
          <a href="#apply" onClick={props.apply} title="apply">
            <FontAwesomeIcon icon={faPlusCircle} />
          </a>
        </OverlayTrigger>
      ) : null}

      {participantApplication?.answers?.length ? (
        <p className="text-muted">
          {participantApplication.answers.map((a) => (
            <span>{a.text}</span>
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

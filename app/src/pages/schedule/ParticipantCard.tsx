import React from "react";
import { IOpening, IParticipant } from "../../services";
import IdentityContext from "../../contexts/identity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";

export interface IParticipantCardProps {
  opening: IOpening;
  isOpen: boolean;
  canApply: boolean;
  participant: IParticipant;
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const ParticipantCard = (props: IParticipantCardProps) => {
  const [identity] = React.useContext(IdentityContext);
  return (
    <div>
      <span>{props.participant.displayName}</span>
      {identity.key === props.participant.key ? (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tt-o${props.opening.id}-p${props.participant.id}`}>
              Unapply
            </Tooltip>
          }
        >
          <a
            href={`#unapply-${props.opening.id}`}
            onClick={props.onClick}
            style={{ color: "red" }}
          >
            <FontAwesomeIcon icon={faMinusCircle} />
          </a>
        </OverlayTrigger>
      ) : null}
    </div>
  );
};

export default ParticipantCard;

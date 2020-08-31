import React from "react";
import {
  IActivity,
  IOpening,
  DataOpeningsRoutes,
  IAnswer,
  ICriteria,
} from "../../services";
import AjaxContext from "../../contexts/ajax";
import { Form, Tooltip, OverlayTrigger } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { ApplicationModal } from ".";
import ParticipantContext from "./ParticipantContext";

export interface IOpeningCardProps {
  activity: IActivity;
  opening: IOpening;
}

export const OpeningCard = (props: IOpeningCardProps) => {
  const participant = React.useContext(ParticipantContext);
  const [data, setData] = React.useState({
    show: false,
    activity: props.activity,
    opening: props.opening,
  });
  const [, , ajax] = React.useContext(AjaxContext);

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    if (!isApply) {
      ajax
        .put(DataOpeningsRoutes.unapply(), data.opening)
        .then(async (response) => {
          const data = (await response.json()) as IOpening;

          setData((s) => {
            return { ...s, opening: data };
          });
        });
    } else {
      ajax
        .get(DataOpeningsRoutes.get(data.opening.id))
        .then(async (response) => {
          const data = (await response.json()) as IOpening;

          // It has already been filled by someone else.
          if (data.maxParticipants <= data.participants.length) {
            setData((s) => {
              return { ...s, opening: data };
            });
            return;
          }

          if (!data.questions.length) {
            apply();
          } else {
            setData((s) => {
              return { ...s, opening: data, show: true };
            });
          }
        });
    }
  };

  const apply = (answers?: IAnswer[]) => {
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

  const isApply =
    data.opening.maxParticipants > data.opening.participants.length &&
    !data.opening.participants.some(
      (p) => p.id === participant.participant?.id
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

  const canApply = data.activity.criteria.every(validateCriteria);
  return (
    <Form.Group>
      <div>
        <span>{data.opening.name}:</span>
        {data.show ? (
          <ApplicationModal
            show={data.show}
            hide={() =>
              setData((s) => {
                return { ...s, show: false };
              })
            }
            opening={data.opening}
            apply={apply}
          ></ApplicationModal>
        ) : null}

        {isApply && canApply ? (
          <>
            {data.opening.participants.map((p) => {
              return (
                <div key={p.id}>
                  <span>{p.displayName}</span>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tt-o${data.opening.id}-p${p.id}`}>
                        Unapply
                      </Tooltip>
                    }
                  >
                    <a
                      href="#apply"
                      onClick={handleClick}
                      style={{ color: "red" }}
                    >
                      <FontAwesomeIcon icon={faMinusCircle} />
                    </a>
                  </OverlayTrigger>
                </div>
              );
            })}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tt-o${data.opening.id}`}>Apply</Tooltip>}
            >
              <a href="#apply" onClick={handleClick} title="apply">
                <FontAwesomeIcon icon={faPlusCircle} />
              </a>
            </OverlayTrigger>
          </>
        ) : data.opening.participants.length ? (
          <>
            <span>{data.opening.participants[0].displayName}</span>
            {canApply ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tt-o${data.opening.id}`}>Unapply</Tooltip>
                }
              >
                <a
                  href="#apply"
                  onClick={handleClick}
                  title="unapply"
                  style={{ color: "red" }}
                >
                  <FontAwesomeIcon icon={faMinusCircle} />
                </a>
              </OverlayTrigger>
            ) : null}
            {data.opening.applications.length ? (
              <p>{data.opening.applications[0].answers[0]?.text}</p>
            ) : null}
          </>
        ) : null}
      </div>
    </Form.Group>
  );
};

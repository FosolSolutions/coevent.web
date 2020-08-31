import React from "react";
import { IOpening, IAnswer } from "../../services";
import { Modal, Form, Button } from "react-bootstrap";

export interface IApplicationModalProps {
  show: boolean;
  opening: IOpening;
  hide: () => void;
  apply: (answers: IAnswer[]) => void;
}

export const ApplicationModal = (props: IApplicationModalProps) => {
  const defaultAnswers = props.opening.questions.map((q) => {
    return {
      openingId: props.opening.id,
      questionId: q.id,
      participantId: 1,
      text: "",
      options: [],
    } as IAnswer;
  });
  const [application, setApplication] = React.useState<IAnswer[]>(
    defaultAnswers
  );

  const handleHide = () => {
    setApplication(defaultAnswers);
    props.hide();
  };

  const handleChange = (index: number, answer: string) => {
    setApplication((s) => {
      return [
        ...s.splice(0, index),
        { ...s[index], text: answer },
        ...s.splice(index + 1),
      ];
    });
  };

  return (
    <Modal show={props.show} onHide={handleHide}>
      <Form>
        <Modal.Header>
          <Modal.Title>{props.opening.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.opening.questions.map((question, index) => {
            return (
              <Form.Group key={question.id}>
                <Form.Label>{question.text}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={question.caption}
                  value={application[index].text}
                  onChange={(e) => handleChange(index, e.currentTarget.value)}
                ></Form.Control>
              </Form.Group>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHide}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              props.apply(application);
            }}
          >
            Apply
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export interface IInformationDialogProps {
  show?: boolean;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  onClose?: () => void;
}

const defaultProps: IInformationDialogProps = {
  show: false,
  closeOnEscape: true,
  closeOnClickOutside: true,
  onClose: () => {},
};

export const InformationDialog = (props: IInformationDialogProps) => {
  props = { ...defaultProps, ...props };
  if (!props.show) return null;
  return (
    <div className="react-confirm-alert-overlay" onClick={props.onClose}>
      <div className="react-confirm-alert">
        <div className="react-confirm-alert-body">
          <h1>Presiders and Speakers</h1>
          <p>
            As a way to encourage fellowship and discussion around the word of God,
            <strong>
              we ask those brethren willing to preside and speak to do so live from the hall.
            </strong>
            Our goal is to encourage all members to attend the hall as it becomes more widely
            accessible. All this is predicated upon BC Health Guidelines, subject to the will of our
            Heavenly Father.
          </p>
          <p>
            We will continue to support both the online and at hall format, which will enable us to
            transition appropriately and support our memberships needs.
          </p>
          <p>
            If you have any questions or feedback, please reach out to any of the arranging
            brethren.
          </p>
          <p>
            <i>And you are the body of Christ, and members in part. (1Co 12:27)</i>
          </p>
          <div className="react-confirm-alert-button-group" style={{ justifyContent: 'center' }}>
            <button onClick={props.onClose}>OK</button>
          </div>
        </div>
      </div>
    </div>
  );
};

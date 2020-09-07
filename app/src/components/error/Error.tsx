import React from "react";
import { Alert } from "react-bootstrap";
import { AppContext } from "../../contexts/app";

export const Error: React.FC = () => {
  const [app, setApp] = React.useContext(AppContext);

  return (
    <>
      {!!app.error ? (
        <Alert
          variant="danger"
          onClose={() =>
            setApp((s) => {
              return { ...s, error: undefined };
            })
          }
          dismissible
        >
          <Alert.Heading>Error</Alert.Heading>
          {app.errorMessage}
        </Alert>
      ) : null}
    </>
  );
};

export default Error;

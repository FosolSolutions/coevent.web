import React from "react";
import { Alert } from "react-bootstrap";
import AjaxContext from "../../contexts/ajax";

export const Error: React.FC = () => {
  const [ajax, setAjax] = React.useContext(AjaxContext);
  return (
    <>
      {!!ajax.error ? (
        <Alert
          variant="danger"
          onClose={() =>
            setAjax((s) => {
              return { ...s, error: undefined };
            })
          }
          dismissible
        >
          <Alert.Heading>Error</Alert.Heading>
          {ajax.error}
        </Alert>
      ) : (
        ""
      )}
    </>
  );
};

export default Error;

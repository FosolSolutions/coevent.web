import React from "react";
import { Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useTypedSelector, clearError } from "../../reduxStore";

export const Error: React.FC = () => {
  const dispatch = useDispatch();
  const error = useTypedSelector((s) => s.error);
  return (
    <>
      {!!error.error ? (
        <Alert
          variant="danger"
          onClose={() => {
            dispatch(clearError());
          }}
          dismissible
        >
          <Alert.Heading>Error</Alert.Heading>
          {error.message}
        </Alert>
      ) : null}
    </>
  );
};

export default Error;

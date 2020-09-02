import React from "react";
import IdentityContext from "../../contexts/identity";
import { Route, Redirect, RouteProps, useLocation } from "react-router-dom";

export const PrivateRoute = (props: RouteProps) => {
  const [identity] = React.useContext(IdentityContext);
  const location = useLocation();

  return (
    <>
      {identity.isAuthenticated || location.pathname === "/login" ? (
        <Route {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )}
    </>
  );
};

export default PrivateRoute;

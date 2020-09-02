import React from "react";
import IdentityContext from "../../contexts/identity";
import { Route, Redirect, RouteProps, useLocation } from "react-router-dom";

export interface IPrivateRouteProps extends RouteProps {
  login: string;
}

/**
 * If the user is not authenticated, redirect to the login page.
 * By default this is '/login'.
 * @param props Route properties.
 */
export const PrivateRoute = (props: IPrivateRouteProps) => {
  const [identity] = React.useContext(IdentityContext);
  const location = useLocation();

  return (
    <>
      {identity.isAuthenticated || location.pathname === props.login ? (
        <Route {...props} />
      ) : (
        <Redirect
          to={{ pathname: props.login, state: { from: props.location } }}
          push={true}
        />
      )}
    </>
  );
};

PrivateRoute.defaultProps = {
  login: "/login",
};

export default PrivateRoute;

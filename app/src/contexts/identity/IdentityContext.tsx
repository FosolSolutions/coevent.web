import React from "react";
import IIdentity from "./IIdentity";
import { AuthRoutes } from "services";
import { Oauth } from "services/ajax";
import { generateIdentity } from ".";
import { useDispatch } from "react-redux";
import { setError } from "../../reduxStore";

export const defaultIdentity = {
  isAuthenticated: false,
} as IIdentity;

const IdentityContext = React.createContext<
  [IIdentity, React.Dispatch<React.SetStateAction<IIdentity>>]
>([defaultIdentity, () => {}]);

/**
 * An IdentityProvider keeps track of the current user's identity.
 * Whether they're authenticated or not.
 * The IdentityContext is dependent upon the `Oauth` service.
 * @param props Children components.
 */
export const IdentityProvider = (props?: React.PropsWithChildren<any>) => {
  const [auth, setAuth] = React.useState(generateIdentity(Oauth.getToken()));
  const dispatch = useDispatch();

  Oauth.init({
    onFailure: (error: any) => {
      dispatch(setError(error));
      return Promise.reject(error);
    },
  });

  Oauth.initOauth({
    refreshTokenUrl: AuthRoutes.refresh(),
    onAuthenticate: (oauth) => {
      // When authentication event fires, update state.
      if (oauth.isAuthenticated()) {
        setAuth(generateIdentity(oauth.getToken()));
      } else {
        setAuth((s) => ({ ...s, isAuthenticated: false }));
      }
    },
  });

  return (
    <IdentityContext.Provider value={[auth, setAuth]}>
      {props.children}
    </IdentityContext.Provider>
  );
};

export const IdentityConsumer = IdentityContext.Consumer;
export default IdentityContext;

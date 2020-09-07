import React from "react";
import IIdentity from "./IIdentity";
import { AuthRoutes } from "services";
import { Oauth } from "services/ajax";
import { generateIdentity } from ".";

export const defaultIdentity = {
  isAuthenticated: false,
} as IIdentity;

const IdentityContext = React.createContext<
  [IIdentity, React.Dispatch<React.SetStateAction<IIdentity>>]
>([defaultIdentity, () => {}]);

export const IdentityProvider = (props?: React.PropsWithChildren<any>) => {
  const [auth, setAuth] = React.useState(generateIdentity(Oauth.getToken()));

  Oauth.initOauth({
    refreshTokenUrl: AuthRoutes.refresh(),
    onAuthenticate: (oauth) => {
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

import React from "react";
import IIdentity from "./IIdentity";
import { useCookies } from "react-cookie";
import generateIdentity from "./generateIdentity";
import { IToken } from "services";

export const CookieName = "auth-cookie";

export const defaultIdentity = {
  isAuthenticated: false,
} as IIdentity;

export const login = (
  token: IToken,
  useCookies: [any, any, any],
  useContext: [IIdentity, React.Dispatch<React.SetStateAction<IIdentity>>]
) => {
  // Parse the cookie and update the identity.
  const [, setCookie] = useCookies;
  setCookie(CookieName, token, {
    maxAge: token.refreshExpiresIn,
  });
  const [, setIdentity] = useContext;
  const identity = generateIdentity(token);
  setIdentity(identity);
};

const IdentityContext = React.createContext<
  [
    IIdentity,
    React.Dispatch<React.SetStateAction<IIdentity>>,
    (
      token: IToken,
      useContext: [IIdentity, React.Dispatch<React.SetStateAction<IIdentity>>]
    ) => void
  ]
>([defaultIdentity, () => {}, () => {}]);

export const IdentityProvider = (props?: React.PropsWithChildren<any>) => {
  // Parse the cookie and update the identity.
  const [cookies, setCookies, removeCookies] = useCookies([CookieName]);
  const cookie = cookies[CookieName];
  const identity = cookie ? generateIdentity(cookie) : defaultIdentity;
  const [auth, setAuth] = React.useState(identity);

  const _login = (token: IToken) =>
    login(token, [cookies, setCookies, removeCookies], [auth, setAuth]);

  return (
    <IdentityContext.Provider value={[auth, setAuth, _login]}>
      {props.children}
    </IdentityContext.Provider>
  );
};
export const IdentityConsumer = IdentityContext.Consumer;
export default IdentityContext;

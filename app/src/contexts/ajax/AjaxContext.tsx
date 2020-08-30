import React from "react";
import IAjaxFactory from "./IAjaxFactory";
import { ajaxFactory } from "./AjaxFactory";
import IdentityContext from "../identity";

export const CookieName = "auth-cookie";

export interface IAjaxState {
  error: string | any;
  requestCount: number;
}

export const defaultAjaxState = {
  requestCount: 0,
} as IAjaxState;

const AjaxContext = React.createContext<
  [IAjaxState, React.Dispatch<React.SetStateAction<IAjaxState>>, IAjaxFactory]
>([defaultAjaxState, () => {}, ajaxFactory()]);

export const AjaxProvider = (props?: React.PropsWithChildren<any>) => {
  const [ajaxState, setAjaxState] = React.useState(defaultAjaxState);
  const [identity, setIdentity, login] = React.useContext(IdentityContext);

  return (
    <AjaxContext.Provider
      value={[
        ajaxState,
        setAjaxState,
        ajaxFactory({
          tokenUrl: props.tokenUrl,
          refreshUrl: props.refreshUrl,
          ajaxContext: [ajaxState, setAjaxState],
          identityContext: [identity, setIdentity, login],
        }),
      ]}
    >
      {props.children}
    </AjaxContext.Provider>
  );
};
export const AjaxConsumer = AjaxContext.Consumer;
export default AjaxContext;

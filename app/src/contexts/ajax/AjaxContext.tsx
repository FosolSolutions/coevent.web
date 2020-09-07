import React from "react";
import { ajaxFactory } from "./AjaxFactory";
import IdentityContext from "../identity";
import { IAjaxState, IAjaxFactory } from ".";

export const CookieName = "auth-cookie";

export const defaultAjaxState = {
  requestCount: 0,
} as IAjaxState;

const AjaxContext = React.createContext<
  [IAjaxState, React.Dispatch<React.SetStateAction<IAjaxState>>, IAjaxFactory]
>([defaultAjaxState, () => {}, ajaxFactory()]);

export const AjaxProvider = (props?: React.PropsWithChildren<any>) => {
  const [ajaxState, setAjaxState] = React.useState(defaultAjaxState);
  const [identity, setIdentity] = React.useContext(IdentityContext);

  return (
    <AjaxContext.Provider
      value={[
        ajaxState,
        setAjaxState,
        ajaxFactory({
          tokenUrl: props.tokenUrl,
          refreshUrl: props.refreshUrl,
          ajaxContext: [ajaxState, setAjaxState],
          identityContext: [identity, setIdentity],
        }),
      ]}
    >
      {props.children}
    </AjaxContext.Provider>
  );
};
export const AjaxConsumer = AjaxContext.Consumer;
export default AjaxContext;

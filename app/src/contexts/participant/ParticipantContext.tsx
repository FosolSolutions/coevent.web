import React from "react";
import { IParticipant, AuthRoutes } from "../../services";
import { Oauth } from "../../services/ajax";

export interface IParticipantContext {
  participant?: IParticipant;
}

/**
 * Returns the currently logged in participant information.
 */
const ParticipantContext = React.createContext<IParticipantContext>({});

/**
 * Makes a request to the API to get the current participant identity information.
 * Stores the participant information into context.
 * @param props Context properties
 */
export const ParticipantProvider = (props?: React.PropsWithChildren<any>) => {
  const [participant, setParticipant] = React.useState<IParticipantContext>({}); // TODO: Move this to identity.

  React.useEffect(() => {
    Oauth.get(AuthRoutes.identity())
      .then(async (response) => {
        const data = (await response.json()) as IParticipant;
        setParticipant((s) => {
          return { ...s, participant: data };
        });
      })
      .catch(() => {});
  }, []);

  return (
    <ParticipantContext.Provider value={participant}>
      {props.children}
    </ParticipantContext.Provider>
  );
};
export const ParticipantConsumer = ParticipantContext.Consumer;
export default ParticipantContext;

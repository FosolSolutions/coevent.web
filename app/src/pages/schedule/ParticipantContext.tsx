import React from "react";
import { IParticipant } from "../../services";

export interface IParticipantContext {
  participant?: IParticipant;
}
const ParticipantContext = React.createContext<IParticipantContext>({});
export default ParticipantContext;

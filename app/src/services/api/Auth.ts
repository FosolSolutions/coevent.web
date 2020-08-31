import Constants from "../../settings/Constants";

const route = `${Constants.apiUrl}/auth`;
export const Routes = {
  tokenUser: () => `${route}/token/user`,
  tokenParticipant: (key?: string) => `${route}/token/participant?key=${key}`,
  refresh: () => `${route}/refresh`,
  identity: () => `${route}/current/identity`,
};

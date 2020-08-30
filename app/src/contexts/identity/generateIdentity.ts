import { IToken, IAccessToken } from "../../services";
import IIdentity from "./IIdentity";
import JwtDecode from "jwt-decode";

/**
 * Parse the token information and generate an identity.
 * @param token The token model provided by the API.
 * @returns An new instance of an identity.
 */
const generateIdentity = (token: IToken | undefined | null): IIdentity => {
  if (!token || !token.accessToken)
    return {
      isAuthenticated: false,
    };

  const identity = !!token.accessToken
    ? (JwtDecode(token.accessToken) as IAccessToken)
    : ({} as IAccessToken);

  if (identity.exp) {
    const expiresIn = new Date(0);
    expiresIn.setUTCSeconds(identity.exp as number);
    identity.exp = identity.exp ? expiresIn : undefined;

    const notValidBefore = new Date(0);
    notValidBefore.setUTCSeconds(identity.nbf as number);
    identity.nbf = identity.nbf ? notValidBefore : undefined;

    const issuedAt = new Date(0);
    issuedAt.setUTCSeconds(identity.iat as number);
    identity.iat = identity.iat ? issuedAt : undefined;
  }

  const refresh = !!token.refreshToken
    ? (JwtDecode(token.refreshToken) as IAccessToken)
    : ({} as IAccessToken);

  if (refresh.exp) {
    const expiresIn = new Date(0);
    expiresIn.setUTCSeconds(refresh.exp as number);
    refresh.exp = refresh.exp ? expiresIn : undefined;
  }
  return {
    isAuthenticated: true,
    accessToken: token.accessToken,
    expiresIn: identity.exp as Date,
    refreshToken: token.refreshToken,
    refreshExpiresIn: refresh.exp as Date,
    scope: token.scope,
    username: identity?.unique_name,
    email: identity?.email,
    displayName: identity?.display_name,
    claims: [
      { key: "given_name", value: identity?.given_name },
      { key: "family_name", value: identity?.family_name },
    ],
  };
};

export default generateIdentity;

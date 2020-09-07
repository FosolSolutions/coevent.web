export interface IAccessToken {
  nameid: string;
  unique_name?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  display_name?: string;
  /** Not before */
  nbf?: number | Date;
  /** Expires on */
  exp?: number | Date;
  /** Issued at Time */
  iat?: number | Date;
  /** Issuer */
  iss?: string;
  /** Audience */
  aud?: string;
}

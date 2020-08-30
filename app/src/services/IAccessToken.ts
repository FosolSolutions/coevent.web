export default interface IAccessToken {
  nameid: string;
  unique_name?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  display_name?: string;
  nbf?: number | Date;
  exp?: number | Date;
  iat?: number | Date;
  iss?: string;
  aud?: string;
}

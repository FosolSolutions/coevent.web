export interface IToken {
  accessToken: string;
  expiresIn?: number | Date;
  refreshToken?: string;
  refreshExpiresIn?: number | Date;
  scope: string;
}

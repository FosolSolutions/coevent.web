import { ILogin, IToken } from "../../services";

export default interface IOauthFactory {
  token: (credentials: ILogin | string) => Promise<IToken>;
  refresh: () => Promise<IToken>;
}

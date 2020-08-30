import Constants from "../../settings/Constants";

const route = `${Constants.apiUrl}/pages`;
export const Routes = {
  list: () => `${route}`,
  get: (id: number) => `${route}/${id}`,
  getForPath: (path: string) => `${route}/path?path=${path}`,
};

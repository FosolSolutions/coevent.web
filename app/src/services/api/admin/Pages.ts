import Constants from "../../../settings/Constants";

const route = `${Constants.apiUrl}/admin/pages`;
export const Routes = {
  list: () => `${route}`,
  get: (id: number) => `${route}/${id}`,
  getForPath: (path: string) => `${route}/path?path=${path}`,
  add: () => `${route}`,
  update: (id: number) => `${route}/${id}`,
  remove: (id: number) => `${route}/${id}`,
};

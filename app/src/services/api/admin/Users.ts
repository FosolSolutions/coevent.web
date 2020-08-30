import Constants from "../../../settings/Constants";

const route = `${Constants.apiUrl}/admin/users`;
export const Routes = {
  list: () => `${route}`,
  get: (id: string) => `${route}/${id}`,
  add: () => `${route}`,
  update: (id: string) => `${route}/${id}`,
  remove: (id: string) => `${route}/${id}`,
};

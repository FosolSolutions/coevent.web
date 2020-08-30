import Constants from "../../settings/Constants";

const route = `${Constants.apiUrl}/filestation`;
export const Routes = {
  shares: () => `${route}/shares`,
  files: (path: string) => `${route}/files?path=${path}`,
  download: (path: string) => `${route}/files/download?path=${path}`,
  thumbnail: (path: string) => `${route}/files/thumb?path=${path}`,
  remove: (path: string) => `${route}/files?path=${path}`,
};

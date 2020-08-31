import Constants from "../../../settings/Constants";
import qs from "query-string";
import moment from "moment";

const route = `${Constants.apiUrl}/data/calendars`;
export const Routes = {
  get: (id: number) => `${route}/events/activities/openings/${id}`,
  getOpeningsForCalendar: (id: number, startOn?: Date, endOn?: Date) => {
    const query = {
      startOn: moment(startOn).format("YYYY-MM-DD"),
      endOn: moment(endOn).format("YYYY-MM-DD"),
    };
    const url = `${route}/${id}/openings?` + qs.stringify(query);
    return url;
  },
  apply: () => `${route}/events/activities/openings/apply`,
  unapply: () => `${route}/events/activities/openings/unapply`,
};

export interface IConstants {
  cookieName: string;
  apiUrl: string;
  calendarId: number;
  startOn: Date;
  endOn: Date;
}

export default {
  cookieName: "CoEvent",
  apiUrl: process.env.REACT_APP_API_URL,
  calendarId: 1,
  startOn: process.env.REACT_APP_SCHEDULE_START_ON
    ? new Date(process.env.REACT_APP_SCHEDULE_START_ON)
    : new Date(),
  endOn: process.env.REACT_APP_SCHEDULE_END_ON
    ? new Date(process.env.REACT_APP_SCHEDULE_END_ON)
    : new Date().setFullYear(new Date().getFullYear() + 1),
} as IConstants;

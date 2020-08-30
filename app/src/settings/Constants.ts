export default {
  cookieName: "CoEvent",
  apiUrl: process?.env?.API_URL ?? "https://localhost:10443", // TODO: For some reason react is not using the .env file...
  calendarId: 1,
  startOn: new Date("2020-09-01"),
  endOn: new Date("2020-12-31 23:59:59"),
};

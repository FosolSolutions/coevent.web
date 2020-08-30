export default {
  cookieName: "CoEvent",
  apiUrl: process?.env?.API_URL ?? "https://localhost:10443", // TODO: For some reason react is not using the .env file...
};

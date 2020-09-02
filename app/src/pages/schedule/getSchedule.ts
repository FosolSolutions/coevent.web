import { IAjaxFactory } from "../../contexts/ajax";
import {
  DataCalendarsRoutes,
  ICalendar,
  DataEventsRoutes,
  IEvent,
  DataOpeningsRoutes,
  IOpening,
} from "../../services";
import Constants from "../../settings/Constants";

export const getSchedule = (
  ajax: IAjaxFactory,
  setCalendar: React.Dispatch<React.SetStateAction<ICalendar>>
) => {
  ajax
    .get(
      DataCalendarsRoutes.get(
        Constants.calendarId,
        Constants.startOn,
        Constants.endOn
      )
    )
    .then(async (response) => {
      const calendar = (await response.json()) as ICalendar;
      const eventIds = calendar.events.map((event) => event.id);

      ajax
        .get(DataEventsRoutes.getEvents(eventIds))
        .then(async (response) => {
          const events = (await response.json()) as IEvent[];
          const sorted = events.sort((e1, e2) => {
            if (e1.startOn < e2.startOn) return -1;
            if (e1.startOn > e2.startOn) return 1;
            return 0;
          });

          ajax
            .get(
              DataOpeningsRoutes.getOpeningsForCalendar(
                Constants.calendarId,
                Constants.startOn,
                Constants.endOn
              )
            )
            .then(async (response) => {
              const openings = (await response.json()) as IOpening[];
              const events = sorted.map((event) => {
                return {
                  ...event,
                  activities: [
                    ...event.activities.map((activity) => {
                      return {
                        ...activity,
                        openings: [
                          ...activity.openings.map((opening) => {
                            // find the matching opening returned from the ajax request.
                            const fo = openings.find(
                              (o) => o.id === opening.id
                            );
                            return fo ? fo : opening;
                          }),
                        ],
                      };
                    }),
                  ],
                };
              });
              setCalendar((s) => {
                return {
                  ...s,
                  ...calendar,
                  events: [...events],
                };
              });
            })
            .catch(() => {});
        })
        .catch(() => {});
    })
    .catch(() => {});
};

export default getSchedule;

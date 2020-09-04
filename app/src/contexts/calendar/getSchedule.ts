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
import { ICalendarContext } from ".";

/**
 * Make requests to the API to fetch the calendar, events, activities, openings and participants.
 * @param ajax AjaxFactory object used to make ajax requests.
 * @param setCalendar State function to set the calendar data.
 */
export const getSchedule = async (
  ajax: IAjaxFactory,
  setCalendar: React.Dispatch<React.SetStateAction<ICalendarContext>>
) => {
  try {
    const resCalendar = await ajax.get(
      DataCalendarsRoutes.get(
        Constants.calendarId,
        Constants.startOn,
        Constants.endOn
      )
    );
    const calendar = (await resCalendar.json()) as ICalendar;
    const eventIds = calendar.events.map((event) => event.id);

    const resEvents = await ajax.get(DataEventsRoutes.getEvents(eventIds));
    const events = (await resEvents.json()) as IEvent[];
    const sortEvents = events.sort((e1, e2) => {
      if (e1.startOn < e2.startOn) return -1;
      if (e1.startOn > e2.startOn) return 1;
      return 0;
    });

    const resOpenings = await ajax.get(
      DataOpeningsRoutes.getOpeningsForCalendar(
        Constants.calendarId,
        Constants.startOn,
        Constants.endOn
      )
    );
    const openings = (await resOpenings.json()) as IOpening[];
    const openingEvents = sortEvents.map((event) => ({
      ...event,
      activities: [
        ...event.activities.map((activity) => ({
          ...activity,
          openings: [
            ...activity.openings.map((opening) => {
              // find the matching opening returned from the ajax request.
              const fo = openings.find((o) => o.id === opening.id);
              return fo ? fo : opening;
            }),
          ],
        })),
      ],
    }));

    const result = {
      ...calendar,
      events: [...openingEvents],
    };

    setCalendar((s) => {
      return {
        ...s,
        calendar: { ...result },
      };
    });

    return Promise.resolve(result);
  } catch (e) {
    return Promise.reject(e);
  }
};

export default getSchedule;

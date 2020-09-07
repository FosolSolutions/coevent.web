import React from "react";
import { ICalendar } from "../../services";
import { getSchedule } from ".";

export interface ICalendarContext {
  loading: boolean;
  calendar: ICalendar;
}

/**
 * Returns the currently logged in participant information.
 */
const CalendarContext = React.createContext<
  [ICalendarContext, React.Dispatch<React.SetStateAction<ICalendarContext>>]
>([
  {
    loading: false,
    calendar: {
      id: 0,
      events: [],
    },
  },
  () => {},
]);

/**
 * Stores the calendar information into context.
 * @param props Context properties
 */
export const CalendarProvider = (props?: React.PropsWithChildren<any>) => {
  const [calendar, setCalendar] = React.useState<ICalendarContext>({
    loading: false,
    calendar: {
      id: 0,
      events: [],
    },
  });

  React.useEffect(() => {
    setCalendar((s) => {
      return { ...s, loading: true };
    });
    getSchedule(setCalendar).finally(() =>
      setCalendar((s) => {
        return { ...s, loading: false };
      })
    );
  }, [calendar.calendar.id]);

  return (
    <CalendarContext.Provider value={[calendar, setCalendar]}>
      {props.children}
    </CalendarContext.Provider>
  );
};
export const CalendarConsumer = CalendarContext.Consumer;
export default CalendarContext;

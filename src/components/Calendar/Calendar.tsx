import { AppointmentModel, ViewState } from "@devexpress/dx-react-scheduler";
import React, { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../contexts/Contexts";
import {
  Appointments,
  DateNavigator,
  Scheduler,
  TodayButton,
  Toolbar,
  WeekView,
  AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import { CALENDAR_ID } from "../../pages/Home";
import { TaskType } from "../../interfaces/Task";

const now = new Date();
const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
const googleCalendarEventToAppointmentModelConverter = (
  gce: gapi.client.calendar.Events
): AppointmentModel[] => {
  return gce.items.map(
    (value): AppointmentModel => {
      if (value.start.dateTime && value.end.dateTime) {
        return {
          title: value.summary,
          startDate: value.start.dateTime,
          endDate: value.end.dateTime,
        };
      } else {
        return {
          title: value.summary,
          startDate: new Date(),
          endDate: new Date(),
        };
      }
    }
  );
};

interface CalendarProps {
  readonly tasks: TaskType[];
}

export const Calendar: React.FC<CalendarProps> = ({ tasks }) => {
  const [events, setEvents] = useState<AppointmentModel[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(now);

  const calendarContext = useContext(CalendarContext);
  const getCalendarEvents = async () => {
    if (gapi && gapi.client && gapi.client.calendar !== undefined) {
      const request = await gapi.client.calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: currentDate.toISOString(),
        timeMax: new Date(
          currentDate.getTime() + oneWeekInMilliseconds
        ).toISOString(),
      });

      if (request.status === 200) {
        setEvents(
          googleCalendarEventToAppointmentModelConverter(request.result)
        );
      }
    } else {
      console.log("gapi.client.calendar is undefined");
    }
  };

  useEffect(() => {
    if (calendarContext.isReady) {
      getCalendarEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, calendarContext.isReady]);

  return (
    <Scheduler data={[...events, ...convertTaskToAppointmentModel(tasks)]}>
      <ViewState
        currentDate={currentDate}
        onCurrentDateChange={setCurrentDate}
      />
      <Toolbar />
      <DateNavigator />
      <TodayButton />
      <WeekView startDayHour={9} endDayHour={19} />
      <Appointments />
      <AppointmentTooltip showCloseButton showOpenButton />
    </Scheduler>
  );
};

const convertTaskToAppointmentModel = (
  tasks: TaskType[]
): AppointmentModel[] => {
  return tasks.map((task) => ({
    startDate: task.dueDate,
    endDate: task.dueDate,
    title: task.name,
  }));
};

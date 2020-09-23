import {
  AppointmentModel,
  ChangeSet,
  EditingState,
  IntegratedEditing,
  ViewState,
} from "@devexpress/dx-react-scheduler";
import React, { useState } from "react";
import {
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  DragDropProvider,
  MonthView,
  Scheduler,
  TodayButton,
  Toolbar,
  ViewSwitcher,
  WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";
import { StringMapType, TaskWithTaskListKeyType } from "../../interfaces/Task";
import { database } from "../../firebase/config";
import { FormControlLabel, Hidden, Switch } from "@material-ui/core";
import { Appointment } from "./Appointment";

const now = new Date();

interface CalendarProps {
  readonly tasks: StringMapType<TaskWithTaskListKeyType>;
  readonly userId: string;
  readonly scheduleMode: boolean;
  setScheduleMode(scheduleMode: boolean): void;
}

export const Calendar: React.FC<CalendarProps> = ({
  tasks,
  userId,
  scheduleMode,
  setScheduleMode,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(now);

  const onCommitChanges = ({ changed }: ChangeSet) => {
    if (changed) {
      Object.keys(changed).forEach((taskKey) => {
        const task = tasks[taskKey];
        const path = `/${userId}/tasks/${task.taskListKey}/${taskKey}`;
        const change = changed[taskKey];
        database.ref(path).update({
          startDateTime: change.startDate.valueOf(),
          endDateTime: change.endDate.valueOf(),
        });
      });
    }
  };

  return (
    <Scheduler data={convertTaskToAppointmentModel(tasks)}>
      <ViewState
        currentDate={currentDate}
        onCurrentDateChange={setCurrentDate}
        defaultCurrentViewName={"Week"}
      />
      <EditingState onCommitChanges={onCommitChanges} />
      <IntegratedEditing />
      <Toolbar
        flexibleSpaceComponent={() => (
          <>
            <div style={{ margin: "auto" }} />
            <Hidden mdDown={true}>
              <FormControlLabel
                control={
                  <Switch
                    checked={scheduleMode}
                    onChange={(event, checked) => {
                      setScheduleMode(checked);
                    }}
                    name="checkedA"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                }
                label="Full Screen"
              />
            </Hidden>
          </>
        )}
      />
      <ViewSwitcher />
      <DateNavigator />
      <TodayButton />
      <WeekView cellDuration={60} />
      <MonthView />
      <Appointments appointmentComponent={Appointment} />

      <AppointmentTooltip showCloseButton />
      <DragDropProvider allowDrag={() => true} />
    </Scheduler>
  );
};

const convertTaskToAppointmentModel = (
  tasks: StringMapType<TaskWithTaskListKeyType>
): AppointmentModel[] => {
  return Object.keys(tasks).map((taskKey) => {
    const task = tasks[taskKey];
    return {
      isDone: task.isDone,
      startDate: task.startDateTime,
      endDate: task.endDateTime,
      title: task.name,
      id: taskKey,
    };
  });
};

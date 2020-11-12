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
import { FormControlLabel, Hidden, Switch } from "@material-ui/core";
import { Appointment } from "./Appointment";

const now = new Date();

interface CalendarProps {
  appointments: AppointmentModel[];
  readonly scheduleMode: boolean;
  setScheduleMode(scheduleMode: boolean): void;
  onCommitChanges(changes: ChangeSet): void;
}

export const Calendar: React.FC<CalendarProps> = ({
  appointments,
  scheduleMode,
  setScheduleMode,
  onCommitChanges,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(now);

  return (
    <Scheduler data={appointments}>
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

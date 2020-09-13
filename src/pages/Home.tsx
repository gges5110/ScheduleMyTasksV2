import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Appointments,
  DateNavigator,
  Scheduler,
  TodayButton,
  Toolbar,
  WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";
import { AppointmentModel, ViewState } from "@devexpress/dx-react-scheduler";
import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core";
import { database } from "../firebase/config";
import { useFirebaseQuery } from "../hooks/useFirebaseQuery";
import { TaskList } from "../components/TaskList/TaskList";
import { TaskListDialog } from "../components/TaskList/TaskListDialog";
import { CreateTaskListForm } from "../components/CreateTaskListForm";
import { StringMapType, TaskListType } from "../interfaces/Task";
import { CalendarContext, UserContext } from "../contexts/Contexts";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
    },
  })
);

export const CALENDAR_ID = "primary";

const now = new Date();
const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

export const Home: React.FC = () => {
  const classes = useStyles();

  const [currentDate, setCurrentDate] = useState<Date>(now);
  const [events, setEvents] = useState<AppointmentModel[] | undefined>();
  const [taskListDialogOpen, setTaskListDialogOpen] = useState<boolean>(false);
  const [openingTaskList, setOpeningTaskList] = useState<TaskListType | null>(
    null
  );
  const [openingTaskListKey, setOpeningTaskListKey] = useState<string | null>(
    null
  );

  // TaskList
  const user = useContext(UserContext);
  const uid = user?.uid;
  const taskListsQuery = useMemo(() => {
    return database.ref(`/taskLists/${uid}`).orderByValue();
  }, [uid]);
  const taskLists: StringMapType<TaskListType> = useFirebaseQuery(
    taskListsQuery
  );

  // Calendar

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
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Paper className={classes.paper}>
            <Scheduler data={events}>
              <ViewState
                currentDate={currentDate}
                onCurrentDateChange={setCurrentDate}
              />
              <Toolbar />
              <DateNavigator />
              <TodayButton />
              <WeekView startDayHour={9} endDayHour={19} />
              <Appointments />
            </Scheduler>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={3}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item style={{ width: "100%" }}>
              <Paper className={classes.paper}>
                <CreateTaskListForm userId={user?.uid || ""} />
              </Paper>
            </Grid>

            {Object.keys(taskLists).map((key: string) => {
              const taskList = taskLists[key];

              const openTaskListDialog = () => {
                setTaskListDialogOpen(true);
                setOpeningTaskList(taskList);
                setOpeningTaskListKey(key);
              };
              return (
                <Grid item style={{ width: "100%" }} key={key}>
                  <Paper className={classes.paper}>
                    <TaskList
                      taskListKey={key}
                      taskListName={taskList.name}
                      openTaskListDialog={openTaskListDialog}
                    />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
      {openingTaskList && openingTaskListKey && (
        <TaskListDialog
          open={taskListDialogOpen}
          taskList={openingTaskList}
          taskListKey={openingTaskListKey}
          userId={user?.uid || ""}
          handleClose={() => {
            setTaskListDialogOpen(false);
            setOpeningTaskList(null);
            setOpeningTaskListKey(null);
          }}
        />
      )}
    </div>
  );
};

const googleCalendarEventToAppointmentModelConverter = (
  gce: gapi.client.calendar.Events
): AppointmentModel[] | undefined => {
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

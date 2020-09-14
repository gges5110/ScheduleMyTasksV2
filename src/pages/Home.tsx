import React, { useContext, useMemo, useState } from "react";
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
import { StringMapType, TaskListType, TaskType } from "../interfaces/Task";
import { UserContext } from "../contexts/Contexts";
import { Calendar } from "../components/Calendar/Calendar";

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

export const Home: React.FC = () => {
  const classes = useStyles();
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
  const taskListsQuery = useMemo(
    () => database.ref(`/${uid}/taskLists`).orderByValue(),
    [uid]
  );
  const taskLists: StringMapType<TaskListType> = useFirebaseQuery(
    taskListsQuery
  );

  const tasksQuery = useMemo(
    () => database.ref(`/${uid}/tasks`).orderByValue(),
    [uid]
  );

  const tasksMap: StringMapType<StringMapType<TaskType>> = useFirebaseQuery(
    tasksQuery
  );

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Paper className={classes.paper}>
            <Calendar tasks={convert(tasksMap)} />
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
                      userId={user?.uid || ""}
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

const convert = (t: StringMapType<StringMapType<TaskType>>): TaskType[] => {
  const taskTypeArray: TaskType[] = [];
  Object.keys(t).forEach((taskListKey) => {
    const t1 = t[taskListKey];
    Object.keys(t1).forEach((taskKey) => taskTypeArray.push(t1[taskKey]));
  });
  return taskTypeArray;
};

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
import {
  StringMapType,
  TaskListType,
  TaskType,
  TaskWithTaskListKeyType,
} from "../interfaces/Task";
import { UserContext } from "../contexts/Contexts";
import { Calendar } from "../components/Calendar/Calendar";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { DragContainer } from "../components/DragContainer";

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
    () => database.ref(`/${uid}/taskLists`).orderByChild("sortingIndex"),
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

  const sortedTaskListKeys = Object.keys(taskLists).sort(
    (a, b) => taskLists[a].sortingIndex - taskLists[b].sortingIndex
  );

  const [scheduleMode, setScheduleMode] = useState<boolean>(false);
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={scheduleMode ? 12 : 9}>
          <Paper className={classes.paper}>
            <Calendar
              tasks={convert(tasksMap)}
              userId={user?.uid || ""}
              scheduleMode={scheduleMode}
              setScheduleMode={(scheduleMode) => setScheduleMode(scheduleMode)}
            />
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          lg={3}
          style={{ display: scheduleMode ? "none" : undefined }}
        >
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item style={{ width: "100%" }}>
              <Paper className={classes.paper}>
                <CreateTaskListForm
                  userId={user?.uid || ""}
                  taskListCount={sortedTaskListKeys.length}
                />
              </Paper>
            </Grid>
            <DndProvider backend={HTML5Backend}>
              {sortedTaskListKeys.map((key: string, index: number) => {
                const taskList = taskLists[key];

                const openTaskListDialog = () => {
                  setTaskListDialogOpen(true);
                  setOpeningTaskList(taskList);
                  setOpeningTaskListKey(key);
                };

                const moveCard = (dragIndex: number, hoverIndex: number) => {
                  const targetKey = sortedTaskListKeys[dragIndex];

                  database
                    .ref(`/${uid}/taskLists/${key}`)
                    .update({
                      sortingIndex: dragIndex,
                    })
                    .then(() => {
                      database.ref(`/${uid}/taskLists/${targetKey}`).update({
                        sortingIndex: hoverIndex,
                      });
                    });
                };

                return (
                  <Grid item style={{ width: "100%" }} key={key}>
                    <DragContainer id={key} index={index} moveItem={moveCard}>
                      <Paper className={classes.paper}>
                        <TaskList
                          taskListKey={key}
                          taskListName={taskList.name}
                          userId={user?.uid || ""}
                          openTaskListDialog={openTaskListDialog}
                        />
                      </Paper>
                    </DragContainer>
                  </Grid>
                );
              })}
            </DndProvider>
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

const convert = (
  t: StringMapType<StringMapType<TaskType>>
): StringMapType<TaskWithTaskListKeyType> => {
  const taskTypeArray: StringMapType<TaskWithTaskListKeyType> = {};
  Object.keys(t).forEach((taskListKey) => {
    const t1 = t[taskListKey];
    Object.keys(t1).forEach((taskKey) => {
      taskTypeArray[taskKey] = {
        ...t1[taskKey],
        taskListKey: taskListKey,
      };
    });
  });
  return taskTypeArray;
};

import React, { useContext, useState } from "react";
import {
  CircularProgress,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core";
import { database } from "../firebase/config";
import { TaskList } from "../components/TaskList/TaskList";
import { TaskListDialog } from "../components/TaskListDialog/TaskListDialog";
import { CreateTaskListForm } from "../components/CreateTaskListForm";
import { TaskListType } from "../interfaces/Task";
import { UserContext } from "../contexts/Contexts";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { DragContainer } from "../components/DragContainer";
import { CalendarContainer } from "../components/Calendar/CalendarContainer";
import { useTaskLists } from "../hooks/useTaskLists";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      cursor: "pointer",
    },
  })
);

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

  const [taskLists, taskListsLoading] = useTaskLists();

  const [scheduleMode, setScheduleMode] = useState<boolean>(false);
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={scheduleMode ? 12 : 9}>
          <Paper className={classes.paper}>
            <CalendarContainer
              userId={user?.uid || ""}
              scheduleMode={scheduleMode}
              setScheduleMode={setScheduleMode}
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
                  taskListCount={taskLists?.length || 0}
                />
              </Paper>
            </Grid>
            <DndProvider backend={HTML5Backend}>
              {taskListsLoading && <CircularProgress />}
              {taskLists?.map((taskListSnapshot, index: number) => {
                const taskList: TaskListType = taskListSnapshot.val();
                const key = taskListSnapshot.key || "";

                const openTaskListDialog = () => {
                  setTaskListDialogOpen(true);
                  setOpeningTaskList(taskList);
                  setOpeningTaskListKey(key);
                };

                const moveCard = (dragIndex: number, hoverIndex: number) => {
                  const targetKey = taskLists[dragIndex].key;
                  const originalTaskListPath = `/${uid}/taskLists/${key}`;
                  const targetTaskListPath = `/${uid}/taskLists/${targetKey}`;
                  database
                    .ref(originalTaskListPath)
                    .update({
                      sortingIndex: dragIndex,
                    })
                    .then(() => {
                      database.ref(targetTaskListPath).update({
                        sortingIndex: hoverIndex,
                      });
                    });
                };

                return (
                  <Grid item style={{ width: "100%" }} key={key}>
                    <DragContainer id={key} index={index} moveItem={moveCard}>
                      <Paper
                        className={classes.paper}
                        onClick={(event) => {
                          // @ts-ignore
                          if (event.target.type !== "checkbox") {
                            openTaskListDialog();
                          }
                        }}
                      >
                        <TaskList
                          taskListKey={key}
                          taskListName={taskList.name}
                          userId={user?.uid || ""}
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

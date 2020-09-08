import React, { useContext, useMemo, useState } from "react";
import {
  Link as RouterLink,
  RouteChildrenProps,
  useHistory,
} from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  createStyles,
  FormControl,
  Input,
  InputLabel,
  Link,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { database } from "../firebase/config";
import { UserContext } from "../components/Page";
import { useFirebaseQuery } from "../hooks/useFirebaseQuery";
import { DateTimePicker, TimePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import { DeleteTaskListDialog } from "../components/TaskList/DeleteTaskListDialog";
import { DeleteTaskDialog } from "../components/TaskList/DeleteTaskDialog";
import { StringMapType } from "./TaskLists";
import { TaskListTable } from "../components/TaskList/TaskListTable";
import { TaskType } from "../interfaces/Task";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  })
);

export const TaskList: React.FC<RouteChildrenProps> = (
  props: RouteChildrenProps
) => {
  const user = useContext(UserContext);
  const classes = useStyles();

  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState<boolean>(
    false
  );
  const [deleteTaskListDialogOpen, setDeleteTaskListDialogOpen] = useState<
    boolean
  >(false);
  const [taskUidToDelete, setTaskUidToDelete] = useState<string>("");

  // New Task Form
  const [selectedDueDate, handleDueDateChange] = useState<Date | null>(
    new Date()
  );
  const [
    selectedRemainingTime,
    handleRemainingTimeChange,
  ] = useState<Date | null>(new Date(8 * 3600 * 1000));
  const [newTaskName, setNewTaskName] = useState<string>("");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const uid = props?.match?.params["uid"];
  const history = useHistory();
  const taskListQuery = useMemo(() => {
    return database.ref(`/taskLists/${user?.uid}/${uid}`).orderByValue();
  }, [user, uid]);
  const taskList: any = useFirebaseQuery(taskListQuery);

  const tasksQuery = useMemo(() => {
    return database.ref(`/tasks/${uid}`).orderByValue();
  }, [uid]);
  const tasks: StringMapType<TaskType> = useFirebaseQuery(tasksQuery);

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" component={RouterLink} to="/lists">
          Lists
        </Link>
        <Typography color="textPrimary">{taskList.name}</Typography>
      </Breadcrumbs>
      <Typography variant="h5" gutterBottom>
        Task List: {taskList.name}
      </Typography>

      <Button
        variant={"contained"}
        onClick={() => {
          setDeleteTaskListDialogOpen(true);
        }}
      >
        Delete Task List
      </Button>
      <>
        <TaskListTable
          tasks={tasks}
          uid={uid}
          onTaskDelete={(key) => {
            setDeleteTaskDialogOpen(true);
            setTaskUidToDelete(key);
          }}
        />

        <div style={{ height: 24 }} />
        <Paper>
          <form autoComplete="off" className={classes.root}>
            <FormControl required={true}>
              <InputLabel htmlFor="new-task-name-input">
                New Task Name
              </InputLabel>
              <Input
                id="new-task-name-input"
                value={newTaskName}
                onChange={(event) => setNewTaskName(event.target.value)}
              />
            </FormControl>
            <FormControl required={true}>
              <DateTimePicker
                label="Due Date"
                value={selectedDueDate}
                onChange={handleDueDateChange}
              />
            </FormControl>
            <FormControl required={true}>
              <TimePicker
                clearable
                ampm={false}
                label={"ETA"}
                value={selectedRemainingTime}
                minutesStep={30}
                onChange={handleRemainingTimeChange}
              />
            </FormControl>
            <Button
              style={{ marginTop: 12, marginLeft: 12 }}
              type={"button"}
              color={"primary"}
              variant={"contained"}
              disabled={newTaskName === ""}
              onClick={() => {
                const value = {
                  name: newTaskName,
                  dueDate: selectedDueDate?.getTime(),
                  ETA: selectedRemainingTime?.getTime(),
                  isDone: false,
                };
                database.ref(`/tasks/${uid}`).push(value);
                database.ref(`/taskLists/${user?.uid}/${uid}`).set({
                  name: taskList.name,
                  taskCount: taskList.taskCount + 1,
                });
                // Reset values
                setNewTaskName("");
              }}
            >
              Add
            </Button>
          </form>
        </Paper>
        <DeleteTaskDialog
          open={deleteTaskDialogOpen}
          handleClose={() => setDeleteTaskDialogOpen(false)}
          handleDelete={() => {
            database.ref(`/tasks/${uid}/${taskUidToDelete}`).remove();
            database.ref(`/taskLists/${user?.uid}/${uid}`).set({
              name: taskList.name,
              taskCount: taskList.taskCount - 1,
            });
            setDeleteTaskDialogOpen(false);
          }}
        />
        <DeleteTaskListDialog
          open={deleteTaskListDialogOpen}
          handleClose={() => setDeleteTaskListDialogOpen(false)}
          handleDelete={() => {
            database
              .ref(`/taskLists/${user?.uid}/${uid}`)
              .remove()
              .then(() => {
                database
                  .ref(`/tasks/${uid}`)
                  .remove()
                  .then(() => {
                    setDeleteTaskListDialogOpen(false);
                    history.push("/lists");
                  });
              });
          }}
        />
      </>
    </>
  );
};

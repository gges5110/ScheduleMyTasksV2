import React, { useState } from "react";
import { database } from "../../firebase/config";
import { TaskListType, TaskType } from "../../interfaces/Task";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Input,
  InputLabel,
  makeStyles,
  Paper,
  TextField,
  Theme,
} from "@material-ui/core";
import { TaskListTable } from "./TaskListTable";
import { DateTimePicker, TimePicker } from "@material-ui/pickers";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { DeleteTaskListDialog } from "./DeleteTaskListDialog";
import { useList } from "react-firebase-hooks/database";

const useTaskListDialogStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "aliceblue",
    },
    form: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
      textAlign: "center",
    },
  })
);

interface TaskListDialogProps {
  readonly open: boolean;
  readonly taskList: TaskListType;
  readonly taskListKey: string;
  readonly userId: string;

  handleClose(): void;
}

export const TaskListDialog: React.FC<TaskListDialogProps> = ({
  open,
  handleClose,
  taskList,
  taskListKey,
  userId,
}) => {
  const classes = useTaskListDialogStyles();

  const [tasks] = useList(
    database.ref(`/tasks/${taskListKey}`).orderByChild("isDoneTimestamp")
  );

  // New Task Form
  const [selectedDueDate, handleDueDateChange] = useState<Date | null>(
    new Date()
  );
  const [
    selectedRemainingTime,
    handleRemainingTimeChange,
  ] = useState<Date | null>(new Date(8 * 3600 * 1000));
  const [newTaskName, setNewTaskName] = useState<string>("");

  // Delete Task
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState<boolean>(
    false
  );
  const [deleteTaskListDialogOpen, setDeleteTaskListDialogOpen] = useState<
    boolean
  >(false);
  const [taskUidToDelete, setTaskUidToDelete] = useState<string>("");

  const handleDeleteTask = () => {
    database.ref(`/tasks/${taskListKey}/${taskUidToDelete}`).remove();
    database.ref(`/taskLists/${userId}/${taskListKey}`).set({
      name: taskList.name,
      taskCount: taskList.taskCount - 1,
    });
    setDeleteTaskDialogOpen(false);
  };

  const onClickAddNewTask = () => {
    const value: TaskType = {
      name: newTaskName,
      dueDate: selectedDueDate?.getTime() || 0,
      ETA: selectedRemainingTime?.getTime() || 0,
      isDone: false,
      isDoneTimestamp: null,
    };
    database.ref(`/tasks/${taskListKey}`).push(value);
    database.ref(`/taskLists/${userId}/${taskListKey}`).set({
      name: taskList.name,
      taskCount: taskList.taskCount + 1,
    });
    // Reset values
    setNewTaskName("");
  };

  const handleDeleteTaskList = () => {
    database
      .ref(`/taskLists/${userId}/${taskListKey}`)
      .remove()
      .then(() => {
        database
          .ref(`/tasks/${taskListKey}`)
          .remove()
          .then(() => {
            setDeleteTaskListDialogOpen(false);
            handleClose();
          });
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={"lg"}
      fullWidth={true}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Grid
          justify="space-between" // Add it here :)
          container
        >
          <Grid item>
            <Input
              fullWidth={false}
              defaultValue={taskList.name}
              onBlur={(event) => {
                database.ref(`/taskLists/${userId}/${taskListKey}`).set({
                  ...taskList,
                  name: event.target.value,
                });
              }}
            />
          </Grid>

          <Grid item>
            <Button
              variant={"contained"}
              onClick={() => {
                setDeleteTaskListDialogOpen(true);
              }}
            >
              Delete Task List
            </Button>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent className={classes.root}>
        <TaskListTable
          tasks={tasks || []}
          uid={taskListKey || ""}
          onTaskDelete={(key) => {
            setDeleteTaskDialogOpen(true);
            setTaskUidToDelete(key);
          }}
        />
        <div style={{ height: 24 }} />
        <Paper>
          <form autoComplete="off" className={classes.form}>
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
                renderInput={(props) => <TextField {...props} />}
                label="Due Date"
                inputFormat={"MM/dd/yyyy HH:mm"}
                value={selectedDueDate}
                onChange={handleDueDateChange}
              />
            </FormControl>
            <FormControl required={true}>
              <TimePicker
                renderInput={(props) => <TextField {...props} />}
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
              onClick={onClickAddNewTask}
            >
              Add
            </Button>
          </form>
        </Paper>
        <DeleteTaskDialog
          open={deleteTaskDialogOpen}
          handleClose={() => setDeleteTaskDialogOpen(false)}
          handleDelete={handleDeleteTask}
        />
        <DeleteTaskListDialog
          open={deleteTaskListDialogOpen}
          handleClose={() => setDeleteTaskListDialogOpen(false)}
          handleDelete={handleDeleteTaskList}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import React, { useState } from "react";
import { database } from "../../firebase/config";
import { TaskListType } from "../../interfaces/Task";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Input,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core";
import { TaskListTable } from "./TaskListTable";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { DeleteTaskListDialog } from "./DeleteTaskListDialog";
import { CreateTaskForm } from "../CreateTaskForm";
import { useTasks } from "../../hooks/useTasks";

const useTaskListDialogStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
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
  const taskListPath = `/${userId}/taskLists/${taskListKey}`;

  const [tasks] = useTasks(taskListKey);

  // Delete Task
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState<boolean>(
    false
  );
  const [deleteTaskListDialogOpen, setDeleteTaskListDialogOpen] = useState<
    boolean
  >(false);
  const [taskUidToDelete, setTaskUidToDelete] = useState<string>("");

  const handleDeleteTask = () => {
    database
      .ref(`/${userId}/tasks/${taskUidToDelete}`)
      .remove()
      .then(() => {
        setDeleteTaskDialogOpen(false);
      });
  };

  const handleDeleteTaskList = () => {
    // Remove all tasks in this task list
    Promise.all(
      tasks?.map((task) => {
        return database.ref(`/${userId}/tasks/${task.key}`).remove();
      }) || []
    )
      .then(() => database.ref(taskListPath).remove())
      .then(() => {
        setDeleteTaskListDialogOpen(false);
        handleClose();
      });
  };

  const updateTaskListName = (name: string) => {
    database
      .ref(taskListPath)
      .update({
        name,
      })
      .catch((err) => console.warn(err));
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
        <Grid justify="space-between" container>
          <Grid item>
            <Input
              fullWidth={false}
              defaultValue={taskList.name}
              onBlur={(event) => {
                updateTaskListName(event.target.value);
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
          userId={userId}
          onTaskDelete={(key) => {
            setDeleteTaskDialogOpen(true);
            setTaskUidToDelete(key);
          }}
        />
        <div style={{ height: 24 }} />
        <Paper>
          <CreateTaskForm userId={userId} taskListKey={taskListKey} />
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

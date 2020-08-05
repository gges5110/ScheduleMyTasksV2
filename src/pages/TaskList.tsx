import React, { useContext, useMemo, useState } from "react";
import { RouteChildrenProps, useHistory } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Checkbox,
  createStyles,
  FormControl,
  Input,
  InputLabel,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  const tasks: any = useFirebaseQuery(tasksQuery);
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/ScheduleMyTasksV2/lists">
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
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Done</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Remaining Time</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(tasks).map((key: string) => {
                const task = tasks[key];
                return (
                  <TableRow key={task.name}>
                    <TableCell component="th" scope="row">
                      <Checkbox
                        checked={task.isDone}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          database.ref(`/tasks/${uid}/${key}`).set({
                            ...task,
                            isDone: event.target.checked,
                          });
                        }}
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Input
                        defaultValue={task.name}
                        onBlur={(event) =>
                          database.ref(`/tasks/${uid}/${key}`).set({
                            ...task,
                            name: event.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <DateTimePicker
                        value={new Date(task.dueDate)}
                        onChange={(date) => {
                          database.ref(`/tasks/${uid}/${key}`).set({
                            ...task,
                            dueDate: date?.getTime(),
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <TimePicker
                        ampm={false}
                        value={new Date(task.ETA)}
                        minutesStep={30}
                        autoOk={true}
                        onChange={(date) => {
                          database.ref(`/tasks/${uid}/${key}`).set({
                            ...task,
                            ETA: date?.getTime(),
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Button
                        variant={"contained"}
                        color={"default"}
                        onClick={() => {
                          setDeleteTaskDialogOpen(true);
                          setTaskUidToDelete(key);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
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

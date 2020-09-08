import React from "react";
import {
  Button,
  Checkbox,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { database } from "../../firebase/config";
import { DateTimePicker, TimePicker } from "@material-ui/pickers";
import { StringMapType } from "../../pages/TaskLists";
import { TaskType } from "../../interfaces/Task";

interface TaskListTableProps {
  readonly tasks: StringMapType<TaskType>;
  readonly uid: string;

  onTaskDelete(key: string): void;
}

export const TaskListTable: React.FC<TaskListTableProps> = ({
  tasks,
  uid,
  onTaskDelete,
}) => {
  const handleOnTaskDelete = (key: string) => {
    onTaskDelete(key);
  };

  return (
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
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
                      handleOnTaskDelete(key);
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
  );
};

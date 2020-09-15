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
  TextField,
} from "@material-ui/core";
import { database } from "../../firebase/config";
import { MobileDateTimePicker, MobileTimePicker } from "@material-ui/pickers";
import { TaskType } from "../../interfaces/Task";
import firebase from "firebase";

interface TaskListTableProps {
  readonly tasks: firebase.database.DataSnapshot[];
  readonly uid: string;
  readonly userId: string;
  onTaskDelete(key: string): void;
}

export const TaskListTable: React.FC<TaskListTableProps> = ({
  tasks,
  uid,
  userId,
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
            <TableCell width={"5%"}>Done</TableCell>
            <TableCell>Name</TableCell>
            <TableCell width={"20%"}>Due Date</TableCell>
            <TableCell width={"10%"}>Remaining Time</TableCell>
            <TableCell width={"10%"}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((snapshot) => {
            const task: TaskType = snapshot.val();
            const key = snapshot.key || "";
            const path = `/${userId}/tasks/${uid}/${key}`;
            return (
              <TableRow key={task.name}>
                <TableCell component="th" scope="row">
                  <Checkbox
                    checked={task.isDone}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      database.ref(path).update({
                        isDone: event.target.checked,
                      });
                    }}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Input
                    style={{ width: "100%" }}
                    defaultValue={task.name}
                    onBlur={(event) =>
                      database.ref(path).update({
                        name: event.target.value,
                      })
                    }
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <MobileDateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    value={new Date(Number(task.dueDate))}
                    inputFormat={"MM/dd/yyyy HH:mm"}
                    onChange={(date) => {
                      database.ref(path).update({
                        dueDate: date?.getTime(),
                      });
                    }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <MobileTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    ampm={false}
                    value={new Date(Number(task.ETA))}
                    minutesStep={30}
                    onChange={(date) => {
                      database.ref(path).update({
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

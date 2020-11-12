import React from "react";
import {
  Checkbox,
  IconButton,
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
import { MobileDateTimePicker } from "@material-ui/pickers";
import { TaskType } from "../../interfaces/Task";
import CloseIcon from "@material-ui/icons/Close";
import { DataSnapshot } from "../../interfaces/FirebaseTypes";

interface TaskListTableProps {
  readonly tasks: DataSnapshot[];
  readonly userId: string;
  onTaskDelete(key: string): void;
}

export const TaskListTable: React.FC<TaskListTableProps> = ({
  tasks,
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
            <TableCell width={"15%"}>Start</TableCell>
            <TableCell width={"15%"}>End</TableCell>
            <TableCell width={"10%"}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((snapshot) => {
            const task: TaskType = snapshot.val();
            const key = snapshot.key || "";
            const path = `/${userId}/tasks/${key}`;
            return (
              <TableRow key={task.name}>
                <TableCell component="th" scope="row">
                  <Checkbox
                    checked={task.isDone}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      database.ref(path).update({
                        isDone: event.target.checked,
                        isDoneTimestamp: event.target.checked
                          ? new Date().valueOf()
                          : null,
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
                  <MobileDateTimePicker<Date>
                    renderInput={(props) => <TextField {...props} />}
                    ampm={false}
                    minutesStep={30}
                    value={new Date(task.startDateTime)}
                    inputFormat={"MM/dd/yyyy HH:mm"}
                    onChange={(date) => {
                      database.ref(path).update({
                        startDateTime: date?.getTime(),
                      });
                    }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <MobileDateTimePicker<Date>
                    renderInput={(props) => <TextField {...props} />}
                    ampm={false}
                    minutesStep={30}
                    value={new Date(task.endDateTime)}
                    onChange={(date) => {
                      database.ref(path).update({
                        endDateTime: date?.getTime(),
                      });
                    }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <IconButton
                    aria-label="delete"
                    color={"default"}
                    onClick={() => {
                      handleOnTaskDelete(key);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

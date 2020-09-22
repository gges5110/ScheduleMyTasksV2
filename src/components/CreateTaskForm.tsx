import React, { useState } from "react";
import { TaskType } from "../interfaces/Task";
import { database } from "../firebase/config";
import {
  Button,
  createStyles,
  FormControl,
  Input,
  InputLabel,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";

const useCreateTaskFormStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
      textAlign: "center",
    },
  })
);

interface CreateTaskFormProps {
  readonly userId: string;
  readonly taskListKey: string;
}

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  userId,
  taskListKey,
}) => {
  const classes = useCreateTaskFormStyles();

  const [newTaskName, setNewTaskName] = useState<string>("");
  const [
    selectedStartDate,
    handleSelectedStartDateChange,
  ] = useState<Date | null>(new Date());
  const [selectedEndDate, handleSelectedEndDateChange] = useState<Date | null>(
    new Date()
  );

  const onClickAddNewTask = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    createNewTask();
  };

  const createNewTask = () => {
    const value: TaskType = {
      name: newTaskName,
      startDateTime: selectedStartDate?.getTime() || 0,
      endDateTime: selectedEndDate?.getTime() || 0,
      isDone: false,
      isDoneTimestamp: null,
    };
    database.ref(`/${userId}/tasks/${taskListKey}`).push(value);
    // Reset values
    setNewTaskName("");
  };

  const onEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      createNewTask();
    }
  };

  return (
    <form
      autoComplete={"off"}
      className={classes.form}
      onSubmit={onClickAddNewTask}
    >
      <FormControl required={true}>
        <InputLabel htmlFor="new-task-name-input">New Task Name</InputLabel>
        <Input
          id="new-task-name-input"
          value={newTaskName}
          autoFocus={true}
          onKeyPress={onEnter}
          onChange={(event) => setNewTaskName(event.target.value)}
        />
      </FormControl>
      <FormControl required={true}>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="Start Date"
          inputFormat={"MM/dd/yyyy HH:mm"}
          value={selectedStartDate}
          onChange={handleSelectedStartDateChange}
        />
      </FormControl>
      <FormControl required={true}>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="End Date"
          inputFormat={"MM/dd/yyyy HH:mm"}
          value={selectedStartDate}
          onChange={handleSelectedEndDateChange}
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
  );
};

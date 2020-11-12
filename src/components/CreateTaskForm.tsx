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
import { ThenableReference } from "../interfaces/FirebaseTypes";

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
  const userTaskPath = `/${userId}/tasks/${taskListKey}`;
  const classes = useCreateTaskFormStyles();

  const [newTaskName, setNewTaskName] = useState<string>("");
  const [
    selectedStartDate,
    handleSelectedStartDateChange,
  ] = useState<Date | null>(getDefaultStartDate());
  const [selectedEndDate, handleSelectedEndDateChange] = useState<Date | null>(
    getDefaultEndDate()
  );

  const createNewTask = (task: TaskType): ThenableReference => {
    return database.ref(userTaskPath).push(task);
  };

  const onClickAddNewTask = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const task: TaskType = {
      name: newTaskName,
      startDateTime: selectedStartDate?.getTime() || 0,
      endDateTime: selectedEndDate?.getTime() || 0,
      isDone: false,
      isDoneTimestamp: null,
    };
    createNewTask(task).then(() => {
      // Reset values
      setNewTaskName("");
    });
  };

  const onEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      const task: TaskType = {
        name: newTaskName,
        startDateTime: selectedStartDate?.getTime() || 0,
        endDateTime: selectedEndDate?.getTime() || 0,
        isDone: false,
        isDoneTimestamp: null,
      };
      createNewTask(task).then(() => {
        // Reset values
        setNewTaskName("");
      });
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
          minutesStep={30}
          value={selectedStartDate}
          onChange={handleSelectedStartDateChange}
        />
      </FormControl>
      <FormControl required={true}>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="End Date"
          minutesStep={30}
          inputFormat={"MM/dd/yyyy HH:mm"}
          value={selectedEndDate}
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

const getDefaultStartDate = (): Date => {
  return roundTimeQuarterHour(new Date());
};

const getDefaultEndDate = (): Date => {
  const d = roundTimeQuarterHour(new Date());
  d.setHours(d.getHours() + 1);
  return d;
};

const roundTimeQuarterHour = (time: number | string | Date): Date => {
  const timeToReturn = new Date(time);

  timeToReturn.setMilliseconds(
    Math.ceil(timeToReturn.getMilliseconds() / 1000) * 1000
  );
  timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
  timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 30) * 30);
  return timeToReturn;
};

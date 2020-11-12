import React, { ChangeEvent, useState } from "react";
import { database } from "../firebase/config";
import { Button, FormControl, Input, InputLabel } from "@material-ui/core";
import { TaskListType } from "../interfaces/Task";
import { ThenableReference } from "../interfaces/FirebaseTypes";

interface CreateTaskListFormProps {
  readonly userId: string;
  readonly taskListCount: number;
}

export const CreateTaskListForm: React.FC<CreateTaskListFormProps> = ({
  userId,
  taskListCount,
}) => {
  const [newListName, setNewListName] = useState<string>("");
  const userTaskListPath = `/${userId}/taskLists`;

  const createNewTaskList = (newTaskList: TaskListType): ThenableReference => {
    return database.ref(userTaskListPath).push(newTaskList);
  };

  const onSubmitOrClick = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const newTaskList: TaskListType = {
      name: newListName,
      sortingIndex: taskListCount,
    };
    createNewTaskList(newTaskList).then(() => {
      setNewListName("");
    });
  };

  const handleNewListNameChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setNewListName(event.target.value);
  };

  return (
    <form autoComplete="off" onSubmit={onSubmitOrClick}>
      <FormControl required={true}>
        <InputLabel htmlFor="component-simple">New List Name</InputLabel>
        <Input
          id="component-simple"
          value={newListName}
          onChange={handleNewListNameChange}
        />
      </FormControl>
      <Button
        style={{ marginTop: 12, marginLeft: 12 }}
        type={"button"}
        color={"primary"}
        disabled={newListName === ""}
        variant={"contained"}
        onClick={onSubmitOrClick}
      >
        Add
      </Button>
    </form>
  );
};

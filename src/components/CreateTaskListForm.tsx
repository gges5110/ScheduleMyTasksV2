import React, { ChangeEvent, useState } from "react";
import { database } from "../firebase/config";
import { Button, FormControl, Input, InputLabel } from "@material-ui/core";

interface CreateTaskListFormProps {
  readonly userId: string;
}

export const CreateTaskListForm: React.FC<CreateTaskListFormProps> = ({
  userId,
}) => {
  const [newListName, setNewListName] = useState<string>("");
  const createNewTaskList = () => {
    database.ref(`/taskLists/${userId}`).push({
      name: newListName,
      taskCount: 0,
      remainingTaskCount: 0,
    });
    setNewListName("");
  };

  const handleNewListNameChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setNewListName(event.target.value);
  };

  return (
    <form autoComplete="off">
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
        variant={"contained"}
        onClick={createNewTaskList}
      >
        Add
      </Button>
    </form>
  );
};

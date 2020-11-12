import { TaskType } from "../../interfaces/Task";
import React from "react";
import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

const dateOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

interface TaskListItemProps {
  labelId: string;
  task: TaskType;
  taskKey: string;

  onCheck(event: React.ChangeEvent<HTMLInputElement>, taskKey: string): void;
}

export const TaskListItem: React.FC<TaskListItemProps> = ({
  taskKey,
  labelId,
  task,
  onCheck,
}) => {
  const { isDone, startDateTime } = task;
  return (
    <ListItem key={taskKey}>
      <ListItemIcon>
        <Checkbox
          checked={isDone}
          onChange={(event) => onCheck(event, taskKey)}
          inputProps={{ "aria-labelledby": labelId }}
        />
      </ListItemIcon>
      <ListItemText
        style={{
          textDecoration: isDone ? "line-through" : "none",
        }}
        id={labelId}
        primary={task.name}
        secondary={new Date(startDateTime).toLocaleString([], dateOptions)}
      />
    </ListItem>
  );
};

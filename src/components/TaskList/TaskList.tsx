import React from "react";
import { database } from "../../firebase/config";
import { TaskType } from "../../interfaces/Task";
import {
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { useList } from "react-firebase-hooks/database";

interface TaskListProps {
  readonly taskListKey: string;
  readonly taskListName: string;

  openTaskListDialog(): void;
}

export const TaskList: React.FC<TaskListProps> = ({
  taskListKey,
  taskListName,
  openTaskListDialog,
}) => {
  const labelId = `checkbox-list-label-${taskListName}`;

  const [tasks] = useList(
    database.ref(`/tasks/${taskListKey}`).orderByChild("isDone")
  );

  return (
    <List subheader={<>{taskListName}</>} key={taskListKey} dense={true}>
      {tasks &&
        tasks.map((snapshot) => {
          const task: TaskType = snapshot.val();
          const key = snapshot.key || "";

          const onCheck = (
            event: React.ChangeEvent<HTMLInputElement>,
            taskKey: string
          ) => {
            database.ref(`/tasks/${taskListKey}/${taskKey}`).set({
              ...task,
              isDone: event.target.checked,
            });
          };

          return (
            <ListItem key={taskListName}>
              <ListItemIcon>
                <Checkbox
                  checked={task.isDone}
                  onChange={(event) => onCheck(event, key)}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  cursor: "pointer",
                  textDecoration: task.isDone ? "line-through" : "none",
                }}
                id={labelId}
                primary={task.name}
                secondary={new Date(Number(task.dueDate)).toLocaleString()}
                onClick={openTaskListDialog}
              />
            </ListItem>
          );
        })}
      {tasks && Object.keys(tasks).length === 0 && (
        <ListItem role={undefined}>
          <ListItemText
            primary={"Empty list"}
            style={{ cursor: "pointer" }}
            onClick={openTaskListDialog}
          />
        </ListItem>
      )}
    </List>
  );
};

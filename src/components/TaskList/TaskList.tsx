import React from "react";
import { database } from "../../firebase/config";
import { TaskType } from "../../interfaces/Task";
import {
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { useList } from "react-firebase-hooks/database";

interface TaskListProps {
  readonly taskListKey: string;
  readonly taskListName: string;
  readonly userId: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  taskListKey,
  taskListName,
  userId,
}) => {
  const labelId = `checkbox-list-label-${taskListName}`;

  const [tasks] = useList(
    database
      .ref(`/${userId}/tasks/${taskListKey}`)
      .orderByChild("isDoneTimestamp")
  );

  return (
    <List subheader={<>{taskListName}</>} key={taskListKey} dense={true}>
      {tasks &&
        tasks.map((snapshot, index: number) => {
          const task: TaskType = snapshot.val();
          const key = snapshot.key || "";

          const onCheck = (
            event: React.ChangeEvent<HTMLInputElement>,
            taskKey: string
          ) => {
            database.ref(`/${userId}/tasks/${taskListKey}/${taskKey}`).update({
              isDone: event.target.checked,
              isDoneTimestamp: event.target.checked
                ? new Date().valueOf()
                : null,
            });
          };

          const shouldInsertDivider =
            index > 0 && !tasks[index - 1].val().isDone && task.isDone;

          return (
            <>
              {shouldInsertDivider && <Divider />}
              <ListItem key={key}>
                <ListItemIcon>
                  <Checkbox
                    checked={task.isDone}
                    onChange={(event) => onCheck(event, key)}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  style={{
                    textDecoration: task.isDone ? "line-through" : "none",
                  }}
                  id={labelId}
                  primary={task.name}
                  secondary={new Date(task.startDateTime).toLocaleString([], {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
              </ListItem>
            </>
          );
        })}
    </List>
  );
};

import React from "react";
import { database } from "../../firebase/config";
import { TaskType } from "../../interfaces/Task";
import { Divider, List } from "@material-ui/core";
import { useList } from "react-firebase-hooks/database";
import { TaskListItem } from "./TaskListItem";

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
  const taskListPath = `/${userId}/tasks/${taskListKey}`;

  const [tasks] = useList(
    database.ref(taskListPath).orderByChild("isDoneTimestamp")
  );

  return (
    <List subheader={<>{taskListName}</>} key={taskListKey} dense={true}>
      {tasks?.map((snapshot, index: number) => {
        const task: TaskType = snapshot.val();
        const key = snapshot.key || "";

        const onCheck = (
          { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
          taskKey: string
        ) => {
          database.ref(`${taskListPath}/${taskKey}`).update({
            isDone: checked,
            isDoneTimestamp: checked ? new Date().valueOf() : null,
          });
        };

        const shouldInsertDivider =
          index > 0 && !tasks[index - 1].val().isDone && task.isDone;

        return (
          <>
            {shouldInsertDivider && <Divider />}
            <TaskListItem
              key={key}
              taskKey={key}
              labelId={labelId}
              task={task}
              onCheck={onCheck}
            />
          </>
        );
      })}
    </List>
  );
};

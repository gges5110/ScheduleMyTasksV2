import React from "react";
import { database } from "../../firebase/config";
import { TaskType } from "../../interfaces/Task";
import { Divider, List } from "@material-ui/core";
import { TaskListItem } from "./TaskListItem";
import { useTasks } from "../../hooks/useTasks";

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
  const tasksRootPath = `/${userId}/tasks`;

  const [clonedTasks] = useTasks(taskListKey);

  return (
    <List subheader={<>{taskListName}</>} key={taskListKey} dense={true}>
      {clonedTasks.map((snapshot, index: number) => {
        const task: TaskType = snapshot.val();
        const key = snapshot.key || "";

        const onCheck = (
          { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
          taskKey: string
        ) => {
          database.ref(`${tasksRootPath}/${taskKey}`).update({
            isDone: checked,
            isDoneTimestamp: checked ? new Date().valueOf() : null,
          });
        };

        const shouldInsertDivider =
          index > 0 && !clonedTasks[index - 1].val().isDone && task.isDone;
        // debugger;
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

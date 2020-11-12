import React, { useMemo } from "react";
import { database } from "../../firebase/config";
import {
  StringMapType,
  TaskType,
  TaskWithTaskListKeyType,
} from "../../interfaces/Task";
import { useFirebaseQuery } from "../../hooks/useFirebaseQuery";
import { AppointmentModel, ChangeSet } from "@devexpress/dx-react-scheduler";
import { Calendar } from "./Calendar";

interface CalendarContainerProps {
  userId: string;
  readonly scheduleMode: boolean;

  setScheduleMode(scheduleMode: boolean): void;
}

/**
 * Component for extracting necessary information about Tasks for Calendar such
 * that the Calendar component does not have to be aware of them.
 * */
export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  userId,
  ...props
}) => {
  // Tasks for calendar
  const tasksQuery = useMemo(
    () => database.ref(`/${userId}/tasks`).orderByValue(),
    [userId]
  );

  // const [tasks] = useList(tasksQuery);

  const tasksMap: StringMapType<StringMapType<TaskType>> = useFirebaseQuery(
    tasksQuery
  );

  const tasks = convert(tasksMap);

  const onCommitChanges = ({ changed }: ChangeSet) => {
    if (changed) {
      Object.keys(changed).forEach((taskKey) => {
        const task = tasks[taskKey];
        const path = `/${userId}/tasks/${task.taskListKey}/${taskKey}`;
        const change = changed[taskKey];
        database.ref(path).update({
          startDateTime: change.startDate.valueOf(),
          endDateTime: change.endDate.valueOf(),
        });
      });
    }
  };

  return (
    <Calendar
      appointments={convertTaskToAppointmentModel(tasks)}
      onCommitChanges={onCommitChanges}
      {...props}
    />
  );
};

const convertTaskToAppointmentModel = (
  tasks: StringMapType<TaskWithTaskListKeyType>
): AppointmentModel[] => {
  return Object.keys(tasks).map((taskKey) => {
    const task = tasks[taskKey];
    return {
      isDone: task.isDone,
      startDate: task.startDateTime,
      endDate: task.endDateTime,
      title: task.name,
      id: taskKey,
    };
  });
};

const convert = (
  t: StringMapType<StringMapType<TaskType>>
): StringMapType<TaskWithTaskListKeyType> => {
  const taskTypeArray: StringMapType<TaskWithTaskListKeyType> = {};
  Object.keys(t).forEach((taskListKey) => {
    const t1 = t[taskListKey];
    Object.keys(t1).forEach((taskKey) => {
      taskTypeArray[taskKey] = {
        ...t1[taskKey],
        taskListKey: taskListKey,
      };
    });
  });
  return taskTypeArray;
};

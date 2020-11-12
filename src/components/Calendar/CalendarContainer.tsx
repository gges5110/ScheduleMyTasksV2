import React, { useMemo } from "react";
import { database } from "../../firebase/config";
import { TaskType } from "../../interfaces/Task";
import { AppointmentModel, ChangeSet } from "@devexpress/dx-react-scheduler";
import { Calendar } from "./Calendar";
import { useList } from "react-firebase-hooks/database";
import { DataSnapshot } from "../../interfaces/FirebaseTypes";

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

  const [taskDataSnapshots] = useList(tasksQuery);

  const onCommitChanges = ({ changed }: ChangeSet) => {
    if (changed) {
      Object.keys(changed).forEach((taskKey) => {
        const path = `/${userId}/tasks/${taskKey}`;
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
      appointments={convertTaskToAppointmentModel(taskDataSnapshots || [])}
      onCommitChanges={onCommitChanges}
      {...props}
    />
  );
};

const convertTaskToAppointmentModel = (
  taskDataSnapshots: DataSnapshot[]
): AppointmentModel[] => {
  return taskDataSnapshots.map((taskDataSnapshot) => {
    const task: TaskType = taskDataSnapshot.val();
    return {
      title: task.name,
      id: taskDataSnapshot.key || "",
      taskListKay: task.taskListKey,
      isDone: task.isDone,
      startDate: task.startDateTime,
      endDate: task.endDateTime,
    };
  });
};

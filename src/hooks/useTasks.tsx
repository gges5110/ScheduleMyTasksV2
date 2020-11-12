import { useList } from "react-firebase-hooks/database";
import { TaskType } from "../interfaces/Task";
import { useContext, useMemo } from "react";
import { database } from "../firebase/config";
import { DataSnapshot } from "../interfaces/FirebaseTypes";
import { UserContext } from "../contexts/Contexts";

export const useTasks = (taskListKey: string): [DataSnapshot[]] => {
  const user = useContext(UserContext);
  const uid = user?.uid;
  const tasksRootPath = `/${uid}/tasks`;

  const tasksQuery = useMemo(
    () =>
      database
        .ref(tasksRootPath)
        .orderByChild("taskListKey")
        .equalTo(taskListKey),
    [taskListKey, tasksRootPath]
  );

  const [tasks] = useList(tasksQuery);
  // Tasks has to be cloned to avoid issues with in place sorting.
  const clonedTasks = [...(tasks || [])];
  // sort by isDoneTimestamp
  clonedTasks.sort((dataSnapshot1, dataSnapshot2) => {
    const { isDoneTimestamp: isDoneTimestamp1 }: TaskType = dataSnapshot1.val();
    const { isDoneTimestamp: isDoneTimestamp2 }: TaskType = dataSnapshot2.val();
    return (isDoneTimestamp1 || 0) - (isDoneTimestamp2 || 0);
  });

  return [clonedTasks];
};

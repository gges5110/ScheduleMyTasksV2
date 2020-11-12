import { useList } from "react-firebase-hooks/database";
import { TaskListType } from "../interfaces/Task";
import { useContext, useMemo } from "react";
import { database } from "../firebase/config";
import { DataSnapshot } from "../interfaces/FirebaseTypes";
import { UserContext } from "../contexts/Contexts";

export const useTaskLists = (): [DataSnapshot[], boolean] => {
  const user = useContext(UserContext);
  const uid = user?.uid;

  const taskListsQuery = useMemo(
    () => database.ref(`/${uid}/taskLists`).orderByChild("sortingIndex"),
    [uid]
  );

  const [taskLists, loading] = useList(taskListsQuery);
  // Tasks has to be cloned to avoid issues with in place sorting.
  const clonedTaskLists = [...(taskLists || [])];
  // sort by isDoneTimestamp
  clonedTaskLists.sort((dataSnapshot1, dataSnapshot2) => {
    const { sortingIndex: sortingIndex1 }: TaskListType = dataSnapshot1.val();
    const { sortingIndex: sortingIndex2 }: TaskListType = dataSnapshot2.val();
    return sortingIndex1 - sortingIndex2;
  });

  return [clonedTaskLists, loading];
};

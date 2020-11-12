export interface TaskType {
  readonly taskListKey: string;
  readonly name: string;
  readonly isDone: boolean;
  readonly isDoneTimestamp: number | null;
  readonly startDateTime: number;
  readonly endDateTime: number;
}

export interface TaskListType {
  readonly name: string;
  readonly sortingIndex: number;
}

export interface TaskType {
  readonly name: string;
  readonly isDone: boolean;
  readonly isDoneTimestamp: number | null;
  readonly dueDate: number;
  readonly ETA: number;
}

export interface TaskWithTaskListKeyType extends TaskType {
  readonly taskListKey: string;
}

export interface TaskListType {
  readonly name: string;
  readonly sortingIndex: number;
}

export interface StringMapType<T> {
  [index: string]: T;
}

export interface TaskType {
  readonly name: string;
  readonly isDone: boolean;
  readonly isDoneTimestamp: number | null;
  readonly dueDate: number;
  readonly ETA: number;
}

export interface TaskListType {
  readonly name: string;
  readonly taskCount: number;
  readonly remainingTaskCount: number;
}

export interface StringMapType<T> {
  [index: string]: T;
}

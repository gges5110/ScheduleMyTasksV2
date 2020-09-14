export interface TaskType {
  readonly name: string;
  readonly isDone: boolean;
  readonly isDoneTimestamp: number | null;
  readonly dueDate: number;
  readonly ETA: number;
}

export interface TaskListType {
  readonly name: string;
}

export interface StringMapType<T> {
  [index: string]: T;
}

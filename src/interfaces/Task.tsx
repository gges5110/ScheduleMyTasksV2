export interface TaskType {
  readonly name: string;
  readonly isDone: boolean;
  readonly dueDate: string;
  readonly ETA: string;
}

export interface TaskListType {
  readonly name: string;
  readonly taskCount: number;
  readonly remainingTaskCount: number;
}

export interface StringMapType<T> {
  [index: string]: T;
}

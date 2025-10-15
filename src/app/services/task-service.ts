import { Task } from '../dto/Task';

export abstract class TaskService {
  public abstract getTasks(): Array<Task>;

  public abstract saveTask(
    taskId: string | null,
    taskDescription: string,
  ): Task;

  public abstract deleteTask(taskId: string): void;

  public abstract toggleTaskCompletionState(taskId: string): void;
}

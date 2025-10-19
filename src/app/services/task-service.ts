import { Observable } from "rxjs";

import { Task } from '../dto/Task';


export abstract class TaskService {

  public abstract getTasks(uncompletedTasksOnly: boolean): Observable<Task[]>;

  public abstract saveTask(
    taskId: string | null,
    taskDescription: string
  ): Observable<Task>;

  public abstract deleteTask(taskId: string): Observable<void>;

  public abstract toggleTaskCompletionState(taskId: string): Observable<Task>;
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { concatMap, Observable, of } from "rxjs";

import { Task } from '../dto/Task';
import { TaskService } from "./task-service";


const BASE_URL = 'http://localhost:3001'

@Injectable({
  providedIn: 'root'
})
export class TaskServiceFakeHttp extends TaskService {

  private httpClient = inject(HttpClient);

  private getTask(taskId: string): Observable<Task> {
    return (
      this.httpClient
        .get<Task[]>(`${BASE_URL}/tasks?id=${taskId}`)
        .pipe(concatMap(tasks => of(tasks[0])))
    );
  }

  public override getTasks(uncompletedTasksOnly: boolean): Observable<Task[]> {
    let url = `${BASE_URL}/tasks`;

    if (uncompletedTasksOnly) {
      url = `${url}?isCompleted=false`;
    }

    return this.httpClient.get<Task[]>(url);
  }

  public override saveTask(
    taskId: string | null,
    taskDescription: string,
  ): Observable<Task> {
    if (taskId === null) {
      return this.addTask(Task.of(taskDescription));
    } else {
      return (
        this.getTask(taskId).pipe(
          concatMap(task => {
            task.description = taskDescription;
            return this.updateTask(task);
          })
        )
      );
    }
  }

  private addTask(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(`${BASE_URL}/tasks`, task);
  }

  private updateTask(task: Task): Observable<Task> {
    return this.httpClient.patch<Task>(`${BASE_URL}/tasks/${task.id}`, task);
  }

  public override deleteTask(taskId: string): Observable<void> {
    return this.httpClient.delete<void>(`${BASE_URL}/tasks/${taskId}`);
  }

  public override toggleTaskCompletionState(taskId: string): Observable<Task> {
    return (
      this.getTask(taskId).pipe(
        concatMap(task => {
          task.isCompleted = !task.isCompleted;
          return this.updateTask(task);
        })
      )
    );
  }
}

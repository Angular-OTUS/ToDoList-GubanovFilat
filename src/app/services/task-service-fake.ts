import { Injectable } from '@angular/core';

import { TaskService } from './task-service';
import { Task } from '../dto/Task';

@Injectable({
  providedIn: 'root',
})
export class TaskServiceFake extends TaskService {
  private tasks = new Array<Task>(
    Task.of('Buy a new gaming laptop'),
    Task.of('Complete previous task'),
    Task.of('Create some angular app'),
    Task.of(
      'Lorem ipsum dolor sit amet, ' +
        'consectetur adipiscing elit, ' +
        'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ),
    Task.of(
      '12345678901234567890123456789012345678901234567890123' +
        '45678901234567890123456789012345678901234567890',
    ),
  );

  private isSuccess(): boolean {
    return Math.random() > 0.5 ? true : false;
  }

  public override getTasks(): Array<Task> {
    if (!this.isSuccess()) {
      throw new Error();
    }

    return this.tasks.map((task) => task.clone());
  }

  public override saveTask(
    taskId: string | null,
    taskDescription: string,
  ): Task {
    if (!this.isSuccess()) {
      throw new Error();
    }

    let taskToReturn!: Task;
    if (taskId === null) {
      taskToReturn = Task.of(taskDescription);
      this.tasks.push(taskToReturn.clone());
    } else {
      const taskInTheStorage = this.tasks.find((task) => task.id === taskId);
      if (taskInTheStorage) {
        taskInTheStorage.description = taskDescription;
        taskToReturn = taskInTheStorage.clone();
      } else {
        taskToReturn = Task.of(taskDescription);
        this.tasks.push(taskToReturn.clone());
      }
    }
    return taskToReturn;
  }

  public override deleteTask(taskId: string): void {
    if (!this.isSuccess()) {
      throw new Error();
    }

    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Task } from '../../dto/Task';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';

@Component({
  selector: 'app-to-do-list',
  imports: [FormsModule, ToDoListItem],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css',
})
export class ToDoList {
  protected tasks = new Array<Task>(
    Task.of('Buy a new gaming laptop'),
    Task.of('Complete previous task'),
    Task.of('Create some angular app'),
    Task.of(
      `Lorem ipsum dolor sit amet,
       consectetur adipiscing elit,
       sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
    )
  );

  protected newTaskDescription: string = '';

  protected onDelete(taskId: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  protected onAdd(event: Event): void {
    event.preventDefault();

    this.newTaskDescription = this.newTaskDescription.trim();

    if (!this.newTaskDescription) {
      return;
    }

    this.tasks.push(Task.of(this.newTaskDescription));

    this.newTaskDescription = '';
  }
}

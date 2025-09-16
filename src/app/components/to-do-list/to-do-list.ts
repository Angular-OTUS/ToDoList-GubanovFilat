import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Task } from '../../dto/Task';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { Loader } from '../loader/loader';
import { Button } from '../button/button';
import { Tooltip } from '../../directives/tooltip';

enum InputPlaceholder {
  ADD_NEW_TODO = 'Add your new task',
  EDIT_TODO = 'Edit the task you have selected',
}

@Component({
  selector: 'app-to-do-list',
  imports: [FormsModule, ToDoListItem, Loader, Button, Tooltip],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css',
})
export class ToDoList implements OnInit {
  protected tasks = new Array<Task>(
    Task.of('Buy a new gaming laptop'),
    Task.of('Complete previous task'),
    Task.of('Create some angular app'),
    Task.of(
      'Lorem ipsum dolor sit amet, ' +
        'consectetur adipiscing elit, ' +
        'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ),
  );

  @ViewChild('textarea')
  private textarea!: ElementRef;

  protected inputPlaceholder = InputPlaceholder.ADD_NEW_TODO;

  protected taskDescription: string = '';
  protected taskId: string | null = null;

  protected isLoading = true;

  public ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }

  protected onDelete(taskId: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);

    this.setFocusIntoTextarea();
  }

  protected onSave(event: Event): void {
    event.preventDefault();

    this.taskDescription = this.taskDescription.trim();

    if (!this.taskDescription) {
      return;
    }

    this.saveTask();

    this.taskDescription = '';
    this.taskId = null;

    this.inputPlaceholder = InputPlaceholder.ADD_NEW_TODO;
    this.setFocusIntoTextarea();
  }

  protected onItemClick(taskId: string) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      this.taskId = task.id;
      this.taskDescription = task.description;

      this.inputPlaceholder = InputPlaceholder.EDIT_TODO;

      this.setFocusIntoTextarea();
    }
  }

  protected onTextareaKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSave(event);
    }
  }

  private setFocusIntoTextarea() {
    (this.textarea.nativeElement as HTMLTextAreaElement).focus();
  }

  private saveTask() {
    if (this.taskId === null) {
      this.tasks.push(Task.of(this.taskDescription));
    } else {
      const task = this.tasks.find((task) => task.id === this.taskId);
      if (task) {
        task.description = this.taskDescription;
      } else {
        this.tasks.push(Task.of(this.taskDescription));
      }
    }
  }
}

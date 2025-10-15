import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Task } from '../../dto/Task';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { Loader } from '../loader/loader';
import { Button } from '../button/button';
import { Tooltip } from '../../directives/tooltip';
import { TaskService } from '../../services/task-service';
import { ToastService } from '../../services/toast-service';

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
  protected tasks: Array<Task> = new Array();

  @ViewChild('textarea')
  private textarea!: ElementRef;

  protected inputPlaceholder = InputPlaceholder.ADD_NEW_TODO;

  protected taskDescription: string = '';
  protected taskId: string | null = null;

  protected isLoading = true;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
  ) {}

  public ngOnInit(): void {
    setTimeout(() => {
      try {
        this.tasks = this.taskService.getTasks();
      } catch (error) {
        this.toastService.error('We are really sorry!', 'Something went wrong when accessing storage.');
      }

      this.isLoading = false;
    }, 1500);
  }

  protected onReload(): void {
    try {
      this.tasks = this.taskService.getTasks();

      this.toastService.success('Congratulations!', 'The tasks information has been successfully reloaded from storage.');
    } catch (error) {
      this.toastService.error('We are really sorry!', 'Something went wrong when accessing storage.');
    }

    this.setFocusIntoTextarea();
  }

  protected onComplete(taskId: string): void {
    try {
      this.taskService.toggleTaskCompletionState(taskId);

      this.tasks.forEach((task) => {
        if (task.id === taskId) {
          task.isCompleted = !task.isCompleted;
        }
      });

      this.toastService.success('Congratulations!', 'The task completion status has been changed successfully.');
    } catch (error) {
      this.toastService.error('We are really sorry!', 'Something went wrong when accessing storage.');
    }

    this.setFocusIntoTextarea();
  }

  protected onDelete(taskId: string): void {
    try {
      this.taskService.deleteTask(taskId);

      this.tasks = this.tasks.filter((task) => task.id !== taskId);

      this.toastService.success('Congratulations!', 'The task has been successfully deleted from storage.');
    } catch (error) {
      this.toastService.error('We are really sorry!', 'Something went wrong when accessing storage.');
    }

    this.setFocusIntoTextarea();
  }

  protected onSave(event: Event): void {
    event.preventDefault();

    this.taskDescription = this.taskDescription.trim();

    if (!this.taskDescription) {
      return;
    }

    try {
      const task = this.taskService.saveTask(this.taskId, this.taskDescription);

      if (!this.taskId) {
        this.tasks.push(task);
      } else {
        const index = this.tasks.findIndex((item) => item.id === task.id);
        if (index != -1) {
          this.tasks[index] = task;
        }
      }

      this.taskDescription = '';
      this.taskId = null;

      this.inputPlaceholder = InputPlaceholder.ADD_NEW_TODO;

      this.toastService.success('Congratulations!', 'The task has been successfully saved to storage.');
    } catch (error) {
      this.toastService.error('We are really sorry!', 'Something went wrong when accessing storage.');
    }

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
}

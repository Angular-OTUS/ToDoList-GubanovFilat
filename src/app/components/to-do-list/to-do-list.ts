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

const FILTER_UNCOMPLETED_TASKS_ONLY_LABEL = "Load from storage uncompleted tasks only";

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

  protected filterUncompletedTasksOnlyLabel = "";

  private filterUncompletedTasksOnlyIsEnabled = true;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
  ) {
    this.determineFilterUncompletedTasksOnlyLabel();
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.taskService
        .getTasks(this.filterUncompletedTasksOnlyIsEnabled)
        .subscribe({
          next: (tasks: Task[]) => this.tasks = tasks,
          error: () => this.toastService.error('We are really sorry!', 'Something went wrong when accessing storage.')
        });

      this.isLoading = false
    }, 1500);
  }

  protected onReload(): void {
    this.taskService
      .getTasks(this.filterUncompletedTasksOnlyIsEnabled)
      .subscribe({
        next: (tasks: Task[]) => {
          this.tasks = tasks;
          this.toastService.success('Congratulations!', 'The tasks information has been successfully reloaded from storage.');
        },
        error: () => this.toastService.error('We are really sorry!', 'Something went wrong when accessing storage.')
      });

    this.setFocusIntoTextarea()
  }

  protected onFilterUncompletedTasksOnlyToggle() {
    const filterUncompletedTasksOnlyIsEnabled = !this.filterUncompletedTasksOnlyIsEnabled;

    this.taskService
      .getTasks(filterUncompletedTasksOnlyIsEnabled)
      .subscribe({
        next: (tasks: Task[]) => {
          this.tasks = tasks

          this.toastService.success('Congratulations!', 'The new filter value has been successfully applied.');

          this.filterUncompletedTasksOnlyIsEnabled = filterUncompletedTasksOnlyIsEnabled;
          this.determineFilterUncompletedTasksOnlyLabel();
        },
        error: () => this.toastService.error('We are really sorry!', 'Something went wrong when accessing storage.')
      });

    this.setFocusIntoTextarea();
  }

  protected onComplete(taskId: string): void {
    this.taskService
      .toggleTaskCompletionState(taskId)
      .subscribe({
        next: () => {
          this.tasks.forEach((task) => {
            if (task.id === taskId) {
              task.isCompleted = !task.isCompleted;
            }
          });

          this.toastService.success('Congratulations!', 'The task completion status has been changed successfully.');
        },
        error: () => this.toastService.error('We are really sorry!', 'Something went wrong when accessing storage.')
      });

    this.setFocusIntoTextarea();
  }

  protected onDelete(taskId: string): void {
    this.taskService
      .deleteTask(taskId)
      .subscribe({
        next: () => {
          this.tasks = this.tasks.filter((task) => task.id !== taskId);
          this.toastService.success('Congratulations!', 'The task has been successfully deleted from storage.');
        },
        error: () => this.toastService.error('We are really sorry!', 'Something went wrong when accessing storage.')
      });

    this.setFocusIntoTextarea();
  }

  protected onSave(event: Event): void {
    event.preventDefault();

    this.taskDescription = this.taskDescription.trim();

    if (!this.taskDescription) {
      return;
    }

    this.taskService
      .saveTask(this.taskId, this.taskDescription)
      .subscribe({
        next: (task: Task) => {
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
        },
        error: () => this.toastService.error('We are really sorry!', 'Something went wrong when accessing storage.')
      });

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

  private determineFilterUncompletedTasksOnlyLabel() {
    this.filterUncompletedTasksOnlyLabel =
      this.filterUncompletedTasksOnlyIsEnabled
        ? `${FILTER_UNCOMPLETED_TASKS_ONLY_LABEL}: YES`
        : `${FILTER_UNCOMPLETED_TASKS_ONLY_LABEL}: NO`
    ;
  }
}

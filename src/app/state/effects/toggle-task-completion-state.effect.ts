import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap } from 'rxjs';

import {
  toggleTaskCompletionStateActionCreator,
  toggleTaskCompletionStateSuccessActionCreator,
  toggleTaskCompletionStateFailureActionCreator,
} from '../actions/toggle-task-completion-state.actions';
import { TaskService } from '../../services/task-service';
import { Task } from '../../dto/Task';
import { ToastService } from '../../services/toast-service';
import  { TODO_LIST_PATH } from '../../app.routes';

@Injectable({
  providedIn: 'root',
})
export class ToggleTaskCompletionStateEffect {
  private readonly actions$ = inject(Actions);
  private readonly taskService = inject(TaskService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  effect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleTaskCompletionStateActionCreator),
      switchMap(({ taskId }) =>
        this.taskService.toggleTaskCompletionState(taskId).pipe(
          map((task: Task) => {
            this.router.navigate([TODO_LIST_PATH]);

            this.toastService.success(
              'Congratulations!',
              'The task completion status has been changed successfully.',
            );

            return toggleTaskCompletionStateSuccessActionCreator({
              task: task,
            });
          }),
          catchError(() => {
            this.toastService.error(
              'We are really sorry!',
              'Something went wrong when accessing the storage.',
            );
            return of(toggleTaskCompletionStateFailureActionCreator());
          }),
        ),
      ),
    ),
  );
}

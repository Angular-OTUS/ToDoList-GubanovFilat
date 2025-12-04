import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap } from 'rxjs';

import {
  deleteTaskActionCreator,
  deleteTaskSuccessActionCreator,
  deleteTaskFailureActionCreator,
} from '../actions/delete-tasks.actions';
import { TaskService } from '../../services/task-service';
import { ToastService } from '../../services/toast-service';
import { TODO_LIST_PATH } from '../../app.routes';

@Injectable({
  providedIn: 'root',
})
export class DeleteTaskEffect {
  private readonly actions$ = inject(Actions);
  private readonly taskService = inject(TaskService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  effect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTaskActionCreator),
      switchMap(({ taskId }) =>
        this.taskService.deleteTask(taskId).pipe(
          map(() => {
            this.router.navigate([TODO_LIST_PATH]);

            this.toastService.success(
              'Congratulations!',
              'The task has been successfully deleted from the storage.',
            );

            return deleteTaskSuccessActionCreator({ taskId });
          }),
          catchError(() => {
            this.toastService.error(
              'We are really sorry!',
              'Something went wrong when accessing the storage.',
            );
            return of(deleteTaskFailureActionCreator());
          }),
        ),
      ),
    ),
  );
}

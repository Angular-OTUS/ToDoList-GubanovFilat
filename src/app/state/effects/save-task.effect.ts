import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap } from 'rxjs';

import {
  saveTaskActionCreator,
  saveTaskSuccessActionCreator,
  saveTaskFailureActionCreator,
} from '../actions/save-task.actions';
import { TaskService } from '../../services/task-service';
import { Task } from '../../dto/Task';
import { ToastService } from '../../services/toast-service';
import { TODO_LIST_PATH } from '../../app.routes';

@Injectable({
  providedIn: 'root',
})
export class SaveTaskEffect {
  private readonly actions$ = inject(Actions);
  private readonly taskService = inject(TaskService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  effect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveTaskActionCreator),
      switchMap(({ taskId, taskDescription }) =>
        this.taskService.saveTask(taskId, taskDescription).pipe(
          map((task: Task) => {
            this.router.navigate([TODO_LIST_PATH]);

            this.toastService.success(
              'Congratulations!',
              'The task has been successfully saved to the storage.',
            );

            return saveTaskSuccessActionCreator({ task: task });
          }),
          catchError((err: unknown) => {
            if (err instanceof HttpErrorResponse) {
              return of(
                saveTaskFailureActionCreator({
                  errors: err.error.errors,
                }),
              );
            } else {
              this.toastService.error(
                'We are really sorry!',
                'Something went wrong when accessing the storage.',
              );
              return of(
                saveTaskFailureActionCreator({
                  errors: null,
                }),
              );
            }
          }),
        ),
      ),
    ),
  );
}

import { inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap, tap } from 'rxjs';

import {
  getTasksActionCreator,
  getTasksFailureActionCreator,
  getTasksSuccessActionCreator,
} from '../actions/get-tasks.actions';
import { TaskService } from '../../services/task-service';
import { Task } from '../../dto/Task';
import { ToastService } from '../../services/toast-service';

@Injectable({
  providedIn: 'root',
})
export class GetTasksEffect {
  private readonly actions$ = inject(Actions);
  private readonly taskService = inject(TaskService);
  private readonly toastService = inject(ToastService);

  effect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTasksActionCreator),
      switchMap(
        ({
          uncompletedTasksOnly,
          onReload,
          onFilterUncompletedTasksOnlyToggle,
        }) =>
          this.taskService.getTasks(uncompletedTasksOnly).pipe(
            tap(() => {
              if (onReload) {
                this.toastService.success(
                  'Congratulations!',
                  'The tasks information has been successfully reloaded from the storage.',
                );
              }
              if (onFilterUncompletedTasksOnlyToggle) {
                this.toastService.success(
                  'Congratulations!',
                  'The new filter value has been successfully applied.',
                );
              }
            }),
            map((tasks: Array<Task>) =>
              getTasksSuccessActionCreator({ tasks, uncompletedTasksOnly }),
            ),
            catchError(() => {
              this.toastService.error(
                'We are really sorry!',
                'Something went wrong when accessing the storage.',
              );
              return of(getTasksFailureActionCreator());
            }),
          ),
      ),
    ),
  );
}

import { createAction, props } from '@ngrx/store';

import { ActionType } from '../ActionType';
import { Task } from '../../dto/Task';

export const getTasksActionCreator = createAction(
  ActionType.GET_TASKS,
  props<{
    uncompletedTasksOnly: boolean;
    onReload: boolean;
    onFilterUncompletedTasksOnlyToggle: boolean;
  }>(),
);

export const getTasksSuccessActionCreator = createAction(
  ActionType.GET_TASKS_SUCCESS,
  props<{ tasks: Array<Task>; uncompletedTasksOnly: boolean }>(),
);

export const getTasksFailureActionCreator = createAction(
  ActionType.GET_TASKS_FAILURE,
);

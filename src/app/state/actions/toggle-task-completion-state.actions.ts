import { createAction, props } from '@ngrx/store';

import { ActionType } from '../ActionType';
import { Task } from '../../dto/Task';

export const toggleTaskCompletionStateActionCreator = createAction(
  ActionType.TOGGLE_TASK_COMPLETION_STATE_TASK,
  props<{ taskId: string }>(),
);

export const toggleTaskCompletionStateSuccessActionCreator = createAction(
  ActionType.TOGGLE_TASK_COMPLETION_STATE_TASK_SUCCESS,
  props<{ task: Task }>(),
);

export const toggleTaskCompletionStateFailureActionCreator = createAction(
  ActionType.TOGGLE_TASK_COMPLETION_STATE_TASK_FAILURE,
);

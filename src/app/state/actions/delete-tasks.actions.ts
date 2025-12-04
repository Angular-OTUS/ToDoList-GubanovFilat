import { createAction, props } from '@ngrx/store';

import { ActionType } from '../ActionType';

export const deleteTaskActionCreator = createAction(
  ActionType.DELETE_TASK,
  props<{ taskId: string }>(),
);

export const deleteTaskSuccessActionCreator = createAction(
  ActionType.DELETE_TASK_SUCCESS,
  props<{ taskId: string }>(),
);

export const deleteTaskFailureActionCreator = createAction(
  ActionType.DELETE_TASK_FAILURE,
);

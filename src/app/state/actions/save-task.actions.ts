import { createAction, props } from '@ngrx/store';

import { ActionType } from '../ActionType';
import { Task } from '../../dto/Task';
import { BackendErrors } from '../../dto/BackendErrors';

export const saveTaskActionCreator = createAction(
  ActionType.SAVE_TASK,
  props<{ taskId: string | null; taskDescription: string }>(),
);

export const saveTaskSuccessActionCreator = createAction(
  ActionType.SAVE_TASK_SUCCESS,
  props<{ task: Task }>(),
);

export const saveTaskFailureActionCreator = createAction(
  ActionType.SAVE_TASK_FAILURE,
  props<{ errors: BackendErrors | null }>(),
);

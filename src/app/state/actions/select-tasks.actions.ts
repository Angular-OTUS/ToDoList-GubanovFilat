import { createAction, props } from '@ngrx/store';

import { ActionType } from '../ActionType';

export const selectTaskActionCreator = createAction(
  ActionType.SELECT_TASK,
  props<{ taskId: string }>(),
);

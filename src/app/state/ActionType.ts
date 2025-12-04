export enum ActionType {
  // getTasks ->
  GET_TASKS = '[TODO] getTasks',
  GET_TASKS_SUCCESS = '[TODO] getTasks success',
  GET_TASKS_FAILURE = '[TODO] getTasks failure',

  // saveTask ->
  SAVE_TASK = '[TODO] saveTask',
  SAVE_TASK_SUCCESS = '[TODO] saveTask success',
  SAVE_TASK_FAILURE = '[TODO] saveTask failure',

  // deleteTask ->
  DELETE_TASK = '[TODO] deleteTask',
  DELETE_TASK_SUCCESS = '[TODO] deleteTask success',
  DELETE_TASK_FAILURE = '[TODO] deleteTask failure',

  // toggleTaskCompletionState ->
  TOGGLE_TASK_COMPLETION_STATE_TASK = '[TODO] toggleTaskCompletionState',
  TOGGLE_TASK_COMPLETION_STATE_TASK_SUCCESS = '[TODO] toggleTaskCompletionState success',
  TOGGLE_TASK_COMPLETION_STATE_TASK_FAILURE = '[TODO] toggleTaskCompletionState failure',

  // selectTask ->
  SELECT_TASK = '[TODO] selectTask',
}

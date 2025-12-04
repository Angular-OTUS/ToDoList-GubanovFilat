import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { Task } from '../dto/Task';
import { BackendErrors } from '../dto/BackendErrors';
import {
  getTasksActionCreator,
  getTasksFailureActionCreator,
  getTasksSuccessActionCreator,
} from './actions/get-tasks.actions';
import { toggleTaskCompletionStateSuccessActionCreator } from './actions/toggle-task-completion-state.actions';
import { deleteTaskSuccessActionCreator } from './actions/delete-tasks.actions';
import { selectTaskActionCreator } from './actions/select-tasks.actions';
import {
  saveTaskActionCreator,
  saveTaskFailureActionCreator,
  saveTaskSuccessActionCreator,
} from './actions/save-task.actions';

export interface State {
  isLoading: boolean;

  tasks: Array<Task>;

  filterUncompletedTasksOnlyIsEnabled: boolean;

  filterUncompletedTasksOnlyLabel: string;

  selectedId: string | null;

  inputPlaceholder: string;

  isAddingNewTaskProcessCompleted: boolean;

  validationErrors: BackendErrors | null;
}

enum InputPlaceholder {
  ADD_NEW_TODO = 'Add your new task',
  EDIT_TODO = 'Edit the task you have selected',
}

const FILTER_UNCOMPLETED_TASKS_ONLY_LABEL =
  'Load from the storage uncompleted tasks only';

function determineFilterUncompletedTasksOnlyLabel(
  filterUncompletedTasksOnlyIsEnabled: boolean,
) {
  return filterUncompletedTasksOnlyIsEnabled
    ? `${FILTER_UNCOMPLETED_TASKS_ONLY_LABEL}: YES`
    : `${FILTER_UNCOMPLETED_TASKS_ONLY_LABEL}: NO`;
}

const initialState: State = {
  isLoading: false,
  tasks: [],
  filterUncompletedTasksOnlyIsEnabled: true,
  filterUncompletedTasksOnlyLabel:
    determineFilterUncompletedTasksOnlyLabel(true),
  selectedId: null,
  inputPlaceholder: InputPlaceholder.ADD_NEW_TODO,
  isAddingNewTaskProcessCompleted: true,
  validationErrors: null,
};

const reducer = createReducer(
  initialState,
  on(
    getTasksActionCreator,
    (state): State => ({
      ...state,
      isLoading: true,
      selectedId: null,
      validationErrors: null,
    }),
  ),
  on(
    getTasksSuccessActionCreator,
    (state, action): State => ({
      ...state,
      isLoading: false,
      selectedId: null,
      tasks: action.tasks,
      filterUncompletedTasksOnlyIsEnabled: action.uncompletedTasksOnly,
      filterUncompletedTasksOnlyLabel: determineFilterUncompletedTasksOnlyLabel(
        action.uncompletedTasksOnly,
      ),
    }),
  ),
  on(
    getTasksFailureActionCreator,
    (state): State => ({
      ...state,
      isLoading: false,
    }),
  ),
  on(
    toggleTaskCompletionStateSuccessActionCreator,
    (state, action): State => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === action.task.id ? action.task : task,
      ),
      selectedId: null,
    }),
  ),
  on(
    deleteTaskSuccessActionCreator,
    (state, action): State => ({
      ...state,
      tasks: state.tasks.filter((task) => task.id !== action.taskId),
      selectedId: null,
    }),
  ),
  on(
    selectTaskActionCreator,
    (state, action): State => ({
      ...state,
      selectedId: action.taskId,
    }),
  ),
  on(saveTaskActionCreator, (state, action): State => {
    const index = state.tasks.findIndex((task) => task.id === action.taskId);
    if (index === -1) {
      return {
        ...state,
        isAddingNewTaskProcessCompleted: false,
      };
    } else {
      return {
        ...state,
      };
    }
  }),
  on(saveTaskSuccessActionCreator, (state, action): State => {
    const index = state.tasks.findIndex((task) => task.id === action.task.id);
    if (index === -1) {
      return {
        ...state,
        tasks: [...state.tasks, action.task],
        validationErrors: null,
        isAddingNewTaskProcessCompleted: true,
      };
    } else {
      return {
        ...state,
        selectedId: null,
        tasks: state.tasks.map((task) =>
          task.id === action.task.id ? action.task : task,
        ),
        validationErrors: null,
      };
    }
  }),
  on(
    saveTaskFailureActionCreator,
    (state, action): State => ({
      ...state,
      validationErrors: action.errors,
    }),
  ),
);

export const todoFeature = createFeature({
  name: 'todoFeature',
  reducer,
  extraSelectors: ({ selectSelectedId, selectTasks }) => ({
    selectSelectedTask: createSelector(
      selectSelectedId,
      selectTasks,
      (selectedId, tasks) => tasks.find((task) => task.id === selectedId),
    ),
    selectInputPlaceholder: createSelector(selectSelectedId, (selectedId) =>
      !!selectedId ? InputPlaceholder.EDIT_TODO : InputPlaceholder.ADD_NEW_TODO,
    ),
  }),
});

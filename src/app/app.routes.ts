import { Routes } from '@angular/router';

import { ToDoList } from './components/to-do-list/to-do-list';
import { TodoCreateEditItem } from './components/todo-create-edit-item/todo-create-edit-item';

export const TODO_LIST_PATH = 'tasks';

export const routes: Routes = [
  {
    path: '',
    redirectTo: TODO_LIST_PATH,
    pathMatch: 'full',
  },
  {
    path: TODO_LIST_PATH,
    component: ToDoList,
    children: [
      {
        path: ':id',
        component: TodoCreateEditItem,
      },
      {
        path: '',
        pathMatch: 'full',
        component: TodoCreateEditItem,
      },
    ],
  },
  {
    path: '**',
    redirectTo: TODO_LIST_PATH,
  },
];

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { TaskService } from './services/task-service';
import { TaskServiceFakeHttp } from './services/task-service-fake-http';
import { GetTasksEffect } from './state/effects/get-tasks.effect';
import { SaveTaskEffect } from './state/effects/save-task.effect';
import { todoFeature } from './state/todo.feature';
import { ToggleTaskCompletionStateEffect } from './state/effects/toggle-task-completion-state.effect';
import { DeleteTaskEffect } from './state/effects/delete-task.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: TaskService, useExisting: TaskServiceFakeHttp },
    provideStore(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideState(todoFeature),
    provideEffects(
      GetTasksEffect,
      SaveTaskEffect,
      ToggleTaskCompletionStateEffect,
      DeleteTaskEffect,
    ),
  ],
};

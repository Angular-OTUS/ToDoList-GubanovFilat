import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { Observable, Subject, takeUntil } from 'rxjs';

import { Task } from '../../dto/Task';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { Loader } from '../loader/loader';
import { Button } from '../button/button';
import { Tooltip } from '../../directives/tooltip';
import { State, todoFeature } from '../../state/todo.feature';
import { getTasksActionCreator } from '../../state/actions/get-tasks.actions';
import { toggleTaskCompletionStateActionCreator } from '../../state/actions/toggle-task-completion-state.actions';
import { deleteTaskActionCreator } from '../../state/actions/delete-tasks.actions';
import { TODO_LIST_PATH } from '../../app.routes';

@Component({
  selector: 'app-to-do-list',
  imports: [
    FormsModule,
    ToDoListItem,
    Loader,
    Button,
    Tooltip,
    AsyncPipe,
    RouterOutlet,
  ],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css',
})
export class ToDoList implements OnInit, OnDestroy {
  protected isLoading$!: Observable<boolean>;

  protected tasks$!: Observable<Array<Task>>;

  protected selectedId: string | null = null;

  protected filterUncompletedTasksOnlyLabel$!: Observable<string>;

  private filterUncompletedTasksOnlyIsEnabled = true;

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private readonly store: Store<State>,
    private readonly router: Router,
  ) {
  }

  public ngOnInit(): void {
    this.attachState();

    this.store.dispatch(
      getTasksActionCreator({
        uncompletedTasksOnly: this.filterUncompletedTasksOnlyIsEnabled,
        onReload: false,
        onFilterUncompletedTasksOnlyToggle: false,
      }),
    );
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  protected onReload(): void {
    this.store.dispatch(
      getTasksActionCreator({
        uncompletedTasksOnly: this.filterUncompletedTasksOnlyIsEnabled,
        onReload: true,
        onFilterUncompletedTasksOnlyToggle: false,
      }),
    );
  }

  protected onFilterUncompletedTasksOnlyToggle() {
    this.store.dispatch(
      getTasksActionCreator({
        uncompletedTasksOnly: !this.filterUncompletedTasksOnlyIsEnabled,
        onReload: false,
        onFilterUncompletedTasksOnlyToggle: true,
      }),
    );
  }

  protected onComplete(taskId: string): void {
    this.store.dispatch(
      toggleTaskCompletionStateActionCreator({
        taskId: taskId,
      }),
    );
  }

  protected onDelete(taskId: string): void {
    this.store.dispatch(
      deleteTaskActionCreator({
        taskId: taskId,
      }),
    );
  }

  protected onItemClick(taskId: string) {
    this.router.navigate([TODO_LIST_PATH, taskId]);
  }

  private attachState() {
    this.isLoading$ = this.store.select(todoFeature.selectIsLoading);

    this.tasks$ = this.store.pipe(select(todoFeature.selectTasks));

    this.store
      .pipe(
        takeUntil(this.componentDestroyed$),
        select(todoFeature.selectFilterUncompletedTasksOnlyIsEnabled),
      )
      .subscribe(
        (selectFilterUncompletedTasksOnlyIsEnabled: boolean) =>
          (this.filterUncompletedTasksOnlyIsEnabled =
            selectFilterUncompletedTasksOnlyIsEnabled),
      );

    this.filterUncompletedTasksOnlyLabel$ = this.store.select(
      todoFeature.selectFilterUncompletedTasksOnlyLabel,
    );

    this.store
      .pipe(takeUntil(this.componentDestroyed$), select(todoFeature.selectSelectedId))
      .subscribe((selectSelectedId) =>
        setTimeout(() => {
          this.selectedId = selectSelectedId;
        }, 0),
      );
  }
}

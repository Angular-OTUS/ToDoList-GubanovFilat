import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { Observable, Subject, takeUntil, tap } from 'rxjs';

import { Button } from '../button/button';
import { BackendErrors } from '../../dto/BackendErrors';
import { ValidationErrors } from '../validation-errors/validation-errors';
import { State, todoFeature } from '../../state/todo.feature';
import { saveTaskActionCreator } from '../../state/actions/save-task.actions';
import { Task } from '../../dto/Task';
import { selectTaskActionCreator } from '../../state/actions/select-tasks.actions';

@Component({
  selector: 'app-todo-create-edit-item',
  imports: [FormsModule, AsyncPipe, Button, ValidationErrors],
  templateUrl: './todo-create-edit-item.html',
  styleUrl: './todo-create-edit-item.css',
})
export class TodoCreateEditItem implements OnInit, OnDestroy {
  @ViewChild('textarea')
  private textarea!: ElementRef;

  protected inputPlaceholder$!: Observable<string>;

  protected taskDescription: string = '';

  protected taskId: string | null = null;

  protected backendErrors$!: Observable<BackendErrors | null>;

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private readonly store: Store<State>,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.attachState();

    this.activatedRoute.paramMap
      .pipe(
        takeUntil(this.componentDestroyed$),
        tap((params) => {
          const taskId = params.get('id');
          if (taskId) {
            this.store.dispatch(
              selectTaskActionCreator({
                taskId,
              }),
            );
          }
        }),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  protected onSave(event: Event): void {
    event.preventDefault();

    this.taskDescription = this.taskDescription.trim();

    if (!this.taskDescription) {
      return;
    }

    this.store.dispatch(
      saveTaskActionCreator({
        taskId: this.taskId,
        taskDescription: this.taskDescription,
      }),
    );
  }

  protected onTextareaKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSave(event);
    }
  }

  private attachState() {
    this.inputPlaceholder$ = this.store.select(
      todoFeature.selectInputPlaceholder,
    );

    this.store
      .pipe(
        takeUntil(this.componentDestroyed$),
        select(todoFeature.selectIsAddingNewTaskProcessCompleted),
      )
      .subscribe((isAddingNewTaskProcessCompleted: boolean) => {
        if (isAddingNewTaskProcessCompleted) {
          this.taskDescription = '';
        }
      });

    this.store
      .pipe(
        takeUntil(this.componentDestroyed$),
        select(todoFeature.selectSelectedTask),
      )
      .subscribe((task: Task | undefined) => {
        if (task) {
          this.taskId = task.id;
          this.taskDescription = task.description;

          setTimeout(() => {
            this.setFocusIntoTextarea();
          }, 0);
        } else {
          this.taskId = null;
          this.taskDescription = '';
        }
      });

    this.backendErrors$ = this.store.pipe(
      select(todoFeature.selectValidationErrors),
    );
  }

  private setFocusIntoTextarea() {
    if (this.textarea) {
      (this.textarea.nativeElement as HTMLTextAreaElement).focus();
    }
  }
}

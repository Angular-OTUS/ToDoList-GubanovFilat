import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Task } from '../../dto/Task';
import { Button } from '../button/button';
import { Tooltip } from '../../directives/tooltip';

@Component({
  selector: 'app-to-do-list-item',
  imports: [Button, Tooltip],
  templateUrl: './to-do-list-item.html',
  styleUrl: './to-do-list-item.css',
})
export class ToDoListItem {
  @Input()
  public task!: Task;

  @Output()
  protected deleteTaskEvent = new EventEmitter();

  protected onDelete(): void {
    this.deleteTaskEvent.emit(this.task.id);
  }
}

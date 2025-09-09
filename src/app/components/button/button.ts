import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  @Input()
  public type = '';

  @Input()
  public disabled = false;

  @Input()
  public title = '';

  @Input()
  public className = '';

  @Output()
  protected readonly eventEmitter = new EventEmitter();

  protected onClick() {
    this.eventEmitter.emit();
  }
}

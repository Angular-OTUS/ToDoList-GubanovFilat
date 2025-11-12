import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackendErrors } from '../../dto/BackendErrors';

@Component({
  selector: 'app-validation-errors',
  imports: [CommonModule],
  templateUrl: './validation-errors.html',
  styleUrl: './validation-errors.css',
})
export class ValidationErrors implements OnInit {
  @Input()
  public validationErrors!: BackendErrors | null;

  protected errorMessages!: Array<string>;

  ngOnInit(): void {
    if (!this.validationErrors) {
      this.errorMessages = [];
      return;
    }

    this.errorMessages = Object.keys(this.validationErrors).map(
      (key: string) => {
        const messages = this.validationErrors![key].join(', ');
        return `${key} ${messages}`;
      },
    );
  }
}

import { Component } from '@angular/core';
import { ToastCategory, ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-toasts',
  imports: [],
  templateUrl: './toasts.html',
  styleUrl: './toasts.css',
})
export class Toasts {

  constructor(private toastService: ToastService) {}

  protected get toasts() {
    return this.toastService.getToasts();
  }

  protected getClass(category: ToastCategory): string {
    switch (category) {
      case ToastCategory.SUCCESS:
        return 'success';
      case ToastCategory.ERROR:
        return 'error';
      default:
        return '';
    }
  }
}

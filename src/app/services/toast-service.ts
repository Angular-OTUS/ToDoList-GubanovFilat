import { Injectable } from '@angular/core';

import { v4 as uuid } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private static DEFAULT_DURATION_IN_MS = 3000;

  private toasts: Toast[] = [];

  getToasts() {
    return this.toasts;
  }

  public success(title: string, message: string) {
    this.show(title, message, ToastCategory.SUCCESS);
  }

  public error(title: string, message: string) {
    this.show(title, message, ToastCategory.ERROR);
  }

  private show(title: string, message: string, category: ToastCategory) {
    const toast = Toast.of(title, message, category);

    this.toasts.push(toast);

    setTimeout(() => this.remove(toast.id), ToastService.DEFAULT_DURATION_IN_MS);
  }

  private remove(toastId: string) {
    this.toasts = this.toasts.filter((toast) => toast.id != toastId);
  }
}


export enum ToastCategory {

  SUCCESS,
  ERROR
}


class Toast {

  id: string;

  title: string;

  message: string;

  category: ToastCategory;

  private constructor(id: string, title: string, message: string, category: ToastCategory) {
    this.id = id;
    this.title = title;
    this.message = message;
    this.category = category;
  }

  static of(title: string, message: string, category: ToastCategory) {
    return new Toast(uuid(), title, message, category);
  }
}
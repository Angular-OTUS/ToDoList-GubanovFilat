import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToDoList } from './components/to-do-list/to-do-list';
import { Toasts } from "./components/toasts/toasts";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToDoList, Toasts],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Todo List');
}

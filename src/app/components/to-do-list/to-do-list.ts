import { Component } from '@angular/core';

@Component({
  selector: 'app-to-do-list',
  imports: [],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css',
})
export class ToDoList {
  tasks: string[] = [
    'Buy a new gaming laptop',
    'Complete previous task',
    'Create some angular app',
  ];
}

import { v4 as uuid } from 'uuid';

export class Task {
  id: string;

  description: string;

  constructor(id: string, description: string) {
    this.id = id;
    this.description = description;
  }

  static of(description: string) {
    return new Task(uuid(), description);
  }

  clone() {
    return new Task(this.id, this.description);
  }
}

import { v4 as uuid } from 'uuid';

export class Task {
  id: string;

  description: string;

  isCompleted: boolean;

  private constructor(id: string, description: string, isCompleted: boolean) {
    this.id = id;
    this.description = description;
    this.isCompleted = isCompleted;
  }

  public static of(description: string) {
    return new Task(uuid(), description, false);
  }

  public clone() {
    return new Task(this.id, this.description, this.isCompleted);
  }
}

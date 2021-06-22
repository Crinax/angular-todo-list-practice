import { Expose, plainToClass, Type } from 'class-transformer';
import 'reflect-metadata';
// Общий интерфейс для IProject и IProjects
interface IProjectModel {
  getTodos(): Todo[];
  getTodo(id: number): Todo | undefined;
}
interface IProjects extends IProjectModel {
  getProjects(): Project[];
  getProject(id: number): Project | undefined;
  hasOwnTodo(id:number, todo: Todo): boolean;
}
interface IProject extends IProjectModel {
  getId(): number;
  getTitle(): string;
}
interface ITodo {
  getId(): number;
  getText(): string;
  isCompleted(): boolean;
}

export class Projects implements IProjects {
  readonly array: Project[];
  constructor(_obj: Object[]) {
    this.array = plainToClass(Project, _obj);
  }
  getProjects() {
    return this.array;
  }
  getProject(id: number) {
    var ids = this.getProjects().map(project => project.getId());
    var todoIndex = ids.indexOf(id);
    return todoIndex != -1 ? this.array[todoIndex] : undefined;
  }
  getTodos() {
    return this.getProjects().flatMap((project: Project) => project.getTodos());
  }
  getTodo(id: number) {
    var todos = this.getTodos();
    var ids = todos.map((todo: Todo) => todo.getId());
    var todoIndex = ids.indexOf(id);
    return todoIndex != -1 ? todos[todoIndex] : undefined;
  }
  hasOwnTodo(id:number, todo: Todo) {
    return this.getProject(id)?.getTodos().indexOf(todo) != -1 ? true : false
  }
}
class Todo implements ITodo {
  readonly id!: number;
  readonly text!: string;
  readonly is_completed!: boolean;

  getId() {
    return this.id;
  }
  getText() {
    return this.text;
  }
  isCompleted() {
    return this.is_completed;
  }
}
class Project implements IProject {
  readonly id!: number;
  readonly title!: string;

  @Type(() => Todo)
  readonly todos!: Todo[];

  getId() {
    return this.id;
  }
  getTitle() {
    return this.title;
  }
  getTodos() {
    return this.todos;
  }
  getTodo(id: number) {
    var ids = this.getTodos().map(todo => todo.getId());
    var todoIndex = ids.indexOf(id);
    return todoIndex != -1 ? this.todos[todoIndex] : undefined;
  }
}

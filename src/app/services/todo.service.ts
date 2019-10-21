import { Injectable } from '@angular/core';
import { Todo } from '../interfaces/todo';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  todoTitle: string = '';
  beforeEditCache: string = '';
  filter: string = 'all';
  todos: Todo[];

  constructor(private http: HttpClient) { 
    this.todos = this.getTodos();
  }

  getTodos(): Todo[]{

    this.http.get(API_URL + '/Ticket')
      .subscribe((response: any) => {
        this.todos = response;
        console.log(this.todos);
      })

      return this.todos;
  }


  addTodo(todoTitle: string): void{

    if(todoTitle.trim().length === 0){ return }


    this.http.post(API_URL + '/Ticket/', {
      title: todoTitle,
      completed: false
    })
      .subscribe((response: any) => {
        this.todos.push({
          Id: response.Id,
          Title: todoTitle,
          Completed: false,
          Editing: false
        });
      });

  }

  editTodo(todo: Todo): void{
    this.beforeEditCache = this.todoTitle;
    todo.Editing = true;
  }

  doneEdit(todo: Todo): void{

    if(todo.Title.trim().length === 0){
      todo.Title = this.beforeEditCache;
    }

    todo.Editing = false;

    this.http.put(API_URL + '/Ticket/' + todo.Id, {
      title: todo.Title,
      completed: todo.Completed
    })
      .subscribe((response: any) => {
        
      })

  }

  cancelEdit(todo: Todo):void{
    todo.Title = this.beforeEditCache;
    todo.Editing = false;
  }

  deleteTodo(id: number): void{
    
    this.http.delete(API_URL + '/Ticket/'+ id)
    .subscribe((response: any) => {
       this.todos = this.todos.filter(x => x.Id !== id);
      
      })

  }

  remaining(): number{
    return (this.todos || []).filter(todo => !todo.Completed).length;
  }

  atLeastOneCompleted(): boolean{
    return this.remaining() > 0;
  }

  clearCompleted():void{

    var todosToDelete = this.todosFiltered().filter(x => x.Completed === true);

    for(var i = 0; i < todosToDelete.length; i++){
      this.deleteTodo(todosToDelete[i].Id);
    }
  }

  todosFiltered(): Todo[] {
    if (this.filter === 'all') {
      return this.todos;
    } else if (this.filter === 'active') {
      return this.todos.filter(todo => !todo.Completed);
    } else if (this.filter === 'completed') {
      return this.todos.filter(todo => todo.Completed);
    }

    return this.todos;
  }
}

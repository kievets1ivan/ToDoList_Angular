import { Component, OnInit } from '@angular/core';
import { Todo } from '../../interfaces/todo';
import { trigger, transition, style, animate } from '@angular/animations';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  providers: [TodoService]

})
export class TodoListComponent implements OnInit {
   todoTitle: string;

  constructor(private todoService: TodoService) {  }

  ngOnInit() {
     this.todoTitle = '';
    
  }

  addTodo(): void{

    if(this.todoTitle.trim().length === 0){ return }

    this.todoService.addTodo(this.todoTitle);

    this.todoTitle = '';
  }
}
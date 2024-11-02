import { Todo } from "../model/Todo.js";

class TodoService {
    constructor() {
        this.apiUrl = 'http://localhost:8080/api';
    }

    async fetchTodos() {
        try {
            const responce = await $.get(`${this.apiUrl}/todos`);
            return responce.map(item => new Todo(item.id, item.name, item.shortDesc, item.fullDesc, item.date, item.status)); 
        } catch (error) {
            console.error('Ошибка при загрузке данных', error);
        }
    }
    
    async fetchTodosByDate(from, to) {
        try {
            const responce = await $.get(`${this.apiUrl}/todos/date?from=${from}&to=${to}`);
            return responce.map(item => new Todo(item.id, item.name, item.shortDesc, item.fullDesc, item.date, item.status));
        } catch (error) {
            console.error('Ошибка при загрузке данных', error);
        }
    }
    
    async fetchTodosByDateAndStatus(from, to, status) {
        try {
            const responce = await $.get( `${this.apiUrl}/todos/dateAndStatus?from=${from}&to=${to}&status=${status}`);
            return responce.map(item => new Todo(item.id, item.name, item.shortDesc, item.fullDesc, item.date, item.status));
        } catch (error) {
            console.error('Ошибка при загрузке данных', error);
        }
    }
    
    async fetchTodosFind(q) {
        try {
            const responce = await $.get(`${this.apiUrl}/todos/find?q=${q}`);
            return responce.map(item => new Todo(item.id, item.name, item.shortDesc, item.fullDesc, item.date, item.status));
        } catch (error) {
            console.error('Ошибка при загрузке данных', error);
        }
    }
}

export const todoService = new TodoService();
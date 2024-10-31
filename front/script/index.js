$(function() {
    $("#datepicker").datepicker({});
});

class Todo {
    constructor(id, name, shortDesc, fullDesc, date, status) {
        this.id = id;
        this.name = name;
        this.shortDesc = shortDesc;
        this.fullDesc = fullDesc;
        this.date = date;
        this.status = status;
    }
}

class TodoManager {
    constructor() {
        this.todos = [];
    }

    async fetchTodos(url) {
        try {
            const responce = await $.get(url);
            this.todos = responce.map(item => new Todo(item.id, item.name, item.shortDesc, item.fullDesc, item.date, item.status));
            this.renderTodos();    
        } catch (error) {
            console.error('Ошибка при загрузке данных', error)
        }
    }
    
    renderTodos() {
        const todoListContainer = $('#todo-list');
        todoListContainer.empty();

        this.todos.forEach(todo => {
            const todoItem = $(`
                <div class="todo-item">
                  <div class="todo-item-left">
                    <h3 class="todo-item-name">${todo.name}</h3>
                    <p class="todo-item-short-desc">${todo.shortDesc}</p>
                  </div>
                  <div class="todo-item-right">
                    <img class="todo-item-status" src="${todo.status ? './image/TodoStatusCompleted.svg' : './image/TodoStatusNotCompleted.svg'}" alt="Статус задания" class="status-icon">
                    <p class="todo-item-date">${this.formatDate(todo.date)}</p>
                  </div>
                </div>
                `);
            todoListContainer.append(todoItem);
        })
    }

    formatDate(stringDate) {
        const date = new Date(stringDate);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0')

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
}

const todoManager = new TodoManager();
todoManager.fetchTodos('http://localhost:8080/api/todos');
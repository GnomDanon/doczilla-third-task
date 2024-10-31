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
        this.displaydTodos = [];
        this.isNextSortReverse = false;
    }

    async fetchTodos(url) {
        try {
            const responce = await $.get(url);
            this.todos = responce.map(item => new Todo(item.id, item.name, item.shortDesc, item.fullDesc, item.date, item.status));
            this.renderAllTodos();    
        } catch (error) {
            console.error('Ошибка при загрузке данных', error);
        }
    }

    async fetchTodosByDate(url, from, to) {
        try {
            const responce = await $.get(url + `/date?from=${from}&to=${to}`);
            this.todos = responce.map(item => new Todo(item.id, item.name, item.shortDesc, item.fullDesc, item.date, item.status));
            this.renderAllTodos();
        } catch (error) {
            console.error('Ошибка при загрузке данных', error);
        }
    }

    async fetchTodosByDateAndStatus(url, from, to, status) {
        try {
            const responce = await $.get(url + `/dateAndStatus?from=${from}&to=${to}&status=${status}`);
            this.todos = responce.map(item => new Todo(item.id, item.name, item.shortDesc, item.fullDesc, item.date, item.status));
            this.renderAllTodos();
        } catch (error) {
            console.error('Ошибка при загрузке данных', error);
        }
    }

    async fetchTodosFind(url, q) {
        try {
            const responce = await $.get(url + `/find?q=${q}`);
            this.todos = responce.map(item => new Todo(item.id, item.name, item.shortDesc, item.fullDesc, item.date, item.status));
            this.renderAllTodos();
        } catch (error) {
            console.error('Ошибка при загрузке данных', error);
        }
    }
    
    renderTodos(checkedTodos) {
        const todoListContainer = $('#todo-list');
        todoListContainer.empty();

        checkedTodos.forEach(todo => {
            const todoItem = $(`
                <div class="todo-item">
                  <div class="todo-item-left">
                    <h3 class="todo-item-name">${todo.name}</h3>
                    <p class="todo-item-short-desc">${todo.shortDesc}</p>
                  </div>
                  <div class="todo-item-right">
                    <img class="todo-item-status" src="${todo.status === 'true' ? './image/TodoStatusCompleted.svg' : './image/TodoStatusNotCompleted.svg'}" alt="Статус задания" class="status-icon">
                    <p class="todo-item-date">${this.formatDate(todo.date)}</p>
                  </div>
                </div>
                `);
            todoListContainer.append(todoItem);
        })

        const visibleDate = $('#visible-date');
        visibleDate.empty();
        
        const sortedDates = checkedTodos.map(todo => new Date(todo.date)).sort((a, b) => {
            return a.getTime() - b.getTime();
        })
        const minDate = sortedDates[0];
        const maxDate = sortedDates[sortedDates.length - 1];
        const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        const minDateString = `${minDate.getDate()} ${months[minDate.getMonth()]} ${minDate.getFullYear()}`;
        const maxDateString = `${maxDate.getDate()} ${months[maxDate.getMonth()]} ${maxDate.getFullYear()}`;

        visibleDate.append($(`
            <span class="visible-date-text">
                ${
                    minDateString === maxDateString ?
                    minDateString :
                    minDateString + ' - ' + maxDateString
                }
            </span>
            `));
    }

    renderAllTodos() {
        this.displaydTodos = this.todos;
        this.renderTodos(this.displaydTodos);
    }

    renderNotCompletedTodos() {
        this.displaydTodos = this.todos.filter(todo => todo.status === 'false')
        this.renderTodos(this.displaydTodos);
    }

    sortRenderedTodos() {
        if (this.isNextSortReverse) {
            this.isNextSortReverse = false;
            this.renderTodos(this.displaydTodos.reverse());
        } else {
            this.displaydTodos = this.displaydTodos.sort((a, b) => {
                const aDate = new Date(a.date)
                const bDate = new Date(b.date)
                return aDate.getTime() - bDate.getTime();
            });
            this.renderTodos(this.displaydTodos);
            this.isNextSortReverse = true;
        }
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

const baseUrl = 'http://localhost:8080/api/todos'

const todoManager = new TodoManager();
todoManager.fetchTodos(baseUrl);

const todayButton = document.querySelector('.today-button');
todayButton.addEventListener('click', function() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayInMillis = today.getTime();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowInMillis = tomorrow.getTime();

    todoManager.fetchTodosByDate(baseUrl, todayInMillis, tomorrowInMillis);
})

const weekButton = document.querySelector('.week-button');
weekButton.addEventListener('click', function() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayInMillis = today.getTime();

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextWeekInMillis = nextWeek.getTime();

    todoManager.fetchTodosByDate(baseUrl, todayInMillis, nextWeekInMillis);
})

const checkbox = document.querySelector('.unfulfilled-checkbox');
checkbox.addEventListener('click', function() {
    if (this.checked) {
        todoManager.renderNotCompletedTodos();
    } else {
        todoManager.renderAllTodos();
    }
})

const sortButton = document.querySelector('.sort-button');
sortButton.addEventListener('click', function() {
    todoManager.sortRenderedTodos();
})
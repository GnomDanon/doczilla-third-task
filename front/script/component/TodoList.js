import { todoService } from "../service/TodoService.js";

export class TodoList {
    constructor(todoListContainer, visibleDate) {
        this._todos = [];
        this._allTodos = [];
        this._notCompletedTodos = []
        this._isNextSortReverse = false;
        this._todoListContainer = todoListContainer;
        this._visibleDate = visibleDate;
    }

    _renderTodos() {
        this._todoListContainer.empty();
        this._todos.forEach(todo => {
            const todoItem = $(`
                <div class="todo-item" onclick="openModal('${todo.id}')">
                  <div class="todo-item-left">
                    <h3 class="todo-item-name">${todo.name}</h3>
                    <p class="todo-item-short-desc">${todo.shortDesc}</p>
                  </div>
                  <div class="todo-item-right">
                    <img class="todo-item-status" src="${todo.status === 'true' ? './image/TodoStatusCompleted.svg' : './image/TodoStatusNotCompleted.svg'}" alt="Статус задания" class="status-icon">
                    <p class="todo-item-date">${this.formatDate(todo.date)}</p>
                  </div>
                </div>
                
                <div id="${todo.id}" class="modal">
                    <div class="modal-content">
                        <div class="modal-content-top">
                            <div class="modal-content-top-left">
                                <h3 class="modal-name">${todo.name}</h3>
                                <p class="motal-date">${this.formatDate(todo.date)}</p>
                            </div>
                            <img class="modal-status" src="${todo.status === 'true' ? './image/TodoStatusCompleted.svg' : './image/TodoStatusNotCompleted.svg'}" alt="Статус задания" class="status-icon">
                        </div>
                        <hr class="modal-horizontal-line" />
                        <div class="modal-content-bottom">
                            <div class="modal-description">${todo.fullDesc}</div>
                            <button class="modal-button" onclick="closeModal('${todo.id}')">Готово</button>
                        </div>
                    </div>
                </div>
                `);
            this._todoListContainer.append(todoItem);
        })
    }

    _renderVisibleDate() {
        this._visibleDate.empty();
        
        const sortedDates = this._todos.map(todo => new Date(todo.date)).sort((a, b) => {
            return a.getTime() - b.getTime();
        })
        if (sortedDates.length === 0) {
            alert("На выбранный период задач нет");
            return;
        }
        const minDate = sortedDates[0];
        const maxDate = sortedDates[sortedDates.length - 1];
        const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        const minDateString = `${minDate.getDate()} ${months[minDate.getMonth()]} ${minDate.getFullYear()}`;
        const maxDateString = `${maxDate.getDate()} ${months[maxDate.getMonth()]} ${maxDate.getFullYear()}`;

        this._visibleDate.append($(`
            <span class="visible-date-text">
                ${
                    minDateString === maxDateString ?
                    minDateString :
                    minDateString + ' - ' + maxDateString
                }
            </span>
            `));
    }

    _render() {
        this._renderTodos();
        this._renderVisibleDate();
    }

    async renderAllTodos() {
        this._allTodos = await todoService.fetchTodos();
        this._notCompletedTodos = this._allTodos.filter(todo => todo.status === "false");
        this._todos = this._allTodos;
        this._render();
    }

    async renderTodosByDateAndStatus(from, to, status) {
        if (from > to) {
            [from, to] = [to, from];
        }
        this._allTodos = await todoService.fetchTodosByDate(from, to);
        this._notCompletedTodos = await todoService.fetchTodosByDateAndStatus(from, to, false);
        this.switchStatus(status);
    }

    switchStatus(status) {
        console.log(status);
        if (status) {
            this._todos = this._allTodos;
        } else {
            this._todos = this._notCompletedTodos;
        }
        this._render();
    }

    sortRenderedTodos() {
        this._todos = this._todos.sort((a, b) => {
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);
            return aDate.getTime() - bDate.getTime();
        })
        if (this._isNextSortReverse) {
            this._todos = this._todos.reverse();
            this._isNextSortReverse = false;
        } else {
            this._isNextSortReverse = true;
        }
        this._renderTodos();
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
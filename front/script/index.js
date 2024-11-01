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

const baseUrl = 'http://localhost:8083/api/todos'

const todoManager = new TodoManager();
todoManager.fetchTodos(baseUrl);

$('#datepicker').datepicker({
    onSelect: function(dateText) {
        const inputDate = $('#input-date');
        if (inputDate.val().length === 0 || inputDate.val().split(' - ').length === 2 || inputDate.val() === dateText) {
            inputDate.val(dateText);
            const date = new Date(dateText)
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1)
            todoManager.fetchTodosByDate(baseUrl, date.getTime(), nextDate.getTime())
        } else {
            const firstDate = new Date(inputDate.val());
            const secondDate = new Date(dateText);
            secondDate.setDate(secondDate.getDate() + 1)
            inputDate.val(`${inputDate.val()} - ${dateText}`)
            todoManager.fetchTodosByDate(baseUrl, firstDate.getTime(), secondDate.getTime())
        }
    }
})

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

function openModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = "block"
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal(id)
        }
    }
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

$('#search-input').on('input', function() {
    const q = $(this).val().toLowerCase();
    const filteredTodos = q.length > 0 ? todoManager.todos.filter(todo => todo.name.toLowerCase().includes(q)) : [];

    $('#dropdown').empty();

    if (filteredTodos.length > 0) {
        filteredTodos.forEach(todo => {
            $('#dropdown').append(`
                <div class="dropdown-item" onclick="openModal('${todo.id}')">
                    ${todo.name}
                </div>
                `)
        })
        $('#dropdown').show();
    } else {
        $('#dropdown').hide();
    }
})


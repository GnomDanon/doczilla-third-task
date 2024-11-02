import { TodoList } from "./component/TodoList.js";
import { Datepicker } from "./component/Datepicker.js";
import { Dropdown } from "./component/Dropdown.js";

$(function() {
    const todoList = new TodoList($('#todo-list'), $('#visible-date'));
    const datepicker = new Datepicker($('#input-date'), todoList);
    const unfulfilledTasksChecker = document.querySelector('.unfulfilled-checkbox');
    const dropdown = new Dropdown($('#dropdown'));

    function renderToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayInMillis = today.getTime();
    
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowInMillis = tomorrow.getTime();

        todoList.renderTodosByDateAndStatus(todayInMillis, tomorrowInMillis, !unfulfilledTasksChecker.checked);
    }

    renderToday();

    $('#datepicker').datepicker({
        onSelect: function(dateText) {
            datepicker.render(dateText, !unfulfilledTasksChecker.checked);
        }
    });

    $('#today-button').on('click', function() {
        renderToday();
    });

    $('#week-button').on('click', function() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayInMillis = today.getTime();

        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const nextWeekInMillis = nextWeek.getTime();

        todoList.renderTodosByDateAndStatus(todayInMillis, nextWeekInMillis, !unfulfilledTasksChecker.checked);
    });

    unfulfilledTasksChecker.addEventListener('click', function() {
        todoList.switchStatus(!unfulfilledTasksChecker.checked);
    });

    $('#sort-button').on('click', function() {
        todoList.sortRenderedTodos();
    });

    $('#search-input').on('input', function() {
        dropdown.findWithQ($(this).val().toLowerCase());
    });
})

export class Datepicker {
    constructor(inputDate, todoList) {
        this._inputDate = inputDate;
        this._todoList = todoList;
    }

    render(dateText, status) {
        const inputDate = $('#input-date');
        if (inputDate.val().length === 0 || inputDate.val().split(' - ').length === 2 || inputDate.val() === dateText) {
            inputDate.val(dateText);
            const date = new Date(dateText);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            this._todoList.renderTodosByDateAndStatus(date.getTime(), nextDate.getTime(), status);
        } else {
            const firstDate = new Date(inputDate.val());
            const secondDate = new Date(dateText);
            secondDate.setDate(secondDate.getDate() + 1);
            inputDate.val(`${inputDate.val()} - ${dateText}`);
            this._todoList.renderTodosByDateAndStatus(firstDate.getTime(), secondDate.getTime(), status);
        }
    }
}
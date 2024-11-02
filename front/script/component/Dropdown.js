import { todoService } from "../service/TodoService.js";

export class Dropdown {
    constructor(dropdown) {
        this._dropdown = dropdown;
    }

    async findWithQ(q) {
        const todos = await todoService.fetchTodosFind(q);
        this._dropdown.empty();
        if (todos.length > 0) {
            todos.forEach(todo => {
                this._dropdown.append(`
                    <div class="dropdown-item" onclick="openModal('${todo.id}')">
                        ${todo.name}
                    </div>
                    `)
            });
            this._dropdown.show();
        } else {
            this._dropdown.hide();
        }
    }
}
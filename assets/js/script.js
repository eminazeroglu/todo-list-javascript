const itemsContent = document.getElementById("items-content");
const formText = document.querySelector("#formText");
const btnAdd = document.querySelector("#btnAdd");
const btnTab = document.querySelectorAll(".btnTab");
let editId;

const todoLists = localStorage.getItem('todoLists') ? JSON.parse(localStorage.getItem('todoLists')) : []


function createTodo(filter = "all") {
    itemsContent.innerHTML = "";
    for (let todo of todoLists) {
        if (filter === todo.status || filter === "all") {
            let item = `
            <div class="flex items-center justify-between border border-[#E1E1E1] p-[12px]">
                <label class="flex items-center space-x-[5px] ${
                    todo.status === "completed" ? "line-through" : ""
                }">
                            <input onchange="todoChecked(this, ${
                                todo.id
                            })" type="checkbox" ${
                todo.status === "completed" ? "checked" : ""
            }>
                    <span>${todo.text}</span>
                </label>
                <div>
                    <button onclick="todoEdit(${
                        todo.id
                    })" class="w-[20px] h-[20px] inline-flex items-center justify-center text-[10px] rounded bg-blue-500 text-white">
                        <i class="fa fa-pen"></i>
                    </button>
                    <button onclick="destroyTodo(${todo.id})" 
                    class="w-[20px] h-[20px] inline-flex items-center justify-center text-[10px] rounded bg-red-500 text-white">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

            itemsContent.insertAdjacentHTML("beforeend", item);
        }
    }
}

btnAdd.addEventListener("click", function (e) {
    e.preventDefault();
    if (editId) {
        let findIndex = getTodoIndexById(editId);
        todoLists[findIndex].text = formText.value;
        editId = "";
    } else {
        todoLists.push({ id: todoLists.length + 1, text: formText.value });
    }
    formText.value = "";

    localStorage.setItem('todoLists', JSON.stringify(todoLists));

    createTodo();
});

function getTodoIndexById(id) {
    let findIndex;
    for (index in todoLists) {
        if (todoLists[index].id === id) {
            findIndex = index;
        }
    }
    return findIndex;
}

function destroyTodo(id) {
    let isValid = confirm("Bu melumati silmek istediyinize eminsiz ?");
    if (isValid) {
        let findIndex = getTodoIndexById(id);
        todoLists.splice(findIndex, 1);
        localStorage.setItem('todoLists', JSON.stringify(todoLists));
        createTodo();
    }
}

function todoChecked(e, id) {
    let findIndex = getTodoIndexById(id);
    todoLists[findIndex].status = e.checked ? "completed" : "pending";
    const activeTab = document.querySelector("button.active");
    localStorage.setItem('todoLists', JSON.stringify(todoLists));
    createTodo(activeTab.getAttribute("data-value"));
}

function todoEdit(id) {
    let findIndex = getTodoIndexById(id);
    let todo = todoLists[findIndex];
    formText.value = todo.text;
    editId = id;
}

btnTab.forEach(function (i) {
    i.addEventListener("click", function (e) {
        btnTab.forEach(function (button) {
            button.classList.remove("active");
        });
        const value = e.target.getAttribute("data-value");
        e.target.classList.add("active");

        createTodo(value);
    });
});

createTodo();

$(document).ready(function() {
    $('#recordTable').DataTable({
        "order": [[0, "desc"]] // Порядковый номер столбца начинается с 0, "desc" для сортировки по убыванию
    });

    // Настройка автозаполнения для поля "Адрес"
    $("#address").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "/addresses",
                dataType: "json",
                data: {
                    term: request.term
                },
                success: function(data) {
                    response(data);
                }
            });
        },
        minLength: 0
    }).focus(function() {
        $(this).autocomplete("search", $(this).val());
    });

    // Настройка автозаполнения для поля "Исполнитель"
    $("#executor").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "/executors",
                dataType: "json",
                data: {
                    term: request.term
                },
                success: function(data) {
                    response(data);
                }
            });
        },
        minLength: 0
    }).focus(function() {
        $(this).autocomplete("search", $(this).val());
    });
});

// Получаем модальные окна
var modal = document.getElementById("myModal");
var addAddressModal = document.getElementById("addAddressModal");
var addExecutorModal = document.getElementById("addExecutorModal");

var modalTitle = document.getElementById("modalTitle");
var form = document.getElementById("recordForm");
var addressForm = document.getElementById("addressForm");
var executorForm = document.getElementById("executorForm");

// Получаем кнопки, которые открывают модальные окна
var btn = document.getElementById("openModalBtn");
var addAddressBtn = document.getElementById("openAddAddressModalBtn");
var addExecutorBtn = document.getElementById("openAddExecutorModalBtn");

// Получаем элементы <span>, которые закрывают модальные окна
var spans = document.getElementsByClassName("close");

// Получаем кнопки "Отмена", которые закрывают модальные окна
var closeBtns = document.getElementsByClassName("close-btn");

// Когда пользователь нажимает на кнопку, открываем соответствующее модальное окно
btn.onclick = function() {
    openAddModal();
}
addAddressBtn.onclick = function() {
    addAddressModal.style.display = "block";
}
addExecutorBtn.onclick = function() {
    addExecutorModal.style.display = "block";
}

// Когда пользователь нажимает на <span> (x), закрываем соответствующее модальное окно
for (var i = 0; i < spans.length; i++) {
    spans[i].onclick = function() {
        this.parentElement.parentElement.parentElement.style.display = "none";
    }
}

// Когда пользователь нажимает на кнопку "Отмена", закрываем соответствующее модальное окно
for (var i = 0; i < closeBtns.length; i++) {
    closeBtns[i].onclick = function() {
        this.parentElement.parentElement.parentElement.parentElement.style.display = "none";
    }
}

// Когда пользователь нажимает в любом месте за пределами модального окна, закрываем его
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == addAddressModal) {
        addAddressModal.style.display = "none";
    }
    if (event.target == addExecutorModal) {
        addExecutorModal.style.display = "none";
    }
}

// Открытие модального окна для добавления записи
function openAddModal() {
    form.reset();
    modalTitle.textContent = "Добавить запись";
    form.action = "/addRecord";
    setFormEditable(true);

    var today = new Date().toISOString().split('T')[0];
    document.getElementById("date").value = today;

    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var currentTime = hours + ':' + minutes;
    document.getElementById("time").value = currentTime;

    modal.style.display = "block";
}

// Открытие модального окна для редактирования записи
function openEditModal(row) {
    var id = row.getAttribute("data-id");
    fetch(`/record/${id}`)
        .then(response => response.json())
        .then(data => {
            modalTitle.textContent = "Редактировать запись";
            form.action = `/updateRecord/${id}`;
            setFormEditable(false);

            document.getElementById("date").value = data.date;
            document.getElementById("time").value = data.time;
            document.getElementById("shift").value = data.shift;
            document.getElementById("executor").value = data.executor;
            document.getElementById("address").value = data.address;
            document.getElementById("important").checked = data.important;
            document.getElementById("description").value = data.description;
            document.getElementById("result").value = data.result;
            document.getElementById("completionDate").value = data.completionDate;

            modal.style.display = "block";
        })
        .catch(error => console.error('Error:', error));
}

// Установить поля формы в редактируемый или нередактируемый режим
function setFormEditable(editable) {
    var elements = form.elements;
    for (var i = 0; i < elements.length; i++) {
        elements[i].disabled = !editable;
    }
    editBtn.style.display = editable ? "none" : "inline-block";
    form.querySelector('button[type="submit"]').disabled = !editable;
}

// Когда пользователь нажимает на кнопку "Редактировать", делаем форму редактируемой
editBtn.onclick = function() {
    setFormEditable(true);
}
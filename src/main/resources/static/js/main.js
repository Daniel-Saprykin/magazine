document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("myModal");
    var editBtn = document.getElementById("editBtn");
    var form = document.getElementById("recordForm");
    var modalTitle = document.getElementById("modalTitle");
    var reportModal = document.getElementById("reportModal");
    var reportPreview = document.getElementById("reportPreview");
    var printReportBtn = document.getElementById("printReportBtn");

    // Настройка кнопок для открытия модальных окон
    document.getElementById("openModalBtn").onclick = function() {
        openAddModal();
    };
    document.getElementById("openAddAddressModalBtn").onclick = function() {
        document.getElementById("addAddressModal").style.display = "block";
    };
    document.getElementById("openAddExecutorModalBtn").onclick = function() {
        document.getElementById("addExecutorModal").style.display = "block";
    };
    document.getElementById("openReportModalBtn").onclick = function() {
        reportModal.style.display = "block";
    };
    // Настройка кнопок для закрытия модальных окон
    var closeElements = document.querySelectorAll(".close, .close-btn");
    closeElements.forEach(function(elem) {
        elem.onclick = function() {
            this.closest('.modal').style.display = 'none';
        };
    });

    // Настройка клика вне модального окна для его закрытия
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    };

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
    function openEditModal(id) {
        fetch(`/record/${id}`)
            .then(response => response.json())
            .then(data => {
                modalTitle.textContent = "Редактировать запись";
                form.action = `/updateRecord/${id}`;
                setFormEditable(false);

                document.getElementById("date").value = data.date.split("T")[0];
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


    // Установка режима редактирования
    function setFormEditable(editable) {
        var elements = form.elements;
        for (var i = 0; i < elements.length; i++) {
            elements[i].disabled = !editable;
        }
        editBtn.style.display = editable ? "none" : "inline-block";
        form.querySelector('button[type="submit"]').disabled = !editable;
    }

    // Обработчик кнопки "Редактировать"
    editBtn.onclick = function() {
        setFormEditable(true);
    };

    // Обработчик клика по номеру заявки для открытия модального окна редактирования
    document.querySelectorAll('[data-id]').forEach((element) => {
        element.onclick = function() {
            const id = this.getAttribute('data-id');
            openEditModal(id);
        };
    });

    $(document).ready(function() {
        $('#recordTable').DataTable({
            "columnDefs": [
                { "width": "10px", "targets": 0 } // Задает ширину для первого столбца
            ],
            "order": [[0, "desc"]] // Порядковый номер столбца начинается с 0, "desc" для сортировки по убыванию
        });

document.addEventListener('DOMContentLoaded', function() {
    // Функция для установки минимальной ширины столбцов на основе содержимого
    function adjustColumnWidth() {
        const table = document.getElementById('recordTable');
        const ths = table.querySelectorAll('th');
        const trs = table.querySelectorAll('tbody tr');

        ths.forEach((th, index) => {
            let maxWidth = th.clientWidth;

            trs.forEach(tr => {
                const td = tr.children[index];
                if (td) {
                    const cellWidth = td.clientWidth;
                    if (cellWidth > maxWidth) {
                        maxWidth = cellWidth;
                    }
                }
            });

            th.style.width = `${maxWidth}px`;
            th.style.minWidth = `${maxWidth}px`;
        });
    }

    adjustColumnWidth(); // Настройка ширины при загрузке страницы

    function setupAutocomplete(fieldId, url, minLength) {
        $(fieldId).autocomplete({
            source: function(request, response) {
                $.ajax({
                    url: url,
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function(data) {
                        response(data);
                    }
                });
            },
            minLength: minLength
        }).focus(function() {
            $(this).autocomplete("search", $(this).val());
        });
    }

        // Настройка автозаполнения для поля "Адрес" в модальном окне добавить запись
        setupAutocomplete("#address", "/addresses", 0)

        // Настройка автозаполнения для поля "Адрес" в модальном окне отчета
        setupAutocomplete("#addressesReport", "/addresses", 0)

        // Настройка автозаполнения для поля "Исполнитель" в модальном окне отчета
        setupAutocomplete("#executorReport", "/executors", 0)

        // Настройка автозаполнения для поля "Исполнитель" в модальном окне добавить запись
        setupAutocomplete("#executor", "/executors", 0)


        // Настройка предварительного просмотра отчета
//        document.getElementById("generateReportForm").addEventListener("submit", function(event) {
//            event.preventDefault();
//
//            const startDate = document.getElementById("startDate").value;
//            const endDate = document.getElementById("endDate").value;
//            const executor = document.getElementById("executorReport").value;
//            const address = document.getElementById("addressesReport").value;
//
//            fetch('/generateReportPreview', {
//                method: 'POST',
//                headers: {
//                    'Content-Type': 'application/json'
//                },
//                body: JSON.stringify({
//                    startDate: startDate,
//                    endDate: endDate,
//                    executor: executor,
//                    address: address
//                })
//            })
//            .then(response => response.text())
//            .then(html => {
//                document.getElementById("reportPreview").innerHTML = html;
//            })
//            .catch(error => console.error('Error:', error));
//        });
              // Обработчик формы для генерации отчета
        document.getElementById("generateReportForm").addEventListener("submit", function(event) {
            event.preventDefault();

            const startDate = document.getElementById("startDate").value;
            const endDate = document.getElementById("endDate").value;
            const executor = document.getElementById("executorReport").value;
            const address = document.getElementById("addressesReport").value;

            fetch('/generateReport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startDate: startDate,
                    endDate: endDate,
                    executor: executor,
                    address: address
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Network response was not ok.');
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'report.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error:', error));
        });

        // Обработчик для кнопки "Сформировать отчет"
        $("#generateReportForm").submit(function(event) {
            event.preventDefault();
            const startDate = $("#startDate").val();
            const endDate = $("#endDate").val();
            const executor = $("#executorReport").val();
            const address = $("#addressesReport").val();

            fetch('/generateReport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startDate: startDate,
                    endDate: endDate,
                    executor: executor,
                    address: address
                })
            })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                reportPreview.src = url;
                reportPreview.style.display = "block";
            })
            .catch(error => console.error('Error:', error));
        });

        // Обработчик для кнопки "Напечатать отчет"
        printReportBtn.onclick = function() {
            reportPreview.contentWindow.print();
        };

    });
});

document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("myModal");
    var editBtn = document.getElementById("editBtn");
    var form = document.getElementById("recordForm");
    var modalTitle = document.getElementById("modalTitle");
    var reportModal = document.getElementById("reportModal");

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

                const formattedDate = new Date(data.date).toISOString().split('T')[0];
                document.getElementById("date").value = formattedDate;
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
            "order": [[0, "desc"]] // Порядковый номер столбца начинается с 0, "desc" для сортировки по убыванию
        });

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

        // Обновление предварительного просмотра отчета
        $("#reportForm input, #reportForm select").on("change", updateReportPreview);
        document.getElementById("generateReportBtn").onclick = updateReportPreview;

        function updateReportPreview() {
            var formData = $("#reportForm").serialize();
            console.log("Обновление отчета с данными:", formData);
            $("#reportFrame").attr("src", "/generateReport?" + formData);
        }
    });
});

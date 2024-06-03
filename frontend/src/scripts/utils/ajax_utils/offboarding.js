window.addEventListener('DOMContentLoaded', function() {
    fetchTableData();
});

let tableRows = [];
const itemsPerPage = 5;
let currentPage = 1;
let totalRows = 0;

function fetchTableData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost/backend/ajax/offboarding.php', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            totalRows = data.length;
            populateTable(data);
            updatePagination(totalRows);
        } else {
            console.error('Request failed. Status code:', xhr.status);
        }
    };
    xhr.onerror = function() {
        console.error('Connection error');
    };
    xhr.send();
}

function populateTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    tableRows = [];
    data.forEach(function(row) {
        const newRow = document.createElement('tr');
        const eidCell = document.createElement('td');
        eidCell.textContent = row.eid;
        newRow.appendChild(eidCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = row.Name;
        newRow.appendChild(nameCell);

        const positionCell = document.createElement('td');
        positionCell.textContent = row.position;
        newRow.appendChild(positionCell);

        const departmentCell = document.createElement('td');
        departmentCell.textContent = row.Department;
        newRow.appendChild(departmentCell);

        const salaryCell = document.createElement('td');
        salaryCell.textContent = row.Salary;
        newRow.appendChild(salaryCell);

        const actionsCell = document.createElement('td');
        

        const button1 = document.createElement('button');
        button1.textContent = 'Reconsider';
        button1.classList.add('btn', 'btn-warning');
        button1.style.marginRight ='2rem';
        actionsCell.appendChild(button1);

        const button2 = document.createElement('button');
        button2.textContent = 'Discharged';
        button2.classList.add('btn', 'btn-danger');
        button2.style.marginRight ='2rem';
        actionsCell.appendChild(button2);

        newRow.appendChild(actionsCell);

        tableBody.appendChild(newRow);
        tableRows.push(newRow);
    });
    displayPage(1);
}

// Search functionality
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', filterTable);

function filterTable() {
    const searchValue = searchInput.value.toLowerCase();
    const filteredRows = tableRows.filter(row => {
        const cells = row.getElementsByTagName('td');
        for (let i = 0; i < cells.length; i++) {
            const cellValue = cells[i].textContent.toLowerCase();
            if (cellValue.includes(searchValue)) {
                return true;
            }
        }
        return false;
    });

    tableRows.forEach(row => row.style.display = 'none');
    filteredRows.forEach(row => row.style.display = '');

    updatePagination(filteredRows.length);
    displayPage(1);
}

// Pagination functionality
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');

function displayPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visibleRows = tableRows.filter(row => row.style.display !== 'none');

    if (visibleRows.length === 0) {
        currentPage = 1;
        updatePaginationButtons(0);
        return;
    }

    visibleRows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    currentPage = page;
    updatePaginationButtons(visibleRows.length);
}

function updatePagination(rows) {
    totalRows = rows;
    const totalPages = Math.ceil(totalRows / itemsPerPage);

    updatePaginationButtons(totalPages);
}

function updatePaginationButtons(totalPages) {
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
    currentPageSpan.textContent = `${currentPage} of ${totalPages}`;
}

prevPageBtn.addEventListener('click', () => {
    displayPage(currentPage - 1);
});

nextPageBtn.addEventListener('click', () => {
    displayPage(currentPage + 1);
});
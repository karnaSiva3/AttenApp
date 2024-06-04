window.addEventListener('DOMContentLoaded', function() {
    fetchTableData();
});

let tableRows = [];
const itemsPerPage = 5;
let currentPage = 1;
let totalRows = 0;

function fetchTableData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost/backend/ajax/attendence.php', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
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
        newRow.innerHTML = `
            <td>${row.eid}</td>
            <td>${row.Name}</td>
            <td>${row.Department}</td>
            <td><button class="btn btn-primary" style="margin-right: 2rem;">Info</button></td>
        `;
        tableBody.appendChild(newRow);
        tableRows.push(newRow);
    });

    displayPage(1);
}

// Pagination functionality
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');

function displayPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visibleRows = tableRows.filter((row, index) => index >= startIndex && index < endIndex);

    tableRows.forEach(row => row.style.display = 'none');
    visibleRows.forEach(row => row.style.display = '');

    currentPage = page;
    updatePaginationButtons(totalRows);
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
window.addEventListener('DOMContentLoaded', function() {
    fetchOfferData();
 });
 
 let tableRows = [];
 const itemsPerPage = 5;
 let currentPage = 1;
 let totalRows = 0;
 
 function fetchOfferData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost/backend/ajax/fetchoffers.php', true);
 
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Received data:', xhr.responseText);
            try {
                var data = JSON.parse(xhr.responseText);
                console.log('Parsed data:', data);
                totalRows = data.length;
                populateTable(data);
                updatePagination(totalRows);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
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
 
        const nameCell = document.createElement('td');
        nameCell.textContent = row.name;
        newRow.appendChild(nameCell);
 
        const jobTitleCell = document.createElement('td');
        jobTitleCell.textContent = row.job_title;
        newRow.appendChild(jobTitleCell);
 
        const offerCell = document.createElement('td');
        offerCell.textContent = row.offer;
        newRow.appendChild(offerCell);
 
        const deadlineCell = document.createElement('td');
        deadlineCell.textContent = row.deadline;
        newRow.appendChild(deadlineCell);
 
        const actionsCell = document.createElement('td');
 
        const negotiateButton = document.createElement('button');
        negotiateButton.textContent = 'Negotiate';
        negotiateButton.classList.add('btn', 'btn-primary');
        negotiateButton.style.marginRight = '2rem';
        negotiateButton.addEventListener('click', () => handleAction(row.name, 'Negotiate'));
        actionsCell.appendChild(negotiateButton);
 
        newRow.appendChild(actionsCell);
 
        tableBody.appendChild(newRow);
        tableRows.push(newRow);
    });
    displayPage(1);
 }
 
 // Add this function to handle button actions
 function handleAction(name, action) {
    console.log(`${action} action for ${name}`);
    switch(action) {
        case 'Negotiate':
            // Handle negotiate logic
            break;
        default:
            console.log('Unknown action');
    }
    // Add your logic here to handle the action (e.g., open a modal, make an API call, etc.)
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
window.addEventListener('DOMContentLoaded', function() {
  fetchTableData();
});  

let tableRows = [];
const itemsPerPage = 5; 
let currentPage = 1;

function fetchTableData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost/backend/ajax/directory.php', true);
  xhr.onload = function() {
      if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          populateTable(data);
          updatePagination(data.length);
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

    const officeLocationCell = document.createElement('td');
    officeLocationCell.textContent = row.office_location;
    newRow.appendChild(officeLocationCell);

    const statusCell = document.createElement('td');
    const statusContainer = document.createElement('div');
    statusContainer.textContent = row.status;
    statusContainer.classList.add('status-container');

    switch (row.status) {
      case 'On-Leave':
        statusContainer.classList.add('red');
        break;
      case 'Work-from-home':
        statusContainer.classList.add('yellow');
        break;
      case 'In-Office':
        statusContainer.classList.add('green');
        break;
      default:
        break;
    }

    statusCell.appendChild(statusContainer);
    newRow.appendChild(statusCell);

    const phoneCell = document.createElement('td');
    phoneCell.textContent = row.Phone;
    newRow.appendChild(phoneCell);

    const emailCell = document.createElement('td');
    emailCell.textContent = row.Email;
    newRow.appendChild(emailCell);

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
  tableRows.forEach(row => {
      const cells = row.getElementsByTagName('td');
      let shouldHideRow = true;
      for (let i = 0; i < cells.length; i++) {
          const cellValue = cells[i].textContent.toLowerCase();
          if (cellValue.includes(searchValue)) {
              shouldHideRow = false;
              break;
          }
      }
      if (shouldHideRow) {
          row.style.display = 'none';
      } else {
          row.style.display = '';
      }
  });
  updatePagination(tableRows.filter(row => row.style.display !== 'none').length);
  displayPage(1);
}

// Pagination functionality
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

function displayPage(page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleRows = tableRows.filter(row => row.style.display !== 'none');

  if (visibleRows.length === 0) {
    tableRows.forEach(row => row.style.display = 'none');
    currentPage = 1;
    updatePaginationButtons(0);
    return;
  }

  tableRows.forEach((row, index) => {
    if (index >= startIndex && index < endIndex && visibleRows.includes(row)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });

  currentPage = page;
  updatePaginationButtons(visibleRows.length);

}
function updatePagination(totalRows) {
  const totalPages = Math.ceil(totalRows / itemsPerPage);
  const visiblePages = Math.min(totalPages, 5); // Adjust this value as needed

  // Update existing pagination elements
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const pageInfo = document.getElementById('pageInfo');

  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  // Clear existing page buttons
  const pagination = document.getElementById('pagination');
  const pageButtons = pagination.querySelectorAll('.page-button');
  pageButtons.forEach(button => button.remove());

  // Create page buttons
  for (let i = 1; i <= visiblePages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add('page-button');
    if (i === currentPage) {
      pageButton.classList.add('active');
    }
    pageButton.addEventListener('click', () => {
      displayPage(i);
    });
    pagination.insertBefore(pageButton, nextPageBtn);
  }
}
prevPageBtn.addEventListener('click', () => {
  displayPage(currentPage - 1);
});

nextPageBtn.addEventListener('click', () => {
  displayPage(currentPage + 1);
});
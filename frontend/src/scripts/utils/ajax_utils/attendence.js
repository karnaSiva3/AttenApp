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
      const eidCell = document.createElement('td');
      eidCell.textContent = row.eid;
      newRow.appendChild(eidCell);
  
      const nameCell = document.createElement('td');
      nameCell.textContent = row.Name;
      newRow.appendChild(nameCell);
  
      const departmentCell = document.createElement('td');
      departmentCell.textContent = row.Department;
      newRow.appendChild(departmentCell);
  
      const actionsCell = document.createElement('td');
      const button3 = document.createElement('button');
      button3.textContent = 'Info';
      button3.classList.add('btn', 'btn-primary');
      button3.style.marginRight ='2rem';
      actionsCell.appendChild(button3);
  
      newRow.appendChild(actionsCell);
  
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
  
    tableRows.forEach((row, index) => {
      if (index >= startIndex && index < endIndex && index < totalRows) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  
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
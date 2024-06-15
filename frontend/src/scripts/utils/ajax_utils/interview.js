window.addEventListener('DOMContentLoaded', function() {
    fetchInterviewData();
  });
  
  let tableRows = [];
  const itemsPerPage = 7;
  let currentPage = 1;
  let totalRows = 0;
  function fetchInterviewData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost/backend/ajax/fetchinterviews.php', true);
    
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
        nameCell.textContent = row.Name;
        newRow.appendChild(nameCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = row.Date;
        newRow.appendChild(dateCell);

        const timingsCell = document.createElement('td');
        timingsCell.textContent = row.Timings;
        newRow.appendChild(timingsCell);

        const interviewerCell = document.createElement('td');
        interviewerCell.textContent = row.Interviewer;
        newRow.appendChild(interviewerCell);

        const jobTitleCell = document.createElement('td');
        jobTitleCell.textContent = row.Job_title;
        newRow.appendChild(jobTitleCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = row.Status;
        newRow.appendChild(statusCell);

        const actionsCell = document.createElement('td');
        
        const rescheduleButton = document.createElement('button');
        rescheduleButton.textContent = 'Reschedule';
        rescheduleButton.classList.add('btn', 'btn-warning');
        rescheduleButton.style.marginRight = '2rem';
        rescheduleButton.addEventListener('click', () => handleAction(row.Name, 'Reschedule'));
        actionsCell.appendChild(rescheduleButton);
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('btn', 'btn-danger');
        cancelButton.style.marginRight = '2rem';
        cancelButton.addEventListener('click', () => handleAction(row.Name, 'Cancel'));
        actionsCell.appendChild(cancelButton);

        // New "Send Offer" button
        const sendOfferButton = document.createElement('button');
        sendOfferButton.textContent = 'Send Offer';
        sendOfferButton.classList.add('btn', 'btn-success');
        sendOfferButton.style.marginRight = '2rem';
        sendOfferButton.addEventListener('click', () => handleAction(row.Name, 'Send Offer'));
        actionsCell.appendChild(sendOfferButton);

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
        case 'Reschedule':
            // Handle reschedule logic
            break;
        case 'Cancel':
            // Handle cancel logic
            break;
        case 'Send Offer':
            // Handle send offer logic
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
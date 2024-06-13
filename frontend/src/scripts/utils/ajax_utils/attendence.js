let tableRows = [];
const itemsPerPage = 7;
let currentPage = 1;
let totalRows = 0;
let data = [];

window.addEventListener('DOMContentLoaded', function() {
  fetchTableData();
});

function fetchTableData() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost/backend/ajax/attendence.php', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      data = JSON.parse(xhr.responseText); // Assign the fetched data to the global data variable
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
    const infoButton = document.createElement('button');
    infoButton.textContent = 'Info';
    infoButton.classList.add('btn', 'btn-primary');
    infoButton.style.marginRight = '2rem';
    infoButton.addEventListener('click', showApplicationInfo);
    actionsCell.appendChild(infoButton);

    newRow.appendChild(actionsCell);

    tableBody.appendChild(newRow);
    tableRows.push(newRow);
  });
  displayPage(1);
}

async function showApplicationInfo(event) {
  event.stopPropagation();

  const row = event.target.closest('tr');
  const eid = row.querySelector('td:first-child').textContent;

  const leaveData = data.find(row => row.eid === eid);

  if (!leaveData) {
    alert("No leave information found for this employee.");
    return;
  }

  const cardContainer = document.getElementById('cardContainer');
  const listCard = cardContainer.querySelector('#listCard');
  const listCardRect = listCard.getBoundingClientRect();
  const listCardTop = listCardRect.top + window.scrollY;
  const listCardLeft = listCardRect.left + window.scrollX;
  const listCardWidth = listCardRect.width;
  const listCardHeight = listCardRect.height;
  const leaveInfoCard = document.createElement('div');

  leaveInfoCard.style.height = `${listCardHeight}px`;
  leaveInfoCard.style.width = `${listCardWidth}px`;
  leaveInfoCard.style.borderRadius = '10px';
  leaveInfoCard.style.background = '#e4e1e1';
  leaveInfoCard.style.padding = '2rem';
  leaveInfoCard.style.position = 'absolute';
  leaveInfoCard.style.top = `${listCardTop}px`;
  leaveInfoCard.style.left = `${listCardLeft}px`;
  leaveInfoCard.style.backgroundColor = 'white';
  leaveInfoCard.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
  leaveInfoCard.style.zIndex = '-1';
  leaveInfoCard.style.display = 'flex';
  leaveInfoCard.style.flexDirection = 'column';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '3rem';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.color = 'red';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => leaveInfoCard.remove());
  leaveInfoCard.appendChild(closeButton);

  const titleElement = document.createElement('h3');
  titleElement.textContent = 'Application Information';
  titleElement.style.marginTop = '0';
  titleElement.style.fontSize = '2.2rem';
  titleElement.style.fontWeight = 'bold';
  titleElement.style.color = '#007bff';
  titleElement.style.marginBottom = '2.5rem';
  leaveInfoCard.appendChild(titleElement);

  const detailsContainer = document.createElement('div');
  detailsContainer.style.display = 'flex';
  detailsContainer.style.flexDirection = 'column';
  detailsContainer.style.gap = '1.75rem';

  const idElement = document.createElement('p');
  idElement.textContent = `Application ID: ${leaveData.id}`;
  idElement.style.fontWeight = 'bold';
  idElement.style.fontSize = '1.25rem';
  detailsContainer.appendChild(idElement);

  const nameElement = document.createElement('p');
  nameElement.textContent = `Name: ${leaveData.Name}`;
  nameElement.style.fontWeight = 'bold';
  nameElement.style.fontSize = '1.25rem';
  detailsContainer.appendChild(nameElement);

  const departmentElement = document.createElement('p');
  departmentElement.textContent = `Department: ${leaveData.Department}`;
  departmentElement.style.fontWeight = 'bold';
  departmentElement.style.fontSize = '1.25rem';
  detailsContainer.appendChild(departmentElement);

  const leaveTypeElement = document.createElement('p');
  leaveTypeElement.textContent = `Leave Type: ${leaveData.leave_type}`;
  leaveTypeElement.style.fontWeight = 'bold';
  leaveTypeElement.style.fontSize = '1.25rem';
  detailsContainer.appendChild(leaveTypeElement);

  const startDateElement = document.createElement('p');
  startDateElement.textContent = `Start Date: ${leaveData.start_date}`;
  startDateElement.style.fontWeight = 'bold';
  startDateElement.style.fontSize = '1.25rem';
  detailsContainer.appendChild(startDateElement);

  const endDateElement = document.createElement('p');
  endDateElement.textContent = `End Date: ${leaveData.end_date}`;
  endDateElement.style.fontWeight = 'bold';
  endDateElement.style.fontSize = '1.25rem';
  detailsContainer.appendChild(endDateElement);

  const reasonElement = document.createElement('p');
  reasonElement.textContent = `Reason: ${leaveData.reason}`;
  reasonElement.style.fontWeight = 'bold';
  reasonElement.style.fontSize = '1.25rem';
  detailsContainer.appendChild(reasonElement);

  leaveInfoCard.appendChild(detailsContainer);

  // Create action buttons container
  const actionButtonsContainer = document.createElement('div');
  actionButtonsContainer.style.display = 'flex';
  actionButtonsContainer.style.justifyContent = 'space-evenly';
  actionButtonsContainer.style.marginTop = '2rem';

  // Create Approve button
  const approveButton = document.createElement('button');
  approveButton.textContent = 'Approve';
  approveButton.style.padding = '0.5rem 2rem';
  approveButton.style.fontSize = '1.2rem';
  approveButton.style.fontWeight = '500';
  approveButton.classList.add('btn', 'btn-primary');
  approveButton.style.border = 'none';
  approveButton.style.borderRadius = '5px';
  approveButton.style.cursor = 'pointer';
  approveButton.style.transition = 'background-color 0.3s';
  approveButton.addEventListener('mouseover', () => approveButton.style.backgroundColor = '#28a745');
  approveButton.addEventListener('mouseout', () => approveButton.style.backgroundColor = '#007bff');
  approveButton.addEventListener('click', () => handleLeaveDecision(leaveData.id, leaveData.eid, 'approve'));

  // Create Reject button
  const rejectButton = document.createElement('button');
  rejectButton.textContent = 'Reject';
  rejectButton.style.padding = '0.5rem 2rem';
  rejectButton.style.fontSize = '1.2rem';
  rejectButton.style.fontWeight = '500';
  rejectButton.classList.add('btn', 'btn-primary');
  rejectButton.style.border = 'none';
  rejectButton.style.borderRadius = '5px';
  rejectButton.style.cursor = 'pointer';
  rejectButton.style.transition = 'background-color 0.3s';
  rejectButton.addEventListener('mouseover', () => rejectButton.style.backgroundColor = '#dc3545');
  rejectButton.addEventListener('mouseout', () => rejectButton.style.backgroundColor = '#007bff');
  rejectButton.addEventListener('click', () => handleLeaveDecision(leaveData.id, leaveData.eid, 'reject'));
  actionButtonsContainer.appendChild(approveButton);
  actionButtonsContainer.appendChild(rejectButton);
  leaveInfoCard.appendChild(actionButtonsContainer);

  document.body.appendChild(leaveInfoCard);

  document.addEventListener('click', function(event) {
    if (!leaveInfoCard.contains(event.target)) {
      leaveInfoCard.remove();
    }
  });
}

function handleLeaveDecision(id, eid, action) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost/backend/ajax/leavedecision.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
      // Remove the row from the table
      const rowToRemove = tableRows.find(row => row.querySelector('td:first-child').textContent === eid);
      if (rowToRemove) {
        rowToRemove.remove();
        tableRows = tableRows.filter(row => row !== rowToRemove);
        totalRows--;
        updatePagination(totalRows);
        displayPage(currentPage);
      }
      // Close the leave info card
      document.querySelector('div[style*="z-index: -1"]').remove();
      // Optionally, show a success message to the user
      alert(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
    } else {
      console.error('Request failed. Status code:', xhr.status);
      alert('An error occurred while processing your request.');
    }
  };

  xhr.onerror = function() {
    console.error('Connection error');
    alert('A connection error occurred. Please try again.');
  };

  const params = `id=${id}&eid=${eid}&action=${action}`;
  xhr.send(params);
}
// Pagination functionality (unchanged)
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
window.addEventListener('DOMContentLoaded', function() {
  fetchData();
});

let cardElements = [];
const itemsPerPage = 18;
let currentPage = 1;
let totalRows = 0;
let data = [];
 
function fetchData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost/backend/ajax/profiles.php', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      data = JSON.parse(xhr.responseText);
      totalRows = data.length;
      populateCards(data);
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

function populateCards(data) {
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = '';
  cardElements = [];

  if (data.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'No matching results found.';
    cardContainer.appendChild(noResultsMessage);
    return;
  }

  data.forEach(function(row) {
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.style.display = 'grid';
    newCard.style.gridTemplateColumns = '1fr 3fr';
    newCard.style.gap = '1rem';

    const photoContainer = document.createElement('div');
    photoContainer.classList.add('photo-container');
    const photo = document.createElement('img');
    photo.classList.add('photo');
    if (row.Photo && row.Photo.trim() !== '') {
      photo.src = row.Photo;
    } else {
      photo.src = '../../../assets/images/user-profile-absent';
    }
    photoContainer.appendChild(photo);
    newCard.appendChild(photoContainer);

    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('details-container');

    const eidElement = document.createElement('p');
    eidElement.textContent = `EID: ${row.eid}`;
    eidElement.style.fontSize = '0.90rem';
    eidElement.style.fontWeight = 'bolder';
    detailsContainer.appendChild(eidElement);

    const nameElement = document.createElement('p');
    nameElement.textContent = `Name: ${row.Name}`;
    nameElement.style.fontSize = '0.90rem';
    nameElement.style.fontWeight = 'bolder';
    detailsContainer.appendChild(nameElement);

    const positionElement = document.createElement('p');
    positionElement.textContent = `Position: ${row.position}`;
    positionElement.style.fontSize = '0.90rem';
    positionElement.style.fontWeight = 'bolder';
    detailsContainer.appendChild(positionElement);

    const departmentElement = document.createElement('p');
    departmentElement.textContent = `Department: ${row.Department}`;
    departmentElement.style.fontWeight = 'bolder';
    departmentElement.style.fontSize = '0.90rem';
    detailsContainer.appendChild(departmentElement);

    const officeLocationElement =document.createElement('p');
    officeLocationElement .textContent =`Office-Location: ${row.office_location}`
    officeLocationElement.style.fontWeight='bolder';
    officeLocationElement.style.fontSize='0.90rem';
    detailsContainer.appendChild(officeLocationElement);

    newCard.appendChild(detailsContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.marginTop = '1rem';

    const transferButton = document.createElement('button');
    transferButton.textContent = 'Transfer';
    transferButton.style.backgroundColor = '#ffc107';
    transferButton.style.color = '#212529';
    transferButton.addEventListener('click', showTransferForm);
    buttonContainer.appendChild(transferButton);

    const contractButton = document.createElement('button');
    contractButton.textContent = 'Contract';
    contractButton.style.backgroundColor = '#28a745';
    contractButton.style.color = 'white';
    buttonContainer.appendChild(contractButton);

    const offboardingButton = document.createElement('button');
    offboardingButton.textContent = 'Offboard';
    offboardingButton.style.backgroundColor = '#dc3545';
    offboardingButton.style.color = 'white';
    offboardingButton.style.cursor = 'pointer';
    buttonContainer.appendChild(offboardingButton);

    newCard.appendChild(buttonContainer);

    cardContainer.appendChild(newCard);
    cardElements.push(newCard);
  });

  displayPage(1);
}

function showTransferForm(event) {
  event.stopPropagation();

  const card = event.target.closest('.card');
  const eid = card.querySelector('.details-container p:first-child').textContent.split(':')[1].trim();
  const department = card.querySelector('.details-container p:nth-child(4)').textContent.split(':')[1].trim();
  
  // Find the employee data from the fetched data
  const employeeData = data.find(row => row.eid === eid);
  const officeLocation = employeeData ? employeeData.office_location : 'Unknown';

  const cardRect = card.getBoundingClientRect();
  const cardTop = cardRect.top + window.scrollY;
  const cardLeft = cardRect.left + window.scrollX;

  const transferCard = document.createElement('div');
  transferCard.style.height = 'auto';
  transferCard.style.width = '25rem';
  transferCard.style.borderRadius = '10px';
  transferCard.style.background = '#e4e1e1';
  transferCard.style.padding = '2rem';
  transferCard.style.position = 'absolute';
  transferCard.style.top = `${cardTop}px`;
  transferCard.style.left = `${cardLeft}px`;
  transferCard.style.backgroundColor = 'white';
  transferCard.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
  transferCard.style.zIndex = '999';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '1.5rem';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.color = '#666';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => transferCard.remove());
  transferCard.appendChild(closeButton);

  const eidElement = document.createElement('p');
  eidElement.textContent = `EID: ${eid}`;
  eidElement.style.fontWeight = 'bold';
  transferCard.appendChild(eidElement);

  const form = document.createElement('form');
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.gap = '0.25rem';

  const departmentLabel = document.createElement('label');
  departmentLabel.textContent = 'Department:';
  departmentLabel.style.fontWeight = 'bold';
  form.appendChild(departmentLabel);

  const departmentInput = document.createElement('input');
  departmentInput.type = 'text';
  departmentInput.value = department;
  departmentInput.style.padding = '0.5rem';
  departmentInput.style.borderRadius = '5px';
  departmentInput.style.border = '1px solid #ccc';
  form.appendChild(departmentInput);

  const officeLocationLabel = document.createElement('label');
  officeLocationLabel.textContent = 'Office Location:';
  officeLocationLabel.style.fontWeight = 'bold';
  form.appendChild(officeLocationLabel);

  const officeLocationInput = document.createElement('input');
  officeLocationInput.type = 'text';
  officeLocationInput.value = officeLocation;
  officeLocationInput.style.padding = '0.5rem';
  officeLocationInput.style.borderRadius = '5px';
  officeLocationInput.style.border = '1px solid #ccc';
  form.appendChild(officeLocationInput);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Update & Return';
  submitButton.classList.add('btn', 'btn-primary');
  submitButton.style.marginTop = '1rem';
  form.appendChild(submitButton);

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    const newDepartment = departmentInput.value;
    const newOfficeLocation = officeLocationInput.value;

    // Here you would typically send this data to your server using AJAX
    fetch('http://localhost/backend/ajax/update_employee.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eid: eid,
        department: newDepartment,
        office_location: newOfficeLocation
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Update the card with new data
      card.querySelector('.details-container p:nth-child(4)').textContent = `Department: ${newDepartment}`;
      // You might also want to update other parts of the UI here

      transferCard.remove(); // Close the transfer form
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });

  transferCard.appendChild(form);

  document.body.appendChild(transferCard);

  document.addEventListener('click', function(event) {
    if (!transferCard.contains(event.target)) {
      transferCard.remove();
    }
  });
}
// Pagination functionality
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');

function displayPage(page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleCards = cardElements.filter(card => card.style.display !== 'none');

  if (visibleCards.length === 0) {
    currentPage = 1;
    updatePaginationButtons(0);
    return;
  }

  visibleCards.forEach((card, index) => {
    if (index >= startIndex && index < endIndex) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });

  currentPage = page;
  updatePaginationButtons(visibleCards.length);
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

// Search functionality
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', handleSearch);

function handleSearch() {
  const searchValue = searchInput.value.toLowerCase();
  const filteredData = data.filter(row => {
    const eid = row.eid.toLowerCase();
    const name = row.Name.toLowerCase();
    const department = row.Department.toLowerCase();
    const position = row.position.toLowerCase();

    return (
      eid.includes(searchValue) ||
      name.includes(searchValue) ||
      department.includes(searchValue) ||
      position.includes(searchValue)
    );
  });

  populateCards(filteredData);
  updatePagination(filteredData.length);
  displayPage(1);
}
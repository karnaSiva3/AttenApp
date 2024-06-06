window.addEventListener('DOMContentLoaded', function() {
  fetchData();
});

let cardElements = [];
const itemsPerPage = 12;
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
    eidElement.style.fontSize = '0.95rem';
    eidElement.style.fontWeight = 'bolder';
    detailsContainer.appendChild(eidElement);

    const nameElement = document.createElement('p');
    nameElement.textContent = `Name: ${row.Name}`;
    nameElement.style.fontSize = '0.95rem';
    nameElement.style.fontWeight = 'bolder';
    detailsContainer.appendChild(nameElement);

    const positionElement = document.createElement('p');
    positionElement.textContent = `Position: ${row.position}`;
    positionElement.style.fontSize = '0.95rem';
    positionElement.style.fontWeight = 'bolder';
    detailsContainer.appendChild(positionElement);

    const departmentElement = document.createElement('p');
    departmentElement.textContent = `Department: ${row.Department}`;
    departmentElement.style.fontWeight = 'bolder';
    departmentElement.style.fontSize = '0.95rem';
    detailsContainer.appendChild(departmentElement);

    newCard.appendChild(detailsContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.marginTop = '1rem';

    const transferButton = document.createElement('button');
    transferButton.textContent = 'Transfer';
    transferButton.classList.add('btn', 'btn-warning');
    buttonContainer.appendChild(transferButton);

    const contractButton = document.createElement('button');
    contractButton.textContent = 'Contract';
    contractButton.classList.add('btn', 'btn-success');
    buttonContainer.appendChild(contractButton);

    const offboardingButton = document.createElement('button');
    offboardingButton.textContent = 'Offboard';
    offboardingButton.classList.add('btn', 'btn-danger');
    buttonContainer.appendChild(offboardingButton);

    newCard.appendChild(buttonContainer);

    cardContainer.appendChild(newCard);
    cardElements.push(newCard);
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
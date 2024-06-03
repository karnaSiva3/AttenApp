window.addEventListener('DOMContentLoaded', function() {
  fetchData();
});

let cardElements = [];
const itemsPerPage = 3;
let currentPage = 1;
let totalRows = 0;

function fetchData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost/backend/ajax/profiles.php', true);
  xhr.onload = function() {
      if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
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
  data.forEach(function(row) {
      const newCard = document.createElement('div');
      newCard.classList.add('card');

      const eidElement = document.createElement('p');
      eidElement.textContent = `EID: ${row.eid}`;
      newCard.appendChild(eidElement);

      const nameElement = document.createElement('p');
      nameElement.textContent = `Name: ${row.Name}`;
      newCard.appendChild(nameElement);

      const positionElement = document.createElement('p');
      positionElement.textContent = `Position: ${row.position}`;
      newCard.appendChild(positionElement);

      const departmentElement = document.createElement('p');
      departmentElement.textContent = `Department: ${row.Department}`;
      newCard.appendChild(departmentElement);

      const officeLocationElement = document.createElement('p');
      officeLocationElement.textContent = `Office Location: ${row.office_location}`;
      newCard.appendChild(officeLocationElement);

      const hiredateElement = document.createElement('p');
      hiredateElement.textContent = `Hire Date: ${row['Hire-Date']}`;
      newCard.appendChild(hiredateElement);

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

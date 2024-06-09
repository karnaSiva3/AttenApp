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
    newCard.style.position = 'relative';

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
    eidElement.style.fontSize = '1rem';
    eidElement.style.marginBottom = '0.5rem';
    eidElement.style.fontWeight = 'bolder';
    detailsContainer.appendChild(eidElement);

    const nameElement = document.createElement('p');
    nameElement.textContent = `Name: ${row.Name}`;
    nameElement.style.fontSize = '1rem';
    nameElement.style.marginBottom = '0.5rem';
    nameElement.style.fontWeight = 'bolder';
    detailsContainer.appendChild(nameElement);

    const positionElement = document.createElement('p');
    positionElement.textContent = `Position: ${row.position}`;
    positionElement.style.fontSize = '0.90rem';
    positionElement.style.fontWeight = 'bolder';
    positionElement.style.display = 'none';
    detailsContainer.appendChild(positionElement);

    const departmentElement = document.createElement('p');
    departmentElement.textContent = `Department: ${row.Department}`;
    departmentElement.style.fontWeight = 'bolder';
    departmentElement.style.fontSize = '0.90rem';
    departmentElement.style.display = 'none';
    detailsContainer.appendChild(departmentElement);

    const officeLocationElement = document.createElement('p');
    officeLocationElement.textContent = `Office-Location: ${row.office_location}`;
    officeLocationElement.style.fontWeight = 'bolder';
    officeLocationElement.style.fontSize = '0.90rem';
    officeLocationElement.style.display = 'none';
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
    contractButton.addEventListener('click', showContractForm);
    buttonContainer.appendChild(contractButton);

    const offboardingButton = document.createElement('button');
    offboardingButton.textContent = 'Offboard';
    offboardingButton.style.backgroundColor = '#dc3545';
    offboardingButton.style.color = 'white';
    offboardingButton.style.cursor = 'pointer';
    offboardingButton.addEventListener('click', function() {offboardEmployee({
      eid: row.eid,
      name: row.Name,
      position: row.position,
      department: row.Department,
      salary: row.Salary
    });
    });
    buttonContainer.appendChild(offboardingButton);

    newCard.appendChild(buttonContainer);

    const iconButton = document.createElement('button');
    iconButton.style.position = 'absolute';
    iconButton.style.top = '10px';
    iconButton.style.left = '350px';
    iconButton.style.border = 'none';
    iconButton.style.cursor = 'pointer';

    const iconImage = document.createElement('img');
    iconImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IArs4c6QAAAX5JREFUOE+tlD8sQ3EQxz8XwcBoqXTpgB0DZSIRCRZilVRiJ5heEx36ytAIE+lgZEAi2KyCQSsSE4mNSrrWovR4fXlpq6/t8+fGd3ef3Pf3vnfCP4bUZK1oO+8MAAEgjXBFVB6q9VTCprWBLmZQZoFBl8YblD2a2CIi2dJ8OSyireQ4AoY9qL9DGSEmaae2HGboKTDmAeSUJMnQT0Jy1ociLKyTKIcuIOutEigTQHdFXpgnKpvlMEOvgR4XWBJTejE0AcxV5JVnYvhB1J4srAGUxyrysghJlE7A51qTJ8iqXNowQ6eAg1/DYBFT1p3JQig7VWC1ZdpNG5iy4MDGUU5+DVPCxMS0YRFtI0fmDzDLb2el1jhHC6vzPerJzHCPj335KMIMtXx0/GOfwTKmxMt9Zv9VC2ZBvUaKDH2VG2C1L2kLzYXphjzQbmlklIi8OLXuV6ODEEIICLpAU18G3uWNbeLyWpqvd8/85ApA6549keeCNam2KSWL7kFXvZJPUp+GFLIDtd4AAAAASUVORK5CYII=';
    iconImage.alt = 'Icon';
    iconImage.style.width = '28px'; 
    iconImage.style.height = '28px';
    iconButton.appendChild(iconImage);

    iconButton.addEventListener('click', showEmployeeInfo);

    newCard.appendChild(iconButton);

    cardContainer.appendChild(newCard);
    cardElements.push(newCard);
  });

  displayPage(1);
}

function offboardEmployee(employeeData) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost/backend/ajax/offboardtable.php', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 201) {
        console.log(xhr.responseText);
        window.location.href = 'http://127.0.0.1:5500/frontend/src/templates/pages/Employee/offboarding.html';
      } else {
        console.error('Error:', xhr.status, xhr.responseText);
        alert('Failed to offboard employee. Please try again.');
      }
    }
  };
  const employeeDataWithJobTitle = {
    eid: employeeData.eid,
    name: employeeData.name,
    jobTitle: employeeData.position, 
    department: employeeData.department,
    salary: employeeData.salary
  };
  xhr.send(JSON.stringify(employeeDataWithJobTitle));
}

function showEmployeeInfo(event) {
  event.stopPropagation();

  const card = event.target.closest('.card');
  const eid = card.querySelector('.details-container p:first-child').textContent.split(':')[1].trim();
  const name = card.querySelector('.details-container p:nth-child(2)').textContent.split(':')[1].trim();
  const position = card.querySelector('.details-container p:nth-child(3)').textContent.split(':')[1].trim();
  const department = card.querySelector('.details-container p:nth-child(4)').textContent.split(':')[1].trim();
  const officeLocation = card.querySelector('.details-container p:nth-child(5)').textContent.split(':')[1].trim();

  // Find the employee data from the fetched data
  const employeeData = data.find(row => row.eid === eid);
  const hireDate = employeeData ? employeeData['Hire-date'] : 'Unknown';
  const salary = employeeData ? employeeData.Salary : 'Unknown';

  const cardRect = card.getBoundingClientRect();
  const cardTop = cardRect.top + window.scrollY;
  const cardLeft = cardRect.left + window.scrollX;

  const employeeInfoCard = document.createElement('div');
  employeeInfoCard.style.height = '18rem';
  employeeInfoCard.style.width = '25rem';
  employeeInfoCard.style.borderRadius = '10px';
  employeeInfoCard.style.background = '#e4e1e1';
  employeeInfoCard.style.padding = '2rem';
  employeeInfoCard.style.position = 'absolute';
  employeeInfoCard.style.top = `${cardTop}px`;
  employeeInfoCard.style.left = `${cardLeft}px`;
  employeeInfoCard.style.backgroundColor = 'white';
  employeeInfoCard.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
  employeeInfoCard.style.zIndex = '999';
  employeeInfoCard.style.display = 'grid';
  employeeInfoCard.style.gridTemplateColumns = '1fr 3fr';
  employeeInfoCard.style.gap = '1rem';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '2rem';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.color = '#666';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => employeeInfoCard.remove());
  employeeInfoCard.appendChild(closeButton);

  const titleElement = document.createElement('h3');
  titleElement.textContent = 'Employee Information';
  titleElement.style.marginTop = '0';
  titleElement.style.fontSize='1.35rem';
  titleElement.style.fontWeight='bolder';
  titleElement.style.color='#007bff';
  titleElement.style.gridColumn = '1 / -1';
  employeeInfoCard.appendChild(titleElement);

  const detailsContainer = document.createElement('div');
  detailsContainer.style.gridColumn = '1/ -1';

  const nameElement = document.createElement('p');
  nameElement.textContent = `Name: ${name}`;
  nameElement.style.fontWeight = 'bold';
  detailsContainer.appendChild(nameElement);

  const positionElement = document.createElement('p');
  positionElement.textContent = `Position: ${position}`;
  positionElement.style.fontWeight='bold';
  detailsContainer.appendChild(positionElement);

  const departmentElement = document.createElement('p');
  departmentElement.textContent = `Department: ${department}`;
  departmentElement.style.fontWeight='bold';
  detailsContainer.appendChild(departmentElement);

  const salaryElement = document.createElement('p');
  salaryElement.textContent = `Salary: ${salary}`;
  salaryElement.style.fontWeight='bold';
  detailsContainer.appendChild(salaryElement);

  const officeLocationElement = document.createElement('p');
  officeLocationElement.textContent = `Office Location: ${officeLocation}`;
  officeLocationElement.style.fontWeight='bold';
  detailsContainer.appendChild(officeLocationElement);

  const hireDateElement = document.createElement('p');
  hireDateElement.textContent = `Hire Date: ${hireDate}`;
  hireDateElement.style.fontWeight='bold';
  detailsContainer.appendChild(hireDateElement);

  employeeInfoCard.appendChild(detailsContainer);

  document.body.appendChild(employeeInfoCard);

  document.addEventListener('click', function(event) {
    if (!employeeInfoCard.contains(event.target)) {
      employeeInfoCard.remove();
    }
  });
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
  closeButton.style.fontSize = '2rem';
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
  submitButton.textContent = 'Update';
  submitButton.style.fontWeight='bolder';
  submitButton.classList.add('btn', 'btn-primary');
  submitButton.style.marginTop = '1rem';
  form.appendChild(submitButton);

  form.addEventListener('submit', async function(e) {
    e.preventDefault(); 
  
    const newDepartment = departmentInput.value;
    const newOfficeLocation = officeLocationInput.value;
  
    try {
      const response = await fetch('http://localhost/backend/ajax/transfer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eid: eid,
          department: newDepartment,
          office_location: newOfficeLocation
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Success:', data);
  
      // Update the card with new data
      card.querySelector('.details-container p:nth-child(4)').textContent = `Department: ${newDepartment}`;
      // You might also want to update other parts of the UI here
  
      // Show an alert for successful update
      alert(`Employee ${eid} has been successfully transferred to ${newDepartment} department at ${newOfficeLocation} office.`);
  
      transferCard.remove(); // Close the transfer form
    } catch (error) {
      console.error('Error:', error);
      // Show an alert for failed update
      alert(`Failed to transfer employee ${eid}. Error: ${error.message}`);
    }
  });


  transferCard.appendChild(form);

  document.body.appendChild(transferCard);

  document.addEventListener('click', function(event) {
    if (!transferCard.contains(event.target)) {
      transferCard.remove();
    }
  });
}

function showContractForm(event) {
  event.stopPropagation();

  const card = event.target.closest('.card');
  const eid = card.querySelector('.details-container p:first-child').textContent.split(':')[1].trim();
  const position = card.querySelector('.details-container p:nth-child(3)').textContent.split(':')[1].trim();
  
  // Find the employee data from the fetched data
  const employeeData = data.find(row => row.eid === eid);
  const salary = employeeData ? employeeData.Salary : 'Unknown';

  const cardRect = card.getBoundingClientRect();
  const cardTop = cardRect.top + window.scrollY;
  const cardLeft = cardRect.left + window.scrollX;

  const contractCard = document.createElement('div');
  contractCard.style.height = 'auto';
  contractCard.style.width = '25rem';
  contractCard.style.borderRadius = '10px';
  contractCard.style.background = '#e4e1e1';
  contractCard.style.padding = '2rem';
  contractCard.style.position = 'absolute';
  contractCard.style.top = `${cardTop}px`;
  contractCard.style.left = `${cardLeft}px`;
  contractCard.style.backgroundColor = 'white';
  contractCard.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
  contractCard.style.zIndex = '999';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '2rem';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.color = '#666';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => contractCard.remove());
  contractCard.appendChild(closeButton);

  const eidElement = document.createElement('p');
  eidElement.textContent = `EID: ${eid}`;
  eidElement.style.fontWeight = 'bold';
  contractCard.appendChild(eidElement);

  const form = document.createElement('form');
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.gap = '0.25rem';

  const positionLabel = document.createElement('label');
  positionLabel.textContent = 'Position:';
  positionLabel.style.fontWeight = 'bold';
  form.appendChild(positionLabel);

  const positionInput = document.createElement('input');
  positionInput.type = 'text';
  positionInput.value = position;
  positionInput.style.padding = '0.5rem';
  positionInput.style.borderRadius = '5px';
  positionInput.style.border = '1px solid #ccc';
  form.appendChild(positionInput);

  const salaryLabel = document.createElement('label');
  salaryLabel.textContent = 'Salary:';
  salaryLabel.style.fontWeight = 'bold';
  form.appendChild(salaryLabel);

  const salaryInput = document.createElement('input');
  salaryInput.type = 'text';
  salaryInput.value = salary;
  salaryInput.style.padding = '0.5rem';
  salaryInput.style.borderRadius = '5px';
  salaryInput.style.border = '1px solid #ccc';
  form.appendChild(salaryInput);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Update';
  submitButton.style.fontWeight = 'bolder';
  submitButton.classList.add('btn', 'btn-primary');
  submitButton.style.marginTop = '1rem';
  form.appendChild(submitButton);

  form.addEventListener('submit', async function(e) {
    e.preventDefault(); 
  
    const newPosition = positionInput.value;
    const newSalary = salaryInput.value;
  
    try {
      const response = await fetch('http://localhost/backend/ajax/contract.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eid: eid,
          position: newPosition,
          salary: newSalary
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Success:', data);
  
      // Update the card with new data
      card.querySelector('.details-container p:nth-child(3)').textContent = `Position: ${newPosition}`;
      // You might also want to update other parts of the UI here
  
      // Show an alert for successful update
      alert(`Employee ${eid}'s contract has been successfully updated. New position: ${newPosition}, New salary: ${newSalary}`);
  
      contractCard.remove(); // Close the contract form
    } catch (error) {
      console.error('Error:', error);
      // Show an alert for failed update
      alert(`Failed to update contract for employee ${eid}. Error: ${error.message}`);
    }
  });

  contractCard.appendChild(form);

  document.body.appendChild(contractCard);

  document.addEventListener('click', function(event) {
    if (!contractCard.contains(event.target)) {
      contractCard.remove();
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
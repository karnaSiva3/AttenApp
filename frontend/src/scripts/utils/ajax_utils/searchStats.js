const searchInput = document.getElementById('searchInput');
const searchOptions = document.getElementById('searchOptions');
const displayResults = document.getElementById('displayResults');

// Fetch data from the backend
fetch('http://localhost/backend/ajax/fetchStats.php')
  .then(response => response.json())
  .then(data => {
    // Handle the fetched data
    handleData(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

  
// Handle the fetched data
function handleData(data) {
  // Filter data based on search input
  searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    const filteredData = data.filter(item =>
      item.Name.toLowerCase().includes(searchValue) ||
      item.eid.toLowerCase().includes(searchValue)
    );

    // Clear previous search options
    searchOptions.innerHTML = '';

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '<i class="bx bx-x"></i>'; // Replace 'X' with the icon
    closeButton.style.fontSize = '1.5rem';
    closeButton.style.color = 'black';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '30px';

    closeButton.addEventListener('click', () => {
      searchInput.value = ''; // Clear the search input
      searchOptions.innerHTML = '';
      searchOptions.style.display = 'none';
    });
    searchInput.parentNode.insertBefore(closeButton, searchInput.nextSibling);

    searchOptions.style.display = 'flex';
    searchOptions.style.height = '30rem';
    searchOptions.style.width = '30rem';
    searchOptions.style.background = '#f2f2f2';
    searchOptions.style.color = 'black';
    searchOptions.style.borderRadius = '1rem';
    searchOptions.style.flexDirection = 'column';

    // Render search options
    if (filteredData.length > 0) {
      filteredData.slice(0, 10).forEach(item => {
        const optionContainer = document.createElement('div');
        optionContainer.style.display = 'flex';
        optionContainer.style.height = '3rem';
        optionContainer.style.width = '30rem';
        optionContainer.style.outline = '10px #007bff';
        optionContainer.style.boxShadow = '10px black';
        optionContainer.style.flexDirection = 'column';
        optionContainer.style.borderRadius = '3rem';
        optionContainer.style.alignItems = 'start';
        optionContainer.style.justifyContent = 'center';
        optionContainer.style.padding = '1rem 1rem 1rem 2.5rem';
        optionContainer.addEventListener('mouseover', function() {
          optionContainer.style.backgroundColor = '#e9f2ff';
          optionContainer.style.color = '#007bff';
        });
        optionContainer.addEventListener('mouseout', function() {
          optionContainer.style.backgroundColor = '#f2f2f2';
          optionContainer.style.outline = '10px #007bff';
          optionContainer.style.color = 'black';
          optionContainer.style.boxShadow = '10px black';
        });

        const option = document.createElement('div');
        option.textContent = `${item.eid}:${item.Name}`;
        option.style.fontSize = '1.2rem';
        option.style.fontWeight = 'bold';
        option.style.marginLeft = '1rem';
        option.addEventListener('click', () => {
          displaySearchResult(item);
        });

        optionContainer.appendChild(option);
        searchOptions.appendChild(optionContainer);
      });
    }
  });
}

// Display search result
function displaySearchResult(result) {
  // Clear previous search result
  displayResults.innerHTML = '';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = 'X';
  closeButton.fontSize='1rem'
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.width = '4rem'; 
  closeButton.style.height = '4rem';
  closeButton.addEventListener('click', () => {
    displayResults.innerHTML = '';
    searchOptions.style.display = 'flex';
  });

  // Create result container
  const resultContainer = document.createElement('div');
  resultContainer.style.position = 'relative';
  resultContainer.style.display = 'flex';
  resultContainer.style.flexDirection = 'column';
  resultContainer.style.height = '30rem';
  resultContainer.style.width = '30rem';
  resultContainer.style.padding = '2rem';
  resultContainer.style.borderRadius = '1rem';
  resultContainer.appendChild(closeButton);

  // Create attendance container
  const attendanceContainer = document.createElement('div');
  attendanceContainer.style.display = 'flex';
  attendanceContainer.style.flexDirection = 'column';
  attendanceContainer.style.width = '100%';
  attendanceContainer.style.height = '50%';
  attendanceContainer.style.padding = '2rem';

  const attendanceInfo = document.createElement('p');
  attendanceInfo.textContent = `Attendance: ${result.Attendance}/261`;
  attendanceInfo.style.fontSize = '2rem';
  attendanceInfo.style.fontWeight = 'bold';
  attendanceInfo.style.textAlign = 'center';
  attendanceContainer.appendChild(attendanceInfo);

  // Create leave container
  const leaveContainer = document.createElement('div');
  leaveContainer.style.display = 'flex';
  leaveContainer.style.flexDirection = 'column';
  leaveContainer.style.width = '100%';
  leaveContainer.style.height = '50%';
  leaveContainer.style.padding = '1rem';

  const leaveInfo = document.createElement('p');
  leaveInfo.textContent = `Leaves left: ${12 - result.Leaves}/12`;
  leaveInfo.style.fontSize = '2rem';
  leaveInfo.style.fontWeight = 'bold';
  leaveInfo.style.textAlign = 'center';
  leaveContainer.appendChild(leaveInfo);

  // Append attendance and leave containers to result container
  resultContainer.appendChild(attendanceContainer);
  resultContainer.appendChild(leaveContainer);

  // Append result container to displayResults
  displayResults.appendChild(resultContainer);

  // Hide search options
  searchOptions.style.display = 'none';
}
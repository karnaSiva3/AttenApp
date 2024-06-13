// Get references to HTML elements
const searchInput = document.getElementById('searchInput');
const searchCard = document.getElementById('searchCard');
const statsCard = document.getElementById('statsCard');

// Array to store the employee data
let employeeData = [];

// Function to fetch employee data from the backend
function fetchEmployeeData() {
  // Make an AJAX request to fetch employee data from the backend
  // and store the data in the employeeData array
  // ...
}

// Function to render search results
function renderSearchResults(results) {
  // Clear the search card and stats card
  searchCard.innerHTML = '';
  statsCard.innerHTML = '';

  if (results.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'No results found';
    searchCard.appendChild(noResultsMessage);
  } else {
    // Create a new card for each search result
    results.forEach(result => {
      const resultCard = document.createElement('div');
      resultCard.classList.add('card');

      // Add employee details to the card
      resultCard.innerHTML = `
        <p>EID: ${result.eid}</p>
        <p>Name: ${result.name}</p>
        <p>Department: ${result.department}</p>
        <button onclick="showAttendanceAndLeaveStats('${result.eid}')">Show Stats</button>
      `;

      searchCard.appendChild(resultCard);
    });
  }
}

// Function to filter employee data based on search query
function filterEmployeeData(query) {
  const lowercaseQuery = query.toLowerCase();
  return employeeData.filter(employee => {
    const eid = employee.eid.toString().toLowerCase();
    const name = employee.name.toLowerCase();
    const department = employee.department.toLowerCase();
    return eid.includes(lowercaseQuery) || name.includes(lowercaseQuery) || department.includes(lowercaseQuery);
  });
}

// Function to show attendance and leave stats for a specific employee
function showAttendanceAndLeaveStats(eid) {
  fetchAttendanceAndLeaveStats(eid);
}

function fetchAttendanceAndLeaveStats(eid) {
  const statsXhr = new XMLHttpRequest();
  statsXhr.open('GET', `http://localhost/backend/ajax/stats.php?eid=${eid}`, true);

  statsXhr.onload = function() {
    if (statsXhr.status >= 200 && statsXhr.status < 400) {
      try {
        const responseText = statsXhr.responseText;
        const jsonStartIndex = responseText.indexOf('{');
        const jsonData = responseText.substring(jsonStartIndex);
        const response = JSON.parse(jsonData);

        // Clear the stats card
        statsCard.innerHTML = '';

        // Create elements to display attendance and leave stats
        const attendanceStatsElement = document.createElement('p');
        const leaveStatsElement = document.createElement('p');

        // Update the elements with the fetched data
        attendanceStatsElement.textContent = `Attendance: ${response.attendanceStats}/261`;
        const leavesLeft = 12 - response.leaveStats;
        leaveStatsElement.textContent = `Leave: ${12 - leavesLeft}/12`;

        // Append the elements to the stats card
        statsCard.appendChild(attendanceStatsElement);
        statsCard.appendChild(leaveStatsElement);

        console.log(response);
      } catch (e) {
        console.error('Error parsing server response:', e);
        // Clear the stats card and display an error message
        statsCard.innerHTML = '';
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error: Unable to fetch attendance and leave stats';
        statsCard.appendChild(errorMessage);
      }
    } else {
      alert('Server reached, but it returned an error');
    }
  };

  statsXhr.onerror = function() {
    alert('Connection error');
  };

  statsXhr.send();
}

// Event listener for the search input field
searchInput.addEventListener('input', () => {
  const searchQuery = searchInput.value.trim();
  const filteredData = filterEmployeeData(searchQuery);
  renderSearchResults(filteredData);
});

// Fetch employee data when the page loads
fetchEmployeeData();
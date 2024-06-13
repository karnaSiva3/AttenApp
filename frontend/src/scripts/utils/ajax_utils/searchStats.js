// Get references to the necessary HTML elements
const searchInput = document.getElementById('searchInput');
const suggestionBox = document.getElementById('suggestionBox');
const tableBody = document.getElementById('tableBody');
const searchCard = document.getElementById('searchCard');

// Function to fetch data from the backend
function fetchData(query) {
  return fetch(`http://localhost/backend/ajax/fetchStats.php?query=${encodeURIComponent(query)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

// Function to display suggestions
function displaySuggestions(suggestions) {
  suggestionBox.innerHTML = '';
  suggestions.forEach(item => {
    const suggestion = document.createElement('div');
    suggestion.textContent = `${item.eid} - ${item.Name}`;
    suggestion.classList.add('suggestion');
    suggestion.addEventListener('click', () => handleSuggestionClick(item));
    suggestionBox.appendChild(suggestion);
  });
}

// Function to handle suggestion click
function handleSuggestionClick(item) {
  searchInput.value = `${item.eid} - ${item.Name}`;
  suggestionBox.innerHTML = '';
  displaySearchResult(item);
}

// Function to display search result
function displaySearchResult(result) {
  tableBody.innerHTML = '';
  const row = document.createElement('tr');
  const eidCell = document.createElement('td');
  const nameCell = document.createElement('td');
  const attendanceCell = document.createElement('td');
  const leavesCell = document.createElement('td');

  eidCell.textContent = result.eid;
  nameCell.textContent = result.Name;
  attendanceCell.textContent = result.Attendance;
  leavesCell.textContent = result.Leaves;

  row.appendChild(eidCell);
  row.appendChild(nameCell);
  row.appendChild(attendanceCell);
  row.appendChild(leavesCell);

  tableBody.appendChild(row);
}

// Event listener for search input
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    fetchData(query)
      .then(data => {
        const suggestions = data.filter(item =>
          item.eid.toLowerCase().includes(query) ||
          item.Name.toLowerCase().includes(query)
        );
        displaySuggestions(suggestions);
      })
      .catch(error => {
        console.error('Error fetching suggestions:', error);
        suggestionBox.innerHTML = '<div class="suggestion">Error fetching suggestions</div>';
      });
  } else {
    suggestionBox.innerHTML = '';
  }
});

// Event listener for Enter key press
searchInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) {
      fetchData(query)
        .then(data => {
          const result = data.find(
            item =>
              item.eid === query ||
              item.Name.toLowerCase().includes(query.toLowerCase())
          );
          if (result) {
            displaySearchResult(result);
          } else {
            tableBody.innerHTML = '<tr><td colspan="4">No results found</td></tr>';
          }
        })
        .catch(error => {
          console.error('Error fetching search result:', error);
          tableBody.innerHTML = '<tr><td colspan="4">Error fetching search result</td></tr>';
        });
    }
  }
});
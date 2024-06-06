document.getElementById('submitBtn').addEventListener('click', function(event) {
    event.preventDefault();
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    document.getElementById('hire-date').value = today;
    var formData = new FormData(document.querySelector('form'));
  
    // Convert start date and end date to YYYY-MM-DD format
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
    const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
  
    // Replace the original date values with the formatted ones
    formData.set('start-date', formattedStartDate);
    formData.set('end-date', formattedEndDate);
  
    // Add additional data to the FormData object
    formData.append('EID', '27');
    formData.append('Name', 'Kushi Miglani');
    formData.append('Department', 'Software Development');
  
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/backend/ajax/applications.php', true);
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 400) {
        console.log(this.response);
        if (xhr.status == 200) {
          alert('Data submitted successfully');
          document.querySelector('form').reset();
        }
      } else {
        alert('Server reached, but it returned an error');
      }
    };
    xhr.onerror = function() {
      alert('Connection error');
    };
    xhr.send(formData);
});
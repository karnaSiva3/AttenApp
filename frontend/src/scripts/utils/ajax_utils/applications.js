document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

      var formData = new FormData(form);

      // Convert start date and end date to YYYY-MM-DD format
      const startDateInput = document.getElementById('start-date');
      const endDateInput = document.getElementById('end-date');
      
      if (startDateInput && endDateInput) {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        // Replace the original date values with the formatted ones
        formData.set('start-date', formattedStartDate);
        formData.set('end-date', formattedEndDate);
      }

      // Add additional data to the FormData object
      formData.append('EID', '11');
      formData.append('Name', 'Raj Mankar');
      formData.append('Department', 'Software Development');

      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost/backend/ajax/applications.php', true);
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
          console.log(this.response);
          if (xhr.status == 200) {
            alert('Data submitted successfully');
            form.reset();
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
  } else {
    console.error('Form not found');
  }
});

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
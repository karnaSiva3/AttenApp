document.getElementById('submitBtn').addEventListener('click', function(event) {
  event.preventDefault();

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
  document.getElementById('hire-date').value = today;

  var formData = new FormData(document.querySelector('form'));

  if (document.getElementById('photo').files.length > 0) {
    const file = document.getElementById('photo').files[0];
    const fileName = `${file.lastModified}_${file.name}`;
    const filePath = `../../../assets/images/${fileName}`;
    formData.append('photo', file, fileName);
    formData.append('photo_path', filePath);
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost/backend/ajax/onboarding.php', true);
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
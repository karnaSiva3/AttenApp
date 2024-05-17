document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  var formData = new FormData(this);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:80/backend/public/onboarding.php', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response.message);
        
      } else {
        console.error('Error:', xhr.statusText);
        
        alert('An error occurred while submitting the form. Please try again.');
      }
    }
  };
  xhr.send(formData);
});
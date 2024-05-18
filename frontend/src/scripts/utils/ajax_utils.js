document.getElementById('submitBtn').addEventListener('click', function(event) {
  event.preventDefault();

  var formData = new FormData(document.querySelector('form'));
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost/backend/public/onboarding.php', true);

  xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 400) {
          console.log(this.response);
      } else {
          console.error('Server reached, but it returned an error');
      }
  };

  xhr.onerror = function() {
      console.error('Connection error');
  };

  xhr.send(formData);
});

const form = document.querySelector('form');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(form);

  const xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://127.0.0.1/backend/public/onboardingform.php', true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
        form.reset();
      } else {
        console.error('Error submitting the form: ' + xhr.status);
        console.error(xhr.responseText);
      }
    }
  }

  xhr.send(formData);
});
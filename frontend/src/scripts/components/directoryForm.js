document.getElementById('onboardingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {};
  
  
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
  
   
    const photoFile = document.getElementById('photo').files[0];
    data['photo'] = photoFile;
  
    fetch('/backend/index.php', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert(data.message);
        this.reset();
        document.getElementById('formSubmitMessage').textContent = 'Form submitted successfully!';
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while submitting the form.');
    });
  });
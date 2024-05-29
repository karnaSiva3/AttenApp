const clockInBtn = document.getElementById('clock-in');

clockInBtn.addEventListener('click', function() {
  const eid = 18;
  const newStatus = 'In-Office';

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost/backend/ajax/status.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 400) {
      console.log(this.response);
      if (xhr.status === 200) {
        alert('Status updated successfully');
    
    }
    } else {
      alert('Server reached, but it returned an error');
    }
  };

  xhr.onerror = function() {
    alert('Connection error');
  };

  const data = `eid=${eid}&newStatus=${newStatus}`;
  xhr.send(data);
});
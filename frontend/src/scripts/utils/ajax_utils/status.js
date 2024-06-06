window.addEventListener('DOMContentLoaded', function() {
  // Get the clockInBtn element from the DOM
  const clockInBtn = document.getElementById('clock-in');
  // Variable to store the initial clockInTime
  let initialClockInTime = null;
  // Get today's date in the desired format (YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);

  // Fetch attendance and leave stats on page load
  fetchAttendanceAndLeaveStats(27);

  // Add event listener to clockInBtn
  clockInBtn.addEventListener('click', function() {
    const eid = 27; // Change EID value from here to see the change in value in the table
    let newStatus;
    let clockInTime;
    let clockOutTime;

    // Check the current text of the button to determine the new status and clock times
    if (clockInBtn.textContent === 'CLOCK-OUT') {
      newStatus = 'In-Office';
      // Get the current timestamp and date when the button is clicked for the first time
      if (!initialClockInTime) {
        const currentDateTime = new Date();
        initialClockInTime = currentDateTime.getTime();
        initialClockInDate = currentDateTime.toISOString().slice(0, 10); // YYYY-MM-DD format
      }
      clockInTime = `${initialClockInDate} ${new Date(initialClockInTime).toLocaleTimeString('en-US', { hour12: false })}`;
      clockOutTime = `${today} ${new Date().toLocaleTimeString('en-US', { hour12: false })}`;
    } else {
      newStatus = 'On-Leave';
      clockOutTime = `${today} ${new Date().toLocaleTimeString('en-US', { hour12: false })}`;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/backend/ajax/status.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 400) {
        console.log(this.response);
        if (xhr.status === 200) {
          alert('Status updated successfully');
          // Fetch updated attendance and leave stats after status update
          fetchAttendanceAndLeaveStats(eid);
        } else if (xhr.status === 204) {
          alert('Data not present in the database');
        }
      } else {
        alert('Server reached, but it returned an error');
      }
    };
    xhr.onerror = function() {
      alert('Connection error');
    };

    // Get the currentTimeValue from the clock_in.js file and format it as HH:MM:SS
    const currentTimeValueFormatted = formatTime(currentTimeValue);
    const data = `eid=${eid}&newStatus=${newStatus}&clockInTime=${clockInTime}&clockOutTime=${clockOutTime}&currentTimeValue=${currentTimeValueFormatted}&currentDate=${today}`;
    xhr.send(data);
  });

  // Function to format time in HH:MM:SS format
  function formatTime(time) {
    const hours = Math.floor(time / 3600000).toString().padStart(2, '0');
     const minutes = Math.floor((time % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  // Function to fetch attendance and leave stats from the backend
  function fetchAttendanceAndLeaveStats(eid) {
    const statsXhr = new XMLHttpRequest();
    statsXhr.open('GET', `http://localhost/backend/ajax/stats.php?eid=${eid}`, true);
    console.log(`http://localhost/backend/ajax/stats.php?eid=${eid}`);
    statsXhr.onload = function() {
      if (statsXhr.status >= 200 && statsXhr.status < 400) {
        try {
          const responseText = statsXhr.responseText;
          const jsonStartIndex = responseText.indexOf('{');
          const jsonData = responseText.substring(jsonStartIndex);
          const response = JSON.parse(jsonData);
  
          const attendanceStatsElement = document.getElementById('attendanceStats');
          const leaveStatsElement = document.getElementById('leaveStats');
  
          // Update the HTML elements with the fetched data
          attendanceStatsElement.textContent = `${response.attendanceStats}/261`;
          const leavesLeft = 12 - response.leaveStats;
          leaveStatsElement.textContent = `${12 - leavesLeft}/12`;
  
          console.log(response);
        } catch (e) {
          console.error('Error parsing server response:', e);
          // Handle the error here, e.g., display a default message in the HTML elements
          const attendanceStatsElement = document.getElementById('attendanceStats');
          const leaveStatsElement = document.getElementById('leaveStats');
          attendanceStatsElement.textContent = 'Error: Unable to fetch attendance stats';
          leaveStatsElement.textContent = 'Error: Unable to fetch leave stats';
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
});
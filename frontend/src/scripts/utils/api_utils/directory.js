const tableBody = document.querySelector('tbody');

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost/backend/api/directory.php');
    const data = await response.json();

    data.forEach(employee => {
      const row = document.createElement('tr');

      const eidCell = document.createElement('td');
      eidCell.textContent = employee.EID;
      row.appendChild(eidCell);

      const nameCell = document.createElement('td');
      nameCell.textContent = employee.Name;
      row.appendChild(nameCell);

      const jobTitleCell = document.createElement('td');
      jobTitleCell.textContent = employee['Job Title'];
      row.appendChild(jobTitleCell);

      const departmentCell = document.createElement('td');
      departmentCell.textContent = employee.Department;
      row.appendChild(departmentCell);

      const phoneCell = document.createElement('td');
      phoneCell.textContent = employee.Phone;
      row.appendChild(phoneCell);

      const emailCell = document.createElement('td');
      emailCell.textContent = employee.Email;
      row.appendChild(emailCell);

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

fetchData();
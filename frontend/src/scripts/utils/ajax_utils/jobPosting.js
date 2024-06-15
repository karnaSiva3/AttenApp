document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const postButton = document.querySelector('.post-button');

    postButton.addEventListener('click', function(event) {
        event.preventDefault();

        // Set the current date as the application deadline if not specified
        const deadlineInput = document.getElementById('application-deadline');
        if (!deadlineInput.value) {
            const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
            deadlineInput.value = today;
        }

        var formData = new FormData(form);

        // Handle checkbox group for benefits
        const benefitsCheckboxes = document.querySelectorAll('input[name="benefits"]:checked');
        const selectedBenefits = Array.from(benefitsCheckboxes).map(cb => cb.value);
        formData.append('benefits', JSON.stringify(selectedBenefits));

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost/backend/ajax/jobPosting.php', true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                console.log(this.response);
                if (xhr.status == 200) {
                    alert('Job posted successfully');
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
});
document.addEventListener('DOMContentLoaded', function () {
    const lessonList = document.getElementById('lessonList'); // Ensure this ID exists

    // Function to display lessons
    function displayLessons(files) {
        lessonList.innerHTML = ''; // Clear the old lessons

        files.forEach(file => {
            const li = document.createElement('li');
            li.classList.add('file-item'); // Add class for styling
            
            const title = document.createElement('span');
            title.textContent = file.file_name; // Adjust based on your DB structure

            // Create download button
            const downloadButton = document.createElement('a');
            downloadButton.href = `/static/uploads/${file.file_name}`; // Path to the uploaded file
            downloadButton.download = file.file_name; // Set the download attribute
            downloadButton.textContent = 'Download';
            downloadButton.classList.add('download-button'); // Add class for styling

            li.appendChild(title);
            li.appendChild(downloadButton);
            lessonList.appendChild(li);
        });
    }

    // Fetch the uploaded files from the server
    fetch('/files') // Ensure this URL matches your Flask route
        .then(response => response.json())
        .then(data => {
            displayLessons(data.files);
        })
        .catch(error => {
            console.error('Error fetching lessons:', error);
        });
});
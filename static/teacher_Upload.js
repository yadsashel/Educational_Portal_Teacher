document.addEventListener('DOMContentLoaded', function () {
    const lessonList = document.getElementById('fileList');
    const allFileList = document.getElementById('allFileList');
    const viewAllFilesButton = document.getElementById('viewAllFiles');
    const modal = document.getElementById('allFilesModal');
    const closeButton = document.querySelector('.close-button');
    const uploadForm = document.getElementById('uploadForm');

    // Function to display lessons
    function displayLessons(files) {
        lessonList.innerHTML = '';
        files.forEach(file => {
            const li = document.createElement('li');
            li.classList.add('file-item');

            const title = document.createElement('span');
            title.textContent = file.file_name;

            const downloadButton = document.createElement('a');
            downloadButton.href = `/static/uploads/${file.file_name}`;
            downloadButton.download = file.file_name;
            downloadButton.textContent = 'Download';
            downloadButton.classList.add('download-button');

            li.appendChild(title);
            li.appendChild(downloadButton);
            lessonList.appendChild(li);

            // Check if the file is a video to display it
            const videoExtensions = ['mp4', 'mkv'];
            const fileExtension = file.file_name.split('.').pop().toLowerCase();
            if (videoExtensions.includes(fileExtension)) {
                const videoPlayer = document.createElement('video');
                videoPlayer.src = downloadButton.href; // Link to video file
                videoPlayer.controls = true; // Show controls
                videoPlayer.style.width = '100%'; // Make it responsive
                li.appendChild(videoPlayer);
            }
        });
    }

    // Function to display all files
    function displayAllFiles(files) {
        allFileList.innerHTML = '';
        files.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file.file_name;
            allFileList.appendChild(li);
        });
    }

    // Fetch the uploaded files from the server
    fetch('http://127.0.0.1:5000/files')
        .then(response => response.json())
        .then(data => {
            displayLessons(data.files);
        })
        .catch(error => {
            console.error('Error fetching lessons:', error);
        });

    // Show all files on button click
    viewAllFilesButton.addEventListener('click', () => {
        fetch('http://127.0.0.1:5000/files')
            .then(response => response.json())
            .then(data => {
                displayAllFiles(data.files);
                modal.style.display = 'block'; // Show the modal
            })
            .catch(error => {
                console.error('Error fetching all files:', error);
            });
    });

    // Close the modal
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle file upload
    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        const formData = new FormData(uploadForm);

        fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('File uploaded successfully!');
                fetch('http://127.0.0.1:5000/files') // Refresh the file list
                    .then(response => response.json())
                    .then(data => {
                        displayLessons(data.files);
                    });
            } else {
                alert('File upload failed.');
            }
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    });
});

// Function to filter files by title
function filterFiles() {
    const searchValue = document.getElementById('fileSearch').value.toLowerCase();
    const items = document.querySelectorAll('#fileList .file-item');

    items.forEach(item => {
        const title = item.textContent.toLowerCase();
        item.style.display = title.includes(searchValue) ? 'block' : 'none';
    });
}

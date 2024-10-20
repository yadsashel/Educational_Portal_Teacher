from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from config import get_db_connection
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'static/uploads/'

# Ensure upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Route for serving CSS files (not necessary if you use url_for)
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('Css', filename)

# Route for the home page
@app.route('/')
def home():
    return render_template('student_view.html')

# Route for uploading files
@app.route('/upload', methods=['GET', 'POST'])
def teacher_upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file part'})

        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'message': 'No selected file'})

        if file:
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)
            store_file_in_db(file.filename)  # Store file in the database
            return jsonify({'success': True, 'message': 'File uploaded successfully'})

    return render_template('teacher_upload.html')

# Route to fetch uploaded files
@app.route('/files')
def get_files():
    files = fetch_all_files()  # Fetch from database
    return jsonify({'files': files})

# Route for about page
@app.route('/about')
def about():
    return render_template('About.html')

# Route for contact page
@app.route('/contact')
def contact():
    return render_template('contact.html')

# Function to store file information in the database
def store_file_in_db(file_name):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO files (file_name) VALUES (%s)", (file_name,))
    conn.commit()
    cursor.close()
    conn.close()

# Function to fetch all files from the database
def fetch_all_files():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM files")
    files = cursor.fetchall()
    cursor.close()
    conn.close()
    return files

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
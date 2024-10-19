import mysql.connector

def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="2002@Yad",
        database="educational_portal"
    )
    return conn
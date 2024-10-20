import os
import mysql.connector

def get_db_connection():
    conn = mysql.connector.connect(
        host=os.getenv('sql3.freesqldatabase.com'),
        user=os.getenv('sql3739350'),
        password=os.getenv('zNb95jSusT'),
        database=os.getenv('sql3739350')
    )
    return conn
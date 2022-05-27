import mysql.connector

class ConnectDB:
    def __init__(self, user, password):
        self.config = {
            'user': user,
            'password': password,
            'host': 'localhost',
            'database': 'broken_bike'
        }
        self.conn = mysql.connector.connect(**self.config)
        self.cursor = self.conn.cursor()

    def execute(self, query, data=None):
        if data is None:
            self.cursor.execute(query)
        else:
            self.cursor.execute(query, data)

    def fetchall(self):
        return self.cursor.fetchall()

    def fetchone(self):
        return self.cursor.fetchone()

    def commit(self):
        self.conn.commit()

    def close(self):
        self.cursor.close()
        self.conn.close()
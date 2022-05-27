from datetime import datetime


class Bikes:
    def __init__(self, db) -> None:
        self.db = db

    def get_bikes(self):
        try:
            self.db.cursor.execute("SELECT * FROM bikes")
            return self.db.cursor.fetchall()
        except Exception as e:
            print(str(e))
            return None

    def add_broken_bike(self, bike_id: int, priority: str, reason: str, description: str) -> None:
        date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            self.db.cursor.execute("INSERT INTO bikes (id_bike, priority, reason, description, created_at) VALUES (%s, %s, %s, %s, %s)", (
                bike_id, priority, reason, description, date))
            self.db.conn.commit()
            return True
        except Exception as e:
            print(str(e))
            return None

    def remove_bike(self, bike_id: int):
        try:
            self.db.cursor.execute(
                "DELETE FROM bikes WHERE id = %s", (str(bike_id),))
            self.db.conn.commit()
            return True
        except Exception as e:
            print(str(e))
            return None


class User:
    def __init__(self, db) -> None:
        self.db = db

    def connect(self, username, password):
        try:
            self.db.cursor.execute(
                "SELECT * FROM admin WHERE email = %s AND password = %s", (username, password))
            self.db.fetchone()
            if self.db.cursor.rowcount == 1:
                return True
            else:
                return False
        except Exception as e:
            print(str(e))
            return None

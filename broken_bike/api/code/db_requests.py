from datetime import datetime


class Bikes:
    def __init__(self, db) -> None:
        self.db = db

    def get_bikes(self):
        try:
            return self.db.execute("SELECT * FROM bikes")
        except Exception as e:
            print(str(e))
            return None

    def add_broken_bike(self, bike_id: int, priority: str, reason: str, description: str) -> None:
        date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            self.db.execute(f"INSERT INTO bikes (id_bike, priority, reason, description, created_at) VALUES ({bike_id}, '{priority}', '{reason}', '{description}', '{date}')")
            return True
        except Exception as e:
            print(str(e))
            return None

    def remove_bike(self, bike_id: int):
        try:
            self.db.execute(f"DELETE FROM bikes WHERE id = '{bike_id}'")
            return True
        except Exception as e:
            print(str(e))
            return None


class User:
    def __init__(self, db) -> None:
        self.db = db

    def connect(self, username, password):
        try:
            result = self.db.execute(f"SELECT * FROM admin WHERE email = '{username}' AND password = '{password}'")
            if len(result) > 0:
                return True
            else:
                return False
        except Exception as e:
            print(str(e))
            return None

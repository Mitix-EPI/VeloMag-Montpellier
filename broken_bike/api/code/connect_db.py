import pymysql
import sys
import logging

class ConnectDB:
    def __init__(self, user, password):
        self.host = 'db'
        self.username = user
        self.password = password
        self.port = 3306
        self.dbname = 'broken_bike'
        self.conn = None
        
    def open_connection(self):
        """Connect to MySQL Database."""
        try:
            if self.conn is None:
                self.conn = pymysql.connect(host=self.host,
                                            user=self.username,
                                            password=self.password,
                                            database=self.dbname)
        except pymysql.MySQLError as e:
            logging.error(e)
            sys.exit()
        finally:
            logging.info('Connection opened successfully.')

    def execute(self, query, data=None):
        """Execute SQL query."""
        try:
            self.open_connection()
            with self.conn.cursor() as cur:
                if 'SELECT' in query:
                    if data is None:
                        cur.execute(query)
                    else:
                        cur.execute(query, data)
                    result = cur.fetchall()
                    cur.close()
                    return result
                else:
                    if data is None:
                        result = cur.execute(query)
                    else:
                        result = cur.execute(query, data)
                    self.conn.commit()
                    affected = f"{cur.rowcount} rows affected."
                    cur.close()
                    return affected
        except pymysql.MySQLError as e:
            print(str(e))
        finally:
            if self.conn:
                self.conn.close()
                self.conn = None
                logging.info('Database connection closed.')

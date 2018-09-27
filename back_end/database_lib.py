import psycopg2


class Database_object():

    debug_mode = 1

    database_name = "postgres"
    host_addr = "localhost"
    host_port = 5432
    user_name = "postgres"
    passwd = "postgres"

    __database_connect = None
    __cur = None

    database_status = "Close"

    def __init__(self, conf = dict()):
        if conf.get("dbname") is not None:
            self.database_name = conf["dbname"]
        if conf.get("host") is not None:
            self.host_addr = conf["host"]
        if conf.get("port") is not None:
            self.host_port = conf["port"]
        if conf.get("user") is not None:
            self.user_name = conf["user"]
        if conf.get("passwd") is not None:
            self.passwd = conf["passwd"]
        self.__debug("dbname: {}, host: {}, port: {}, user: {}, passwd: {}.".format(self.database_name, self.host_addr, self.host_port, self.user_name, self.passwd))
        self.__debug("Connection setup is complete.")

    def open(self):
        try:
            self.__database_connect = psycopg2.connect(database=self.database_name, host=self.host_addr, port=self.host_port, user=self.user_name, password=self.passwd)
            self.__cur = self.__database_connect.cursor()
            self.database_status = "Open"
            self.__debug("Database opened successfully.")
        except psycopg2.OperationalError:
            self.__debug("Database opened failed.")

    def search(self, sql):
        assert type(sql) == str
        assert self.database_status == "Open"
        try:
            self.__cur.execute(sql)
            return self.__cur.fetchall()
        except psycopg2.ProgrammingError:
            self.__rollback()
            self.__debug("Wrong SQL.")
            return -1 

    def update(self, sql):
        assert type(sql) == str
        assert self.database_status == "Open"
        try:
            self.__cur.execute(sql)
            self.__save()
            self.__debug("Update successfully.")
        except psycopg2.ProgrammingError:
            self.__rollback()
            self.__debug("Update failed.")

    def __rollback(self):
        assert self.database_status == "Open"
        self.__database_connect.rollback()

    def __save(self):
        assert self.database_status == "Open"
        self.__database_connect.commit()
        self.__debug("Changes commited successfully.")

    def close(self):
        assert self.database_status == "Open"
        self.__cur.close()
        self.__database_connect.close()
        self.database_status == "Close"
        self.__debug("Database closed successfully.")

    def set_debug(self, mode):
        self.debug_mode = mode

    def __debug(self, message):
        if self.debug_mode == 1:
            print("***"+str(message)+"***")


if __name__ == "__main__":
    database = Database_object({"dbname": "comp9900"})
    database.open()
    database.close()
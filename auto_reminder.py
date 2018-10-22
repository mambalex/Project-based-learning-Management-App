import email_service
import database as db
import threading
import time


def create_new_reminder(project_uuid, ass_uuid, message, submit_check):
    # TODO:Uncomment below to enable email reminder
    # es = email_service.Email_Reminder(project_uuid, ass_uuid, message, submit_check)
    # es.run()
    return_list = db.create_reminder(email=g.user.user_id, project_uuid=project_uuid, ass_uuid=ass_uuid,
                                     message=message, submit_check=submit_check)


class Auto_Reminder_Service(threading.Thread):
    # time interval , second
    time_delay = 3600

    def __init__(self):
        pass

    def __check_deadline(self):
        while True:
            all_project = db.get_project_list()
            for project in all_project:
                phase_list = db.get_project_all_phases(project["project_uuid"])
                for phase in phase_list:
                    task_list = db.get_phase_all_tasks(phase["phase_uuid"])
                    for task in task_list:
                        msg = "Task {} is due soon, you haven't submit it.".format(task["task_name"])
                        deadline_timestamp = time.mktime(time.strptime(task["deadline"],"%Y-%m-%d %H:%M:%S"))
                        if self.time_delay*23 < deadline_timestamp - time.time() <= self.time_delay*24:
                            create_new_reminder(project["project_uuid"], task["task_uuid"], msg, 'yes')
            time.sleep(self.time_delay)

    def run(self):
        self.__check_deadline()


if __name__ == '__main__':
    ar = Auto_Reminder_Service()
    ar.run()

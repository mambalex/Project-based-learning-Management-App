import smtplib
import email.mime.multipart
import email.mime.text

import re

import threading

import database as db

class Email_Service(threading.Thread):
    email_host = 'smtp.gmail.com'
    email_port = 465
    email_user = 'jasoad070@gmail.com'
    email_receiver = None
    email_password = '9323apps'
    msg = None

    def __init__(self):
        pass

    def set_mail(self, receiver, subject, msg):
        self.msg = email.mime.multipart.MIMEMultipart()
        self.msg['from'] = self.email_user
        self.msg['to'] = receiver
        self.email_receiver = receiver
        self.msg['subject'] = subject
        self.msg.attach(email.mime.text.MIMEText(msg))

    def __send(self):
        smtp = smtplib.SMTP_SSL()
        smtp.connect(self.email_host, self.email_port)
        smtp.ehlo()
        smtp.login(self.email_user, self.email_password)
        smtp.sendmail(self.email_user, self.email_receiver, self.msg.as_string())
        smtp.quit()

    def run(self):
        self.__send()

class Email_Reminder(threading.Thread):
    project_uuid = None
    project_info = None
    ass_uuid = None
    message = None
    submit_check = None

    def __init__(self, project_uuid, ass_uuid, message, submit_check):
        self.project_uuid = project_uuid
        self.ass_uuid = ass_uuid
        self.message = message
        self.submit_check = submit_check
        self.project_info = db.get_projects(self.project_uuid)[0]

    def run(self):
        if self.submit_check.lower() == 'yes':
            group_list = db.get_all_group(self.project_uuid)
            group_id_list = [item['group_uuid'] for item in group_list]
            group_dict = {item['group_uuid']: item for item in group_list}
            submission = db.get_submits(self.ass_uuid)
            submission = [item['group_uuid'] for item in submission]
            unsubmit_group = [item for item in group_id_list if item not in submission]
            for group_id in unsubmit_group:
                for student in group_dict[group_id]["member"]:
                    es = Email_Service()
                    es.set_mail(student['email'], '{} Email Service'.format(self.project_info["project_name"]),
                                self.message)
                    es.run()
        else:
            if re.search(r'#mark#', self.message):
                group_list = db.get_all_group(self.project_uuid)
                for group in group_list:
                    submission = db.get_self_submit(group["group_uuid"], self.ass_uuid)
                    if len(submission) == 0:
                        return
                    submission = submission[0]
                    msg = re.sub(r'#mark#', submission["mark"], self.message)
                    for student in group["member"]:
                        es = Email_Service()
                        es.set_mail(student['email'], '{} Email Service'.format(self.project_info["project_name"]),
                                    self.message)
                        es.run()
            else:
                all_student = db.get_project_student_list(self.project_uuid)
                for student in all_student:
                    es = Email_Service()
                    es.set_mail(student['email'], '{} Email Service'.format(self.project_info["project_name"]), self.message)
                    es.run()
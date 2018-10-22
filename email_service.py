import smtplib
import email.mime.multipart
import email.mime.text

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
    ass_uuid = None
    message = None
    submit_check = None

    def __init__(self, project_uuid, ass_uuid, message, submit_check):
        self.project_uuid = project_uuid
        self.ass_uuid = ass_uuid
        self.message = message
        self.submit_check = submit_check

    def run(self):
        if self.submit_check():
            pass
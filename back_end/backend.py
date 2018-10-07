import os
import re
import json
import time
import base64
import database as db
# from back_end import database as db

from flask import Flask, g, jsonify, make_response, request, abort, url_for, render_template, send_from_directory
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth
# from flask_sqlalchemy import SQLAlchemy
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired
from passlib.apps import custom_app_context
from werkzeug.utils import secure_filename

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))

UPLOAD_FOLDER = 'temp'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

CORS(app, resources=r'/*')
app.config['SECRET_KEY'] = 'hard to guess string'
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_RECORD_QUERIES'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
                                        os.path.join(basedir, 'data.sqlite')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.jinja_env.variable_start_string = '%%'
app.jinja_env.variable_end_string = '%%'

auth = HTTPBasicAuth()
CSRF_ENABLED = True
app.debug = True


# -------------------------- start classes ---------------------
# --------------------------- user model -----------------------
class User:
    user_id = None
    password = None
    name = None
    gender = None
    dob = None
    photo = None
    user_type = None

    def __init__(self, user_profile=None):
        if user_profile is not None:
            self.load_from_dict(user_profile)
            self.load_passwd()

    def load_from_dict(self, user_profile):
        self.user_id = user_profile["email"]
        self.__password = self.hash_password(
            user_profile.get("passwd", "None"))
        self.name = user_profile.get("name", self.user_id)
        self.gender = user_profile.get("gender", "None")
        self.dob = user_profile.get('dob', "None")
        self.photo = user_profile.get("photo", "None")
        self.user_type = user_profile.get("user_type", 'student')

    def load_from_db(self, user_id):
        self.user_id = user_id
        user_profile = db.get_user(self.user_id)[0]
        self.__init__(user_profile)

    def load_passwd(self):
        self.hash_password(db.get_user_passwd(self.user_id))

    def hash_password(self, password):
        self.password = custom_app_context.encrypt(password)

    def verify_password(self, password):
        return custom_app_context.verify(password, self.password)

    def is_admin_user(self):
        return (self.user_type == 'lecturer' or self.user_type == 'mentor')

    def get_user_profile(self):
        user_profile = dict()
        user_profile["email"] = self.user_id
        user_profile["dob"] = self.dob
        user_profile["gender"] = self.gender
        user_profile["name"] = self.name
        return user_profile

    def generate_auth_token(self, expiration=600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.user_id, 'user_type': self.user_type})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None  # valid token, but expired
        except BadSignature:
            return None  # invalid token
        user = User(db.get_user(data['id'])[0])
        return user


# -------------------------------------user model end --------------------------------

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/lecturer')
def lecturer():
    return render_template('lecturer.html')


@app.route('/student')
# @auth.login_required
def student():
    return render_template('student.html')


@app.route('/profile')
def profile():
    return render_template('profile.html')


@auth.verify_password
def verify_password(name_or_token, password):
    if not name_or_token:
        return False
    name_or_token = re.sub(r'^"|"$', '', name_or_token)
    user = User.verify_auth_token(name_or_token)
    if user is None:
        if not db.check_user_id(name_or_token):
            user = User(db.get_user(name_or_token)[0])
        else:
            return False
        if not user.verify_password(password):
            return False
    g.user = user
    return True


# test api
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify([{'id': 'test1', 'name': 'test1'}, {'id': 'test2', 'name': 'test2'}])


@app.route('/api/test2', methods=['GET'])
@auth.login_required
def test2():
    return "Ture"


@app.route('/test/upload')
def upload_test():
    return render_template('upload.html')


# end test api

# create user
@app.route('/api/create_user', methods=['POST'])
def new_user():
    user_id = request.form.get('email', type=str, default=None)
    passwd = request.form.get('passwd', type=str, default=None)
    user_type = request.form.get('user_type', type=str)
    print(user_id, passwd, user_type)
    if user_id is None or passwd is None:
        return jsonify({'code': 400, 'msg': 'Email and password are needed'})
    if not db.check_user_id(user_id):
        return jsonify({'code': 400, 'msg': 'User already exists'})
    user_profile = {'email': user_id, 'passwd': passwd, 'user_type': user_type}
    db.create_user(user_profile)
    user = User()
    user.load_from_db(user_id)
    token = user.generate_auth_token()
    return jsonify(
        {'code': 201, 'msg': "Create admin success", 'user_id': user.user_id, 'user_type': user.user_type,
         'token': token.decode('ascii')})


# login
@app.route('/api/login', methods=['POST'])
def get_auth_token():
    name_or_token = request.form.get('email', type=str, default=None)
    passwd = request.form.get('passwd', type=str, default=None)
    if name_or_token is None:
        return jsonify({'code': 400, 'msg': 'Invalid email'})
    if passwd is None:
        return jsonify({'code': 400, 'msg': 'Invalid password'})
    name_or_token = re.sub(r'^"|"$', '', name_or_token)
    user = User.verify_auth_token(name_or_token)
    if user is None:
        if not db.check_user_id(name_or_token):
            user = User(db.get_user(name_or_token)[0])
        else:
            return jsonify({'code': 400, 'msg': 'No such user'})
        if not user.verify_password(passwd):
            return jsonify({'code': 400, 'msg': 'Wrong password'})
    g.user = user
    token = g.user.generate_auth_token()
    if g.user.is_admin_user():
        return jsonify({'code': 200, 'token': token.decode('ascii'), 'user_type': 'lecturer'})
    else:
        return jsonify({'code': 200, 'token': token.decode('ascii'), 'user_type': 'student'})


# change user setting part
@app.route('/api/change_passwd', methods=['POST'])
@auth.login_required
def change_passwd():
    new_passwd = request.form.get('new_passwd', type=str)
    db.change_user_passwd(email=g.user.user_id, new_passwd=new_passwd)
    return jsonify({'code': 200, 'msg': 'Change success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


@app.route('/api/change_name', methods=["POST"])
@auth.login_required
def change_name():
    new_name = request.form.get('new_name', type=str)
    db.change_user_name(email=g.user.user_id, new_name=new_name)
    return jsonify({'code': 200, 'msg': 'Change success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


@app.route('/api/change_photo', methods=['POST'])
@auth.login_required
def change_photo():
    new_photo = request.form.get('new_photo', type=str)
    db.change_user_photo(email=g.user.user_id, new_photo=new_photo)
    return jsonify({'code': 200, 'msg': 'Change success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


@app.route('/api/change_gender', methods=['POST'])
@auth.login_required
def change_gender():
    new_gender = request.form.get('new_gender', type=str)
    db.change_user_gender(g.user.user_id, new_gender)
    return jsonify({'code': 200, 'msg': 'Change success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


@app.route('/api/change_user_type', methods=['POST'])
@auth.login_required
def change_user_type():
    new_type = request.form.get('new_type', type=int)
    user_id = request.form.get('user_id', type=str)
    if g.user.user_type == 'lecturer':
        db.change_user_type(email=user_id, new_type=new_type)
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    return jsonify({'code': 200, 'msg': 'Change success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# get student list
@app.route('/api/get_student_list', methods=['POST'])
@auth.login_required
def get_student_list():
    project_uuid = request.form.get('project_uuid', type=str)
    student_list = db.get_project_student_list(project_uuid)
    return jsonify(
        {'code': 200, 'msg': 'Get student list success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
         'data': student_list})


# get student timeline
@app.route('/api/get_student_timeline', methods=['POST'])
@auth.login_required
def get_student_timeline():
    project_uuid = request.form.get('project_uuid', type=str)
    if not g.user.is_admin_user():
        if db.check_has_group(g.user.user_id, project_uuid):
            group_uuid = request.form.get('group_uuid', type=str)
            timeline = db.get_student_timeline(g.user.user_id, group_uuid)
            return jsonify({'code': 200, 'msg': 'Get timeline success', 'data': timeline})
        else:
            return jsonify({'code': 400, 'msg': 'You have not join a group', 'user_id': g.user.user_id,
                            'user_type': g.user.user_type})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Get self profile
@app.route('/api/get_user_profile', methods=['POST'])
@auth.login_required
def get_user_profile():
    return jsonify(
        {'code': 200, 'msg': 'Get user profile success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
         'data': g.user.get_user_profile()})


# Change self profile
@app.route('/api/change_user_profile', methods=['POST'])
@auth.login_required
def change_user_profile():
    name = request.form.get('name', type=str)
    dob = request.form.get('dob', type=str)
    gender = request.form.get('gender', type=str)
    passwd = request.form.get('passwd', type=str)
    db.change_user_name(g.user.user_id, name)
    db.change_user_dob(g.user.user_id, dob)
    db.change_user_gender(g.user.user_id, gender)
    db.change_user_passwd(g.user.user_id, passwd)
    return jsonify(
        {'code': 200, 'msg': 'Change user profile success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Group part

# create a group
@app.route('/api/create_group', methods=['POST'])
@auth.login_required
def create_group():
    group_name = request.json.get('group_name')
    project_uuid = request.json.get('project_uuid')
    group_description = request.json.get('note')
    if project_uuid is None:
        return jsonify({'code': 400, 'msg': 'Bad Request', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    group_uuid = db.create_group(group_name, project_uuid, group_description)
    db.create_group_relation(g.user.user_id, group_uuid, 0)
    return jsonify({'code': 200, 'msg': 'Create success', 'user_id': g.user.user_id, 'group_uuid': group_uuid,
                    'user_type': g.user.user_type})


# get group list
@app.route('/api/get_group_list', methods=['POST'])
@auth.login_required
def get_group_list():
    project_uuid = request.json.get('project_uuid')
    return jsonify(
        {'code': 200, 'msg': 'Get group list success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
         'data': db.get_all_group(project_uuid)})


# join a group
@app.route('/api/join_group', methods=['POST'])
@auth.login_required
def join_group():
    group_uuid = request.json.get('group_uuid')
    project_uuid = request.json.get('project_uuid')
    if db.check_has_group(g.user.user_id, project_uuid):
        return jsonify(
            {'code': 400, 'msg': 'Already in a group', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        db.create_group_relation(g.user.user_id, group_uuid)
        return jsonify(
            {'code': 200, 'msg': 'Join group success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# leave a group
@app.route('/api/leave_group', methods=['POST'])
@auth.login_required
def leave_group():
    group_uuid = request.json.get('group_uuid')
    if g.user.is_admin_user():
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        db.leave_group(g.user.user_id, group_uuid)
        return jsonify(
            {'code': 200, 'msg': 'Leave group success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# get group member list
@app.route('/api/get_member_list', methods=['POST'])
@auth.login_required
def get_member_list():
    group_uuid = request.form.get('group_uuid', type=str)
    member_list = db.get_group_member(group_uuid)
    return jsonify(
        {'code': 200, 'msg': 'Get member list success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
         'data': member_list})


# get current group
@app.route('/api/current_group', methods=['POST'])
@auth.login_required
def get_current_group():
    project_uuid = request.json.get('project_uuid')
    print(project_uuid)
    if g.user.is_admin_user():
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        if db.check_has_group(g.user.user_id, project_uuid):
            current_group = db.get_self_group(g.user.user_id, project_uuid)[0]
            group_member = db.get_group_member(current_group["group_uuid"])
            current_group["member"] = group_member
            return jsonify(
                {'code': 200, 'msg': 'Get self group success', 'user_id': g.user.user_id,
                 'user_type': g.user.user_type, 'data': current_group})
        else:
            return jsonify(
                {'code': 400, 'msg': 'You have not join a group', 'user_id': g.user.user_id,
                 'user_type': g.user.user_type})


# Project part

# create a project
@app.route('/api/create_project', methods=['POST'])
@auth.login_required
def create_project():
    project_master = g.user.user_id
    project_name = request.form.get('project_name', type=str)
    project_deadline = request.form.get('project_deadline', type=str)
    project_markrelease = request.form.get('project_markrelease', type=str, default=None)
    project_addr = request.form.get('project_addr', type=str, default='None')
    if g.user.is_admin_user():
        project_uuid = db.create_projects(project_master, project_name, project_deadline, project_markrelease,
                                          project_addr)
        db.enrol_project(project_master, project_uuid, 'master')
        return jsonify(
            {'code': 200, 'msg': 'Create project success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# get project list
@app.route('/api/get_project_list', methods=['POST'])
@auth.login_required
def get_project_list():
    return jsonify({'code': 200, 'msg': 'Get project list success', 'data': db.get_project_list()})


# enrol in a project
@app.route('/api/enrol_project', methods=['POST'])
@auth.login_required
def enrol_project():
    project_uuid = request.form.get('project_uuid', type=str)
    user_type = request.form.get('user_type', type=str, default='student')
    db.enrol_project(g.user.user_id, project_uuid, user_type)
    return jsonify(
        {'code': 200, 'msg': 'enrol in project success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# get self project_list
@app.route('/api/get_self_project_list', methods=['POST'])
@auth.login_required
def get_self_project_list():
    return jsonify(
        {'code': 200, 'msg': 'Get self project list success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
         'data': db.get_self_project_list(g.user.user_id)})


# Reminder part

# lecturer and mentor get reminder list
@app.route('/api/admin_get_reminder_list', methods=["POST"])
@auth.login_required
def admin_get_reminder_list():
    project_uuid = request.form.get('project_uuid', type=str)
    if g.user.is_admin_user():
        reminder_list = db.admin_get_self_reminder(g.user.user_type, project_uuid)
        return jsonify(
            {'code': 200, 'msg': 'Get reminder list success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
             'data': reminder_list})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# post a new reminder
@app.route('/api/create_new_reminder', methods=["POST"])
@auth.login_required
def create_new_reminder():
    project_uuid = request.form.get('project_uuid', type=str)
    ass_uuid = request.form.get('ass_uuid', type=str, default=project_uuid)
    message = request.form.get('message', type=str)
    submit_check = request.form.get('submit_check', type=str, default="no")
    if g.user.is_admin_user():
        reminder_uuid = db.create_reminder(email=g.user.user_id, project_uuid=project_uuid, ass_uuid=ass_uuid,
                                           message=message, submit_check=submit_check)
        return jsonify(
            {'code': 200, 'msg': 'Create reminder success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
             'reminder_uuid': reminder_uuid})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# delete a reminder
@app.route('/api/delete_reminder', methods=['POST'])
@auth.login_required
def delete_reminder():
    reminder_uuid = request.form.get('reminder_uuid', type=str)
    if g.user.is_admin_user():
        db.delete_reminder(reminder_uuid)
        return jsonify(
            {'code': 200, 'msg': 'Delete reminder success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# change reminder part
@app.route('/api/change_reminder_ass_uuid', methods=['POST'])
@auth.login_required
def change_reminder_ass():
    reminder_uuid = request.form.get('reminder_uuid', type=str)
    ass_uuid = request.form.get('ass_uuid', type=str)
    if g.user.is_admin_user():
        db.change_reminder_ass(reminder_uuid, ass_uuid)
        return jsonify(
            {'code': 200, 'msg': 'Change reminder success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


@app.route('/api/change_reminder_message', methods=['POST'])
@auth.login_required
def change_reminder_message():
    reminder_uuid = request.form.get('reminder_uuid', type=str)
    message = request.form.get('message', type=str)
    if g.user.is_admin_user():
        db.change_reminder_message(reminder_uuid, message)
        return jsonify(
            {'code': 200, 'msg': 'Change reminder success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


@app.route('/api/change_reminder_submit_check', methods=['POST'])
@auth.login_required
def change_reminder_submit_check():
    reminder_uuid = request.form.get('reminder_uuid', type=str)
    submit_check = request.form.get('submit_check', type=str)
    if g.user.is_admin_user():
        db.change_reminder_submit_check(reminder_uuid, submit_check)
        return jsonify(
            {'code': 200, 'msg': 'Change reminder success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


@app.route('/api/student_get_reminder_list', methods=['POST'])
@auth.login_required
def student_get_reminder_list():
    project_uuid = request.form.get('project_uuid', type=str)
    if g.user.is_admin_user():
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        global_reminder_list = db.student_get_self_global_reminder(project_uuid)
        unsubmit_reminder_list = db.student_get_self_unsubmit_reminder(g.user.user_id, project_uuid)
        reminder_list = global_reminder_list + unsubmit_reminder_list
        return jsonify(
            {'code': 200, 'msg': 'Get reminder list success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
             'data': reminder_list})


# Addition documents

@app.route('/api/create_addition_resource', methods=['POST'])
@auth.login_required
def create_addition_resource():
    project_uuid = request.form.get('project_uuid', type=str)
    description = request.form.get('description', type=str, default="None")
    file_addr = request.form.get('file_address', type=str, default="None")
    if g.user.is_admin_user():
        db.add_addition_resource(g.user.user_id, project_uuid, description, file_addr)
        return jsonify(
            {'code': 200, 'msg': 'Upload resource success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


@app.route('/api/delete_addition_resource', methods=['POST'])
@auth.login_required
def delete_addition_resource():
    resource_uuid = request.form.get('resource_uuid', type=str)
    if g.user.is_admin_user():
        db.delete_addition_resource(resource_uuid)
        return jsonify(
            {'code': 200, 'msg': 'Delete resource success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


@app.route('/api/get_upload_resource_list', methods=['POST'])
@auth.login_required
def get_upload_resource_list():
    project_uuid = request.form.get('project_uuid', type=str)
    if g.user.is_admin_user():
        resource_list = db.get_upload_file_list(g.user.user_id, project_uuid)
        return jsonify(
            {'code': 200, 'msg': 'Get upload resource list success', 'user_id': g.user.user_id,
             'user_type': g.user.user_type, 'data': resource_list})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


@app.route('/api/student_resource_list', methods=['POST'])
@auth.login_required
def student_resource_list():
    project_uuid = request.form.get('project_uuid', type=str)
    if g.user.is_admin_user():
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        resource_list = db.get_resource_list(project_uuid)
        return jsonify(
            {'code': 200, 'msg': 'Get resource list success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
             'data': resource_list})


# Start upload and download file part

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Upload file part
# Lecture upload resource api
@app.route('/api/upload_resource', methods=['POST'], strict_slashes=False)
@auth.login_required
def api_upload():
    file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])
    project_uuid = request.form.get('project_uuid', type=str)
    phase_uuid = request.form.get('phase_uuid', type=str)
    description = request.form.get('description', type=str)
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)
    file_to_upload = request.files['upload_file']
    if file_to_upload and allowed_file(file_to_upload.filename):
        filename = secure_filename(file_to_upload.filename)
        ext = filename.rsplit('.', 1)[1].lower()
        unix_time = int(time.time())
        new_filename = str(unix_time) + '.' + ext
        file_address = os.path.join(file_dir, new_filename)
        file_to_upload.save(file_address)
        db.add_addition_resource(g.user.user_id, project_uuid, filename, phase_uuid, description, file_address)
        return jsonify({'code': 200, 'msg': 'Upload success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        return jsonify({'code': 400, 'msg': 'Upload fail', 'user_id': g.user.user_id, 'user_type': g.user.user_type})

# Student submit api
@app.route('/api/submit_file', methods=['POST'], strict_slashes=False)
@auth.login_required
def api_submit():
    file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])
    group_uuid = request.form.get('group_uuid', type=str)
    ass_uuid = request.form.get('assessment_uuid', type=str)
    print(group_uuid, ass_uuid)
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)
    file_to_upload = request.files['upload_file']
    if file_to_upload and allowed_file(file_to_upload.filename):
        filename = secure_filename(file_to_upload.filename)
        ext = filename.rsplit('.', 1)[1].lower()
        unix_time = int(time.time())
        new_filename = str(unix_time) + '.' + ext
        file_address = os.path.join(file_dir, new_filename)
        file_to_upload.save(file_address)
        if db.check_submits(group_uuid, ass_uuid):
            submit_rec = db.get_self_submit(group_uuid, ass_uuid)[0]
            db.re_submit(submit_rec['submit_uuid'], file_address)
        else:
            db.create_submits(group_uuid, ass_uuid, file_address)
        return jsonify({'code': 200, 'msg': 'Submit success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        return jsonify({'code': 400, 'msg': 'Submit fail', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Download file part
@app.route('/api/download', methods=['GET', 'POST'])
@auth.login_required
def download():
    filename = request.form.get('filename', type=str)
    if os.path.isfile(os.path.join('temp', filename)):
        return send_from_directory('temp', filename, as_attachment=True)
    abort(404)


# Start phase part
@app.route('/api/student_main_info', methods=['POST'])
@auth.login_required
def student_load_main_info():
    project_uuid = request.json.get('project_uuid')
    phase_uuid = request.json.get('phase_uuid')
    # Group part
    group_info = dict()
    if db.check_has_group(g.user.user_id, project_uuid):
        current_group = db.get_self_group(g.user.user_id, project_uuid)[0]
        group_member = db.get_group_member(current_group["group_uuid"])
        current_group["member"] = group_member
        group_info = current_group
        group_info['status'] = 1
        group_info['msg'] = 'Current join a group'
    else:
        group_info['status'] = 0
        group_info['msg'] = 'Current do not join a group'
    # Group list
    group_list = db.get_all_group(project_uuid)
    # Resource part
    resource_list = db.get_resource_list(project_uuid, phase_uuid)
    # Phase part
    phase_info = db.get_phases(phase_uuid)
    # Task part
    task_list = db.get_phase_all_tasks(phase_uuid)
    return jsonify({'code': 200, 'msg': 'Get data success', 'group_info': group_info, 'group_list': group_list,
                    'phase_info': phase_info, 'task_list': task_list, 'resource_list': resource_list})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

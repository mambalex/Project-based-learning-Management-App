import os
import re
import time
import random
import database as db
from chatbot import chatbot

from flask import Flask, g, jsonify, make_response, request, abort, render_template, send_from_directory
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired
from passlib.apps import custom_app_context
from werkzeug.utils import secure_filename

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))

UPLOAD_FOLDER = 'temp'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


CORS(app, resources=r'/*')
app.config['SECRET_KEY'] = 'sUL2cGYDV3tGD6kLwcaHInlpmoYt4xzRYfjjKje+2SZna1aHBA9clKI1gMpxjVxT\
                            839ueFFqmxnPqYvkV1ARCFPhnDznI5XGJs0H12csnUbD0YEVsNChUihVv8I9XSDy\
                            MTvlBJfO/VCMlctcJ7EC71R26jMIevE5UH0vMVlln1lUVQQCoNThaw4bC8aZv4vi\
                            ehz4I0RFNpc/obNoUnU2NS6KtUJ7flCH9oXL2Sab/qRL1yHpeDWMBkJu4BBVHbfR\
                            EEXGVYK0MTQ99veWR1/gzR7Cdp92hRH8yhZzuSYjOv8EtjXAz2RyGEqpchN5UYoP\
                            MS+mIol283WcOlsXLfJkdiQS3uiDuDRKpPnmYMTqZkGNz8ODGvom8C4aiOf2+bIK\
                            UbxUM5R7DYirVxizPYqp/BjLHkNIhOZw6GIbo1LxVw5Z2n30Y+YisnJM5oyMaNlx\
                            o87FPaVo1XBgkjp2FSjnrzBwmlgnOeY0f2cEForVK0g1cF9kDnYtmZ4bXqXYgOT5\
                            RtJ15MXphS9n6cCvirX2r5D8Dywl1kXdWsu4umozql8IWdM0oTOZA8ey4Kyx1a/h\
                            5W232wsN0eMcQf31uoBJ7PgARDJF8gptZPBNiSKDHYD0TcFYsfxAwFYO+BAxbheE\
                            TRwRwn5WLZuAAnciHEKqWhQhNOf3RNogmemfoXpf4K7cCzDpC9mUbjjbkbS/FVyy\
                            zGBJjmkNv9X6sJLBcz7RhwlxvFVCHPenxaCvLWqOnTFmxl+LTto7okgCY3A1z3Tz\
                            gBWOEK/Ky2Q8Zmcm36q87gMlYGfT0Po2a7zJpotIjBxbsqlVZ/tQDKt9+4sEA/VK\
                            EZv5VzzBePfdaheIg42jQPX7Gl9fgz+DdBKNlEMEYg4SaU7VprDKtJf72dHPQQhk\
                            4flnITlVbU7JrpmoQjidYcG7eoChg4BP8mTaNKceUNsO877dYJa9AzLMZ5tmu4Xa\
                            nfeuNXuXyevFeyPW/rQci0aBnLZ0ZFQ+jrKl1DSWqnaotrCDB6M9gE17gq+GClG7\
                            sAQ74k5PR7rwScWr+rt7w3c/uYP2pQslnOyq4qcjIQ03Hm54j6LsGljzsSgXdQgP\
                            Gkce5zUtbrM42R/gbXWozfMyZzkZLinmwa2JFukiqHwMHO/pWeseVr3aQ5+xiNIc\
                            /6GXqGsEWE5zWU1e7pspvhuKCPr4ZRzOyaPgrTA5HQkm2eiOEADXNKPJt5BscOtp\
                            xk+qbHmbTX0vVUdxbN7k5Xbp1j8jOE7mR4myrRIvklFO2CmuZiMSuBphm+nOA1HB\
                            y/9PfxaHlvXM1EaoPU7SzbLT/le4it2R77TToAnfrvmBpNM0C2UdgLSmomHpHYAJ\
                            kZ12kpfLo8RP3R9BqYjPAib4V+wskJ5ppyGLWucc0FbJlg/zh/0k/S2QN6ZyMs3t\
                            wXWbMAgHAsUo5azm6DmR0IkttkQ/HYN7Aa6bwO8w28tjo3olHa4gJfnT2S6Ng8W0\
                            01Bdk4zt1Cd9/GtRvORog+7UbWRKJaX3U0kusoIUO/5hs7ClwI6VD85qo6K5QWyo\
                            Vc12bV9CMYDi8YjrX2Z9tbvp4fYI5iKSIYYeuIu8haEbzFLqj2qsKn8PY+2f/6mg'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['CHATBOT_RIVE_FILE'] = 'chatbot/comp9323.rive'

app.jinja_env.variable_start_string = '%%'
app.jinja_env.variable_end_string = '%%'

auth = HTTPBasicAuth()
CSRF_ENABLED = True
app.debug = True


# -------------------------- start classes ---------------------
# --------------------------- user model -----------------------
class User:
    user_id = None
    __password = None
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
        self.hash_password(user_profile.get("passwd", "None"))
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
        self.__password = custom_app_context.encrypt(password)

    def verify_password(self, password):
        return custom_app_context.verify(password, self.__password)

    def is_admin_user(self):
        return self.user_type == 'lecturer' or self.user_type == 'mentor'

    def get_user_profile(self):
        user_profile = dict()
        user_profile["email"] = self.user_id
        user_profile["dob"] = self.dob
        user_profile["gender"] = self.gender
        user_profile["name"] = self.name
        return user_profile

    def generate_auth_token(self, expiration=6000):
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


@app.route('/create_project/<username>')
def new_project(username):
    return render_template('new-project.html')


@app.route('/lecturer/<username>')
def lecturer(username):
    return render_template('lecturer.html')


@app.route('/student/<username>')
def student(username):
    return render_template('student.html')


@app.route('/profile')
def profile():
    return render_template('profile.html')


@app.route('/temp/<string:filename>', methods=['GET'])
def get_file(filename):
    if filename is None:
        abort(400)
    else:
        file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])
        file_data = open(os.path.join(file_dir, filename), "rb").read()
        response = make_response(file_data)
        response.headers['Content-Type'] = 'application/pdf'
        return response


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


# Start test api

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


# Create user API
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


# Login API
@app.route('/api/login', methods=['POST'])
def get_auth_token():
    name = request.form.get('email', type=str, default=None)
    passwd = request.form.get('passwd', type=str, default=None)
    if name is None:
        return jsonify({'code': 400, 'msg': 'Invalid email'})
    if passwd is None:
        return jsonify({'code': 400, 'msg': 'Invalid password'})

    if not db.check_user_id(name):
        user = User(db.get_user(name)[0])
    else:
        return jsonify({'code': 400, 'msg': 'No such user'})
    if not user.verify_password(passwd):
        return jsonify({'code': 400, 'msg': 'Wrong password'})
    g.user = user
    token = g.user.generate_auth_token()

    if g.user.is_admin_user():
        self_project_list = db.lecturer_get_self_project_list(g.user.user_id)
        return jsonify(
            {'code': 200, 'token': token.decode('ascii'), 'user_type': 'lecturer', 'user_id': g.user.user_id,
             'self_project_list': self_project_list})
    else:
        self_project_list = db.get_self_project_list(g.user.user_id)
        all_project_list = db.get_project_list()
        return jsonify({'code': 200, 'token': token.decode('ascii'), 'user_type': 'student', 'user_id': g.user.user_id,
                        'self_project_list': self_project_list, 'all_project_list': all_project_list})


# Change user password
@app.route('/api/change_passwd', methods=['POST'])
@auth.login_required
def change_passwd():
    new_passwd = request.form.get('new_passwd', type=str)
    db.change_user_passwd(email=g.user.user_id, new_passwd=new_passwd)
    return jsonify({'code': 200, 'msg': 'Change success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Change user name
@app.route('/api/change_name', methods=["POST"])
@auth.login_required
def change_name():
    new_name = request.form.get('new_name', type=str)
    db.change_user_name(email=g.user.user_id, new_name=new_name)
    return jsonify({'code': 200, 'msg': 'Change success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Change user photo
@app.route('/api/change_photo', methods=['POST'])
@auth.login_required
def change_photo():
    new_photo = request.form.get('new_photo', type=str)
    db.change_user_photo(email=g.user.user_id, new_photo=new_photo)
    return jsonify({'code': 200, 'msg': 'Change success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Change user gender
@app.route('/api/change_gender', methods=['POST'])
@auth.login_required
def change_gender():
    new_gender = request.form.get('new_gender', type=str)
    db.change_user_gender(g.user.user_id, new_gender)
    return jsonify({'code': 200, 'msg': 'Change success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Change user type
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


# Get one project student list
@app.route('/api/get_student_list', methods=['POST'])
@auth.login_required
def get_student_list():
    project_uuid = request.form.get('project_uuid', type=str)
    student_list = db.get_project_student_list(project_uuid)
    return jsonify(
        {'code': 200, 'msg': 'Get student list success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
         'data': student_list})


# Get student timeline
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

# Create a group
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


# Get one project group list
@app.route('/api/get_group_list', methods=['POST'])
@auth.login_required
def get_group_list():
    project_uuid = request.json.get('project_uuid')
    return jsonify(
        {'code': 200, 'msg': 'Get group list success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
         'data': db.get_all_group(project_uuid)})


# Join a group
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


# Leave a group. For group leader, disband group
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


# Random group
@app.route('/api/random_group', methods=['POST'])
@auth.login_required
def random_group():
    project_uuid = request.json.get('project_uuid')
    group_size = request.json.get('group_size')
    default_group_size = 4

    print(project_uuid, group_size)
    if not g.user.is_admin_user():
        return jsonify({'code': 400, 'msg': 'Insufficient permissions'})

    db.clear_all_group(project_uuid)
    if group_size is None:
        group_size = default_group_size

    student_list = db.get_ungroup_student(project_uuid)
    random.shuffle(student_list)
    group_num = int(len(student_list) / int(group_size))
    group_list = dict()
    for i in range(group_num):
        temp_group = list()
        while len(temp_group) < default_group_size:
            temp_group.append(student_list.pop())
        group_list[i] = temp_group

    group_list_index = [i for i in group_list]
    random.shuffle(group_list_index)
    for student in student_list:
        group_list[group_list_index.pop()].append(student)
    db.random_group(project_uuid, group_list)

    return jsonify(
        {'code': 200, 'msg': 'Random group success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Group setting
@app.route('/api/change_group_method', methods=['POST'])
@auth.login_required
def change_group_method():
    update_data = request.json.get('update_data')
    print(update_data)

    return jsonify({'code': 200, 'msg': 'Random group success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Get group member list
@app.route('/api/get_member_list', methods=['POST'])
@auth.login_required
def get_member_list():
    group_uuid = request.form.get('group_uuid', type=str)
    member_list = db.get_group_member(group_uuid)
    return jsonify(
        {'code': 200, 'msg': 'Get member list success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
         'data': member_list})


# Get current group
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

# Create a project
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


# Get project list
@app.route('/api/get_project_list', methods=['POST'])
@auth.login_required
def get_project_list():
    return jsonify({'code': 200, 'msg': 'Get project list success', 'data': db.get_project_list()})


# Enrol in a project
@app.route('/api/enrol_project', methods=['POST'])
@auth.login_required
def enrol_project():
    project_uuid = request.json.get('project_uuid')
    if db.check_enrol(g.user.user_id, project_uuid):
        return jsonify({'code': 400, 'msg': 'Already enrol in this project', 'user_id': g.user.user_id,
                        'user_type': g.user.user_type})
    db.enrol_project(g.user.user_id, project_uuid, g.user.user_type)
    return jsonify(
        {'code': 200, 'msg': 'enrol in project success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Get self project_list
@app.route('/api/get_self_project_list', methods=['POST'])
@auth.login_required
def get_self_project_list():
    return jsonify(
        {'code': 200, 'msg': 'Get self project list success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
         'data': db.get_self_project_list(g.user.user_id)})


# Reminder part

# Lecturer and mentor get reminder list
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


# Post a new reminder
@app.route('/api/create_new_reminder', methods=["POST"])
@auth.login_required
def create_new_reminder():
    project_uuid = request.json.get('project_uuid')
    ass_uuid = request.json.get('ass_uuid')
    message = request.json.get('message')
    submit_check = request.json.get('submit_check')
    if g.user.is_admin_user():
        return_list = db.create_reminder(email=g.user.user_id, project_uuid=project_uuid, ass_uuid=ass_uuid,
                                         message=message, submit_check=submit_check)
        reminder_uuid = return_list[0]
        timestamp = return_list[1]
        return jsonify(
            {'code': 200, 'msg': 'Create reminder success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
             'reminder_uuid': reminder_uuid, 'timestamp': timestamp})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Delete a reminder
@app.route('/api/delete_reminder', methods=['POST'])
@auth.login_required
def delete_reminder():
    reminder_uuid = request.json.get('reminder_uuid')
    if g.user.is_admin_user():
        db.delete_reminder(reminder_uuid)
        return jsonify(
            {'code': 200, 'msg': 'Delete reminder success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Change reminder part

# Change reminder assessment id
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


# Change reminder message
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


# Change reminder submit check
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


# Student get reminder list
@app.route('/api/student_get_reminder_list', methods=['POST'])
@auth.login_required
def student_get_reminder_list():
    project_uuid = request.form.get('project_uuid', type=str)
    if g.user.is_admin_user():
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        global_reminder_list = db.student_get_self_global_reminder(project_uuid)
        # TODO: Finish automatic replace mark tags
        unsubmit_reminder_list = db.student_get_self_unsubmit_reminder(g.user.user_id, project_uuid)
        reminder_list = global_reminder_list + unsubmit_reminder_list
        reminder_list.sort(key=lambda reminder: reminder['post_time'], reverse=True)
        return jsonify(
            {'code': 200, 'msg': 'Get reminder list success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
             'data': reminder_list})


# Addition documents part

# Lecturer and mentor upload addition resource
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


# Lecturer and mentor delete uploaded resource
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


# Lecturer and mentor get uploaded resource list
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


# Student resource list
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


# Get project all phase
@app.route('/api/get_project_info', methods=['POST'])
@auth.login_required
def get_project_info():
    project_uuid = request.json.get('project_uuid')
    project_info = db.get_projects(project_uuid)
    if len(project_info) > 0:
        project_info = project_info[0]
        phase_list = db.get_project_all_phases(project_uuid)
        for phase in phase_list:
            task_list = db.get_phase_all_tasks(phase['phase_uuid'])
            phase['task_list'] = task_list
        project_info['phase_list'] = phase_list
        return jsonify(
            {'code': 400, 'msg': 'Get project success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
             'data': project_info})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Project not found', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Change assessment part
@app.route('/api/change_ass', methods=['POST'])
@auth.login_required
def change_ass():
    ass_uuid = request.json.get('ass_uuid')
    new_name = request.json.get('name')
    new_deadline = request.json.get('deadline')
    new_mark_release = request.json.get('mark_release')
    spec_address = request.json.get('spec_address')
    submit_require = request.json.get('submit_require')
    if ass_uuid is None:
        return jsonify({'code': 400, 'msg': 'Wrong request.', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    if g.user.is_admin_user():
        if db.is_phase(ass_uuid):
            if new_name is not None:
                db.change_phases_name(ass_uuid, new_name)
            if new_deadline is not None:
                db.change_phases_deadline(ass_uuid, new_deadline)
            if new_mark_release is not None:
                db.change_phases_mark_release(ass_uuid, new_mark_release)
            if spec_address is not None:
                db.change_phases_address(ass_uuid, spec_address)
            if submit_require is not None:
                db.change_phases_submit_require(ass_uuid, submit_require)
        else:
            if new_name is not None:
                db.change_tasks_name(ass_uuid, new_name)
            if new_deadline is not None:
                db.change_tasks_deadline(ass_uuid, new_deadline)
            if new_mark_release is not None:
                db.change_tasks_mark_release(ass_uuid, new_mark_release)
            if spec_address is not None:
                db.change_tasks_address(ass_uuid, spec_address)
            if submit_require is not None:
                db.change_tasks_submit_require(ass_uuid, submit_require)
        return jsonify({'code': 200, 'msg': 'Change success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Start upload and download file part


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


# Start Get main data part
# Student get main data
@app.route('/api/student_main_info', methods=['POST'])
@auth.login_required
def student_load_main_info():
    # User profile
    user_profile = g.user.get_user_profile()    
    # Get self all project data
    self_project_list = db.get_self_project_list(g.user.user_id)
    for project in self_project_list:
        # Group part
        temp_group_info = dict()
        if db.check_has_group(g.user.user_id, project["project_uuid"]):
            temp_current_group = db.get_self_group(g.user.user_id, project["project_uuid"])[0]
            temp_group_member = db.get_group_member(temp_current_group["group_uuid"])
            temp_current_group["member"] = temp_group_member
            temp_group_info = temp_current_group
            temp_group_info['status'] = 1
            temp_group_info['msg'] = 'Current join a group'
        else:
            temp_group_info['status'] = 0
            temp_group_info['msg'] = 'Current do not join a group'
        project['group_info'] = temp_group_info
        # Group list
        temp_group_list = db.get_all_group(project["project_uuid"])
        project['group_list'] = temp_group_list
        temp_ungroup_student = db.get_ungroup_student(project["project_uuid"])
        project['ungroup_student'] = temp_ungroup_student
        phase_list = db.get_project_all_phases(project["project_uuid"])
        for phase in phase_list:
            resource_list = db.get_resource_list(project["project_uuid"], phase['phase_uuid'])
            phase['resource_list'] = resource_list
            task_list = db.get_phase_all_tasks(phase['phase_uuid'])
            phase['task_list'] = task_list
            if temp_group_info['status'] == 0:
                mark_result = dict()
                mark_result['status'] = 'Ungroup'
                mark_result['mark'] = 0
            else:
                for task in task_list:
                    mark_result = dict()
                    submission = db.get_self_submit(temp_group_info["group_uuid"], task["task_uuid"])
                    if len(submission) == 0:
                        mark_result['status'] = 'Unsubmit'
                        mark_result['mark'] = 0
                    else:
                        submission = submission[0]
                        if submission["mark"] == "None":
                            mark_result['status'] = 'UnMarked'
                            mark_result['mark'] = 0
                        else:
                            mark_result['status'] = 'Marked'
                            mark_result['mark'] = int(submission["mark"])
                    task['mark_result'] = mark_result
        project['phase_list'] = phase_list
        # Current phase index
        current_phase = db.get_current_phase_index(project["project_uuid"])
        project['current_phase'] = current_phase
        # Reminder part
        temp_global_reminder_list = db.student_get_self_global_reminder(project["project_uuid"])
        temp_unsubmit_reminder_list = db.student_get_self_unsubmit_reminder(g.user.user_id, project["project_uuid"])
        temp_reminder_list = temp_global_reminder_list + temp_unsubmit_reminder_list
        temp_reminder_list.sort(key=lambda reminder: reminder['post_time'], reverse=True)
        project['reminder_list'] = temp_reminder_list
    all_project_list = db.get_project_list()

    return jsonify({'code': 200, 'msg': 'Get data success', 'user_profile': user_profile,
                    'self_project_list': self_project_list, 'all_project_list': all_project_list})


# Lecturer main info
@app.route('/api/lecturer_main_info', methods=['POST'])
@auth.login_required
def lecturer_load_main_info():
    # User profile
    user_profile = g.user.get_user_profile()
    # self all project data
    self_project_list = db.lecturer_get_self_project_list(g.user.user_id)
    for project in self_project_list:
        # Group list
        group_list = db.get_all_group(project["project_uuid"])
        project['group_list'] = group_list
        ungroup_student = db.get_ungroup_student(project["project_uuid"])
        project['ungroup_student'] = ungroup_student
        # Phase part
        phase_list = db.get_project_all_phases(project["project_uuid"])
        for phase in phase_list:
            resource_list = db.get_resource_list(project["project_uuid"], phase['phase_uuid'])
            phase['resource_list'] = resource_list
            task_list = db.get_phase_all_tasks(phase['phase_uuid'])
            print(task_list)
            for task in task_list:
                task_submit_group = db.get_submits(task['task_uuid'])
                print(task_submit_group)
                submit_group_id = [item['group_uuid'] for item in task_submit_group]
                unsubmit_group = [item for item in group_list if item["group_uuid"] not in submit_group_id]
                nosubmit_group = [item for item in task_submit_group if item['file_address'] == "None"]

                task['submit_group'] = task_submit_group
                task['unsubmit_group'] = unsubmit_group + nosubmit_group

                mark_dict = {item['group_uuid']: item['mark'] for item in task_submit_group}
                task['mark_status'] = "Marked"
                for submit in task['submit_group']:
                    if submit['mark'] == "None":
                        task['mark_status'] = "UnMarked"
                        break
                mark_summary = dict()
                mark_summary['title'] = {'text': 'Task {} mark summary'.format(task['task_name'])}
                mark_summary['tooltip'] = dict()
                mark_summary['legend'] = {'data': ['Mark']}
                mark_summary['xAxis'] = {'data': [item["group_name"] for item in group_list]}
                group_index = [item["group_uuid"] for item in group_list]
                mark_summary['yAxis'] = dict()
                mark_summary['series'] = [{'name': 'Mark', 'type': 'bar'}]
                mark_data = list()
                for group in group_index:
                    if group in submit_group_id:
                        if mark_dict[group] == "None":
                            mark_data.append(0)
                        else:
                            mark_data.append(int(mark_dict[group]))
                    else:
                        mark_data.append(0)
                mark_summary['series'][0]['data'] = mark_data
                task['mark_summary'] = mark_summary

            phase['task_list'] = task_list
        project['phase_list'] = phase_list
        # Find current phase
        current_phase = db.get_current_phase_index(project["project_uuid"])
        project['current_phase'] = current_phase
        # Reminder part
        reminder_list = db.admin_get_self_reminder(g.user.user_id, project["project_uuid"])
        reminder_list.sort(key=lambda reminder: reminder['post_time'], reverse=True)
        project['reminder_list'] = reminder_list

    return jsonify({'code': 200, 'msg': 'Get data success', 'user_profile': user_profile, 'self_project_list': self_project_list})


# Get phase all submittion
@app.route('/api/get_phase_submit', methods=['POST'])
@auth.login_required
def get_phase_submit():
    phase_uuid = request.json.get('phase_uuid')
    task_list = db.get_phase_all_tasks(phase_uuid)
    print(task_list)
    phase_info = db.get_phases(phase_uuid)[0]
    group_list = db.get_all_group(phase_info['project_uuid'])
    for task in task_list:
        task_submit_group = db.get_submits(task['task_uuid'])
        submit_group_id = [item['group_uuid'] for item in task_submit_group]
        unsubmit_group = [item for item in group_list if item["group_uuid"] not in submit_group_id]
        nosubmit_group = [item for item in task_submit_group if item['file_address'] == "None"]
        task['submit_group'] = task_submit_group
        task['unsubmit_group'] = unsubmit_group + nosubmit_group

    return jsonify({'code': 200, 'msg': 'Get data success', 'user_id': g.user.user_id, 'user_type': g.user.user_type,
                    'data': task_list})


# Create whole project
@app.route('/api/create_whole_project', methods=['POST'])
@auth.login_required
def create_whole_project():
    if g.user.is_admin_user():
        project_data = request.json.get('project_data')
        print(project_data)
        project_name = project_data['projectName']
        phases_dict = dict()
        for phase in project_data["phaseName"]:
            phase_index = re.search(r'\d+', phase)
            phase_index = int(phase_index.group(0))
            phases_dict[phase_index] = {"phase_name": project_data["phaseName"][phase], "task_list": list()}
            phases_dict[phase_index]["task_list"] = project_data["taskArray"][phase].copy()

        phase_list = list()
        for phase_index in phases_dict:
            phases_dict[phase_index]["phase_index"] = phase_index
            phase_list.append(phases_dict[phase_index])

        whole_project_data = dict()
        whole_project_data["project_name"] = project_name
        whole_project_data["phase_list"] = phase_list
        db.create_whole_project(g.user.user_id, whole_project_data)

        return jsonify(
            {'code': 200, 'msg': 'Create project success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Mark submittion
@app.route('/api/mark_submittion', methods=['POST'])
@auth.login_required
def mark_submittion():
    mark_data = request.json.get('mark_data')
    print(mark_data)
    ass_uuid = mark_data['task_id']
    group_id = mark_data['group_id']
    mark = mark_data['mark']
    submission = db.get_self_submit(group_id, ass_uuid)
    print(submission)
    if (len(submission)) == 0:
        db.mark_unsubmits(ass_uuid, group_id, mark)
    else:
        db.mark_submits(submission[0]['submit_uuid'], mark)

    return jsonify(
        {'code': 200, 'msg': 'Mark submittion success', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Get Mark summary
@app.route('/api/get_mark_summary', methods=['POST'])
@auth.login_required
def get_mark_summary():
    project_uuid = request.json.get('project_uuid')
    if g.user.is_admin_user():
        phases_list = db.get_project_all_phases(project_uuid)
        tasks_list = list()
        group_list = db.get_all_group(project_uuid)
        for phase in phases_list:
            temp_tasks_list = db.get_phase_all_tasks(phase["phase_uuid"])
            tasks_list = tasks_list + temp_tasks_list
        for task in tasks_list:
            temp_submit_list = db.get_submits(task["task_uuid"])
            mark_dict = {item['group_uuid']: item['mark'] for item in temp_submit_list}
            task['submit'] = temp_submit_list.copy()
            temp_submit_list = [item['group_uuid'] for item in temp_submit_list]
            temp_unsubmit_list = [item for item in group_list if item ['group_uuid'] not in temp_submit_list]
            task['mark_status'] = "Marked"
            for submit in task['submit']:
                if submit['mark'] == "None":
                    task['mark_status'] = "UnMarked"
                    break
            task['unsubmit'] = temp_unsubmit_list
            mark_summary = dict()
            mark_summary['title'] = {'text': 'Task {} mark summary'.format(task['task_name'])}
            mark_summary['tooltip'] = dict()
            mark_summary['legend'] = {'data': ['Mark']}
            mark_summary['xAxis'] = {'data': [item["group_name"] for item in group_list]}
            group_index = [item["group_uuid"] for item in group_list]
            mark_summary['yAxis'] = dict()
            mark_summary['series'] = [{'name': 'Mark', 'type': 'bar'}]
            mark_data = list()
            for group in group_index:
                if group in temp_submit_list:
                    if mark_dict[group] == "None":
                        mark_data.append(0)
                    else:
                        mark_data.append(int(mark_dict[group]))
                else:
                    mark_data.append(0)
            mark_summary['series'][0]['data'] = mark_data
            task['mark_summary'] = mark_summary
        print(tasks_list)
        return jsonify({'code': 400, 'msg': 'Get mark summary success', 'user_id': g.user.user_id,
                        'user_type': g.user.user_type, 'data': tasks_list})
    else:
        return jsonify(
            {'code': 400, 'msg': 'Insufficient permissions', 'user_id': g.user.user_id, 'user_type': g.user.user_type})


# Chatbot API
@app.route('/api/chatbot', methods=['POST'])
@auth.login_required
def chatbot_api():
    msg = request.json.get('msg')
    project_uuid = request.json.get('project_uuid')
    cb = chatbot.Chatbot(project_uuid, g.user.user_id, os.path.join(basedir, app.config['CHATBOT_RIVE_FILE']))
    rsp_list = cb.get_reply(msg)
    if rsp_list[1] == 'reminder':
        if g.user.is_admin_user():
            return jsonify({'code': 200, 'msg': 'Create new reminder', 'user_id': g.user.user_id,
                            'user_type': g.user.user_type, 'action': rsp_list[1]})
        else:
            return jsonify({'code': 200, 'msg': 'Get reply success', 'user_id': g.user.user_id,
                            'user_type': g.user.user_type, 'reply': "You don't have enough permissions to do this",
                            'action': 'search'})
    else:
        return jsonify({'code': 200, 'msg': 'Get reply success', 'user_id': g.user.user_id,
                        'user_type': g.user.user_type, 'reply': rsp_list[0], 'action': rsp_list[1]})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

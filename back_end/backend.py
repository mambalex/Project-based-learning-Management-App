import os
import re
import json
import database as db
from datetime import datetime

from flask import Flask, g, jsonify, make_response, request, abort, url_for
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth
# from flask_sqlalchemy import SQLAlchemy
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired
from passlib.apps import custom_app_context

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)

CORS(app, resources=r'/*')
app.config['SECRET_KEY'] = 'hard to guess string'
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_RECORD_QUERIES'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
    os.path.join(basedir, 'data.sqlite')

auth = HTTPBasicAuth()
CSRF_ENABLED = True
app.debug = True


# -------------------------- start classes ---------------------
# --------------------------- user model -----------------------
class User:
    user_id = None
    password = None
    name = None
    email = None
    photo = None
    user_type = None

    def __init__(self, user_profile=None):
        if user_profile is not None:
            self.load_from_dict(user_profile)

    def load_from_dict(self, user_profile):
        self.user_id = user_profile["user_id"]
        self.__password = self.hash_password(
            user_profile.get("passwd", "None"))
        self.name = user_profile.get("name", self.user_id)
        self.email = user_profile.get("email", "None")
        self.photo = user_profile.get("photo", "None")

    def hash_password(self, password):
        self.password = custom_app_context.encrypt(password)

    def verify_password(self, password):
        return custom_app_context.verify(password, self.password)

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None  # valid token, but expired
        except BadSignature:
            return None  # invalid token
        if data["user_type"] != "admin":
            admin = admin_user(db.get_admin_user(data['id'])[0])
            return admin
        elif data["user_type"] != "student":
            student = student_user(db.get_student_user(data['id'])[0])
            return student


class admin_user(User):
    admin_type = None

    def __init__(self, user_profile=None):
        User.__init__(self, user_profile)
        self.user_type = "admin"
        self.set_admin_type(user_profile.get("type", 0))

    def set_admin_type(self, admin_type):
        self.admin_type = admin_type

    def load_from_db(self, user_id):
        self.user_id = user_id
        user_profile = db.get_admin_user(self.user_id)[0]
        self.__init__(user_profile)

    def load_admin_passwd(self):
        self.hash_password(db.get_admin_passwd(self.user_id))

    def generate_auth_token(self, expiration=600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.user_id, 'user_type': self.user_type, 'type': self.admin_type})


class student_user(User):
    mark = None

    def __init__(self, user_profile=None):
        User.__init__(self, user_profile)
        self.user_type = "student"
        self.set_student_mark(user_profile.get("mark", "None"))

    def set_student_mark(self, mark):
        self.mark = mark

    def load_from_db(self, user_id):
        self.user_id = user_id
        user_profile = db.get_student_user(self.user_id)[0]
        self.__init__(user_profile)

    def load_student_passwd(self):
        self.hash_password(db.get_student_passwd(self.user_id))

    def generate_auth_token(self, expiration=600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.user_id, 'user_type': self.user_type})

@auth.verify_password
def verify_password(name_or_token, password):
    if not name_or_token:
        return False
    name_or_token = re.sub(r'^"|"$', '', name_or_token)
    user = User.verify_auth_token(name_or_token)
    if user is None:
        if not db.check_admin_user_id(name_or_token):
            user = admin_user(db.get_admin_user(name_or_token)[0])
        elif not db.check_student_user_id(name_or_token):
            user = student_user(db.get_student_passwd(name_or_token)[0])
        else:
            return False
        if not user.verify_password(password):
            return False
    g.user = user
    return True


@app.route('/api/test', methods=['GET'])
def test():
    user_id = request.args.get("id")
    result = db.get_admin_user(user_id)
    test1 = admin_user(result[0])
    token1 = test1.generate_auth_token()
    print(token1)
    # print(admin_user.verify_auth_token('test2'))
    return jsonify(result[0])


@app.route('/api/test2', methods=['GET'])
@auth.login_required
def test2():
    return "Ture"


@app.route('/api/create_admin', methods=['POST'])
def new_user():
    user_id = request.json.get('user_id')
    passwd = request.json.get('passwd')
    if user_id is None or passwd is None:
        abort(400)  # missing arguments
    if not db.check_admin_user_id(user_id):
        abort(400)
    user_profile = {'user_id': user_id, 'passwd': passwd, 'name': request.json.get('name'), 'email': request.json.get('email'),
                    'type': 0}
    db.create_admin_user(user_profile)
    user = admin_user()
    user.load_from_db(user_id)
    user.load_admin_passwd()
    token = user.generate_auth_token()
    return jsonify({'code': 201, 'msg': "Create admin success", 'user_id': user.user_id, 'token': token.decode('ascii')})

@app.route('/api/create_student', methods=['POST'])
def new_user():
    user_id = request.json.get('user_id')
    passwd = request.json.get('passwd')
    if user_id is None or passwd is None:
        abort(400)  # missing arguments
    if not db.check_student_user_id(user_id):
        abort(400)
    user_profile = {'user_id': user_id, 'passwd': passwd, 'name': request.json.get('name'), 'email': request.json.get('email')}
    db.create_student_user(user_profile)
    user = student_user()
    user.load_from_db(user_id)
    user.load_student_passwd()
    token = user.generate_auth_token()
    return jsonify({'code': 201, 'msg': "Create student success", 'user_id': user.user_id, 'token': token.decode('ascii')})

@app.route('/api/login', methods=['POST'])
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token()
    return jsonify({'code': 200, 'msg': "Login success", 'token': token.decode('ascii'), 'user_id': g.user.user_id})

@app.route('/api/change_passwd', methods=['POST'])
@auth.login_required
def change_passwd():
    new_passwd = request.json.get('new_passwd')
    if g.user.user_type == "admin":
        db.change_admin_passwd(g.user.user_id, new_passwd)
    else:
        db.change_student_passwd(g.user.user_id, new_passwd)



if __name__ == '__main__':
    app.run(host='0.0.0.0')

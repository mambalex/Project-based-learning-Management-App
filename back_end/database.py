import database_lib
import uuid
import time

# user info part
def check_user_id(email):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select count(*) from user_info where email = '{}';".format(email)
    result = database_object.search(sql)
    database_object.close()
    if result[0][0] == 0:
        return True
    else:
        return False
        
# 0 stand for lecturer, 1 stand for mentor, 2 stand for student
def create_user(user_profile):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into user_info values \
    ('{}', '{}', '{}', {}, '{}');".format(user_profile["email"], user_profile["passwd"],
                                                user_profile.get("name", user_profile["email"]),
                                                user_profile["user_type"], user_profile.get("photo", "None"))
    database_object.update(sql)
    database_object.close()

def get_user(email):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from user_info where email = '{}';".format(email)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["email", "passwd", "name", "user_type", "photo"]
    result = convert_result_to_dict(result, key_list, True)
    return result

def get_user_passwd(email):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from user_info where email = '{}';".format(email)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["email", "passwd", "name", "user_type", "photo"]
    result = convert_result_to_dict(result, key_list)
    return result[0]["passwd"]

def change_user_info(email, field, new_data):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update user_info set {} = '{}' where email = '{}';".format(field, new_data, email)
    database_object.update(sql)
    database_object.close()

def change_user_passwd(email, new_passwd):
    change_user_info(email, "password", new_passwd)

def change_user_name(email, new_name):
    change_user_info(email, "name", new_name)


def change_user_type(email, new_type):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update user_info set user_type = {} where email = '{}';".format(new_type, email)
    database_object.update(sql)
    database_object.close()

def change_user_photo(email, new_photo):
    change_user_info(email, "photo", new_photo)

# enrol project part

def enrol_project(email, project_uuid, user_type='student'):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into enrol_project (email, project_uuid, user_type) values ('{}', '{}', '{}');".format(email, project_uuid, user_type)
    database_object.update(sql)
    database_object.close()

def change_student_mark(email, project_uuid, new_mark):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update enrol_project set mark = {} where email = '{}' and project_uuid = '{}';".format(new_mark, email, project_uuid)
    database_object.update(sql)
    database_object.close()

def get_project_student_list(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select u_i.email, u_i.name from enrol_project e_p, user_info u_i, where e_p.project_uuid = '{}' and e_p.email = u_i.email and e_p.user_type = 'student';".format(
        project_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['email', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

# group part
def create_group(group_name, project_uuid):
    group_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into groups (group_uuid, group_name, project_uuid) values \
    ('{}', '{}', '{}');".format(group_uuid, group_name, project_uuid)
    database_object.update(sql)
    database_object.close()
    return group_uuid


def delete_group(group_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from groups where group_uuid = '{}';".format(group_uuid)
    database_object.update(sql)
    database_object.close()


def get_all_group(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from groups where project_uuid = '{}';".format(project_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["group_uuid", "group_name", "project_uuid", "mark"]
    result = convert_result_to_dict(result, key_list)
    return result


def mark_group(group_uuid, new_mark):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update groups set mark = {} where group_uuid = '{}';".format(new_mark, group_uuid)
    database_object.update(sql)
    database_object.close()

# group relation part
# 0 stand for group leader, 1 stand for group member, 2 stand for mentor
def create_group_relation(email, group_uuid, member_type=1):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into group_relation values \
    ('{}', '{}', {});".format(email, group_uuid, member_type)
    database_object.update(sql)
    database_object.close()


def leave_group(email, group_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from group_relation where email = '{}' and group_uuid = '{}';".format(email, group_uuid)
    database_object.update(sql)
    database_object.close()

# management part
def create_managements(email, group_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into managements values \
    ('{}', '{}');".format(email, group_uuid)
    database_object.update(sql)
    database_object.close()


def delete_managements(email, group_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from managements where email = '{}' and group_uuid = '{}';".format(email, group_uuid)
    database_object.update(sql)
    database_object.close()

# submit part
def create_submits(group_uuid, ass_uuid, address):
    submit_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into submits values \
    ('{}', '{}', '{}', '{}', '{}', {});".format(submit_uuid, group_uuid, ass_uuid, address,
                                                time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime()) + "+0", "Null")
    database_object.update(sql)
    database_object.close()
    return submit_uuid


def mark_submits(submit_uuid, new_mark):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update submits set mark = {} where submit_uuid = '{}';".format(new_mark, submit_uuid)
    database_object.update(sql)
    database_object.close()

# project part
def create_projects(master, project_name, deadline, mark_release="Null", spec_address="None"):
    project_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into projects values \
    ('{}', '{}', '{}', '{}', '{}', '{}');".format(project_uuid, master, project_name, deadline, mark_release, spec_address)
    database_object.update(sql)
    database_object.close()
    return project_uuid


def get_projects(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from projects where project_uuid = '{}';".format(project_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["project_uuid", "master", "project_name", "deadline", "mark_release", "spec_address"]
    result = convert_result_to_dict(result, key_list)
    return result


def get_project_list():
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from projects;"
    result = database_object.search(sql)
    database_object.close()
    key_list = ["project_uuid", "master", "project_name", "deadline", "mark_release", "spec_address"]
    result = convert_result_to_dict(result, key_list)
    return result


def get_self_project_list(email):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select p.* from projects p, enrol_project e_p where e_p.email = '{}' and e_p.project_uuid = p.project_uuid;".format(
        email)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["project_uuid", "master", "project_name", "deadline", "mark_release", "spec_address"]
    result = convert_result_to_dict(result, key_list)
    return result


# TODO: Unfinished function
def get_whole_projects(project_uuid):
    pass


def change_ass_info(table_name, uuid_field, uuid, field, new_data):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update {} set {} = '{}' where {} = '{}';".format(table_name, field, new_data, uuid_field, uuid)
    database_object.update(sql)
    database_object.close()


def change_project_master(project_uuid, new_master):
    change_ass_info("projects", "project_uuid", project_uuid, "master", new_master)


def change_project_name(project_uuid, new_name):
    change_ass_info("projects", "project_uuid", project_uuid, "project_name", new_name)


def change_project_deadline(project_uuid, new_deadline):
    change_ass_info("projects", "project_uuid", project_uuid, "deadline", new_deadline)


def change_project_mark_release(project_uuid, new_mark_release):
    change_ass_info("projects", "project_uuid", project_uuid, "mark_release", new_mark_release)


def change_project_address(project_uuid, new_addr):
    change_ass_info("projects", "project_uuid", project_uuid, "spec_address", new_addr)


def delete_project(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from projects where project_uuid = '{}';".format(project_uuid)
    database_object.update(sql)
    database_object.close()

# phases part
def create_phases(project_uuid, phase_name, deadline, mark_release="Null", submit_require=0, spec_address="None"):
    phase_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into phases values \
    ('{}', '{}', '{}', '{}', '{}', {}, '{}');".format(phase_uuid, project_uuid, phase_name, deadline, mark_release,
                                                      submit_require, spec_address)
    database_object.update(sql)
    database_object.close()
    return phase_uuid


def get_phases(phase_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from phases where phase_uuid = '{}';".format(phase_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["phase_uuid", "project_uuid", "phase_name", "deadline", "mark_release", "submit_require", "spec_address"]
    result = convert_result_to_dict(result, key_list)
    return result


def get_project_all_phases(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from phases where project_uuid = '{}';".format(project_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["phase_uuid", "project_uuid", "phase_name", "deadline", "mark_release", "submit_require", "spec_address"]
    result = convert_result_to_dict(result, key_list)
    return result


def change_phases_name(phase_uuid, new_name):
    change_ass_info("phases", "phase_uuid", phase_uuid, "phase_name", new_name)


def change_phases_deadline(phase_uuid, new_deadline):
    change_ass_info("phases", "phase_uuid", phase_uuid, "deadline", new_deadline)


def change_phases_mark_release(phase_uuid, new_mark_release):
    change_ass_info("phases", "phase_uuid", phase_uuid, "mark_release", new_mark_release)


def change_phases_address(phase_uuid, new_addr):
    change_ass_info("phases", "phase_uuid", phase_uuid, "spec_address", new_addr)


def change_phases_submit_require(phase_uuid, new_submit_require):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update phases set submit_require = {} where phase_uuid = '{}';".format(new_submit_require, phase_uuid)
    database_object.update(sql)
    database_object.close()


def delete_phases(phase_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from phases where phase_uuid = '{}';".format(phase_uuid)
    database_object.update(sql)
    database_object.close()

# task part
def create_tasks(phase_uuid, task_name, deadline, mark_release="Null", submit_require=0, spec_address="None"):
    task_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into tasks values \
    ('{}', '{}', '{}', '{}', '{}', {}, '{}');".format(task_uuid, phase_uuid, task_name, deadline, mark_release,
                                                      submit_require, spec_address)
    database_object.update(sql)
    database_object.close()
    return task_uuid


def get_tasks(task_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from tasks where task_uuid = '{}';".format(task_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["task_uuid", "phase_uuid", "task_name", "deadline", "mark_release", "submit_require", "spec_address"]
    result = convert_result_to_dict(result, key_list)
    return result


def get_phase_all_tasks(phase_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from tasks where phase_uuid = '{}';".format(phase_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["task_uuid", "phase_uuid", "task_name", "deadline", "mark_release", "submit_require", "spec_address"]
    result = convert_result_to_dict(result, key_list)
    return result


def change_tasks_name(task_uuid, new_name):
    change_ass_info("tasks", "task_uuid", task_uuid, "task_name", new_name)


def change_tasks_deadline(task_uuid, new_deadline):
    change_ass_info("tasks", "task_uuid", task_uuid, "deadline", new_deadline)


def change_tasks_mark_release(task_uuid, new_mark_release):
    change_ass_info("tasks", "task_uuid", task_uuid, "mark_release", new_mark_release)


def change_tasks_address(task_uuid, new_addr):
    change_ass_info("tasks", "task_uuid", task_uuid, "spec_address", new_addr)


def change_tasks_submit_require(task_uuid, new_submit_require):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update tasks set submit_require = {} where task_uuid = '{}';".format(new_submit_require, task_uuid)
    database_object.update(sql)
    database_object.close()


def delete_tasks(task_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from tasks where task_uuid = '{}';".format(task_uuid)
    database_object.update(sql)
    database_object.close()

# help function
def check_submit(group_uuid, ass_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from submits where ass_uuid = '{}' and group_uuid = '{}';".format(ass_uuid, group_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["submit_uuid", "group_uuid", "ass_uuid", "file_address", "submit_time", "mark"]
    result = convert_result_to_dict(result, key_list)
    return result


def get_student_timeline(email):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select gr.email as email, gr.group_uuid as group_uuid, g.group_name as group_name,\
    g.project_uuid as project_uuid, pj.project_name as project_name, pj.deadline as project_deadline,\
    pj.mark_release as project_mark_release, ph.phase_uuid as phase_uuid, ph.phase_name as phase_name,\
    ph.deadline as phase_deadline, ph.mark_release as phase_mark_release,\
    ph.submit_require as phase_submit_require, t.task_uuid as task_uuid, t.task_name as task_name,\
    t.deadline as task_deadline, t.mark_release as task_mark_release, t.submit_require as task_submit_require\
    from group_relation gr, groups g, projects pj, phases ph, tasks t where gr.email = '{}' and\
    gr.group_uuid = g.group_uuid and g.project_uuid = pj.project_uuid and pj.project_uuid = ph.project_uuid\
    and ph.phase_uuid = t.phase_uuid;".format(email)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['email', 'group_uuid', 'group_name', 'project_uuid', 'project_name', 'project_deadline',
                'project_mark_release', 'phase_uuid', 'phase_name', 'phase_deadline', 'phase_mark_release',
                'phase_submit_require', 'task_uuid', 'task_name', 'task_deadline', 'task_mark_release',
                'task_submit_require']
    result = convert_result_to_dict(result, key_list)
    return result


def create_test_data():
    create_user({"passwd": "123456", "email": "test1@test.com", "user_type": 0})
    create_user({"passwd": "123456", "email": "test2@test.com", "user_type": 1})
    create_user({"passwd": "123456", "email": "test3@test.com", "user_type": 2})
    create_user({"passwd": "123456", "email": "test4@test.com", "user_type": 2})
    project_uuid = create_projects("test1", "test", "2018-09-11 18:29:55+10", "2018-09-11 18:29:55+10")
    phase_uuid = create_phases(project_uuid=project_uuid, phase_name="test", deadline="2018-09-11 18:29:55+10",
                               mark_release="2018-09-11 18:29:55+10")
    task_uuid = create_tasks(phase_uuid, "test", "2018-09-11 18:29:55+10", mark_release="2018-09-11 18:29:55+10")


def convert_result_to_dict(temp_result, key_list, except_passwd=False):
    result = list()
    for tuples in temp_result:
        temp_dict = {}
        for i in range(len(tuples)):
            if except_passwd == True and key_list[i] == "passwd":
                continue
            if isinstance(tuples[i], int):
                temp_dict[key_list[i]] = tuples[i]
            elif tuples[i] is None:
                temp_dict[key_list[i]] = "None"
            else:
                temp_dict[key_list[i]] = tuples[i].rstrip()
        result.append(temp_dict)
    return result


if __name__ == "__main__":
    create_test_data()

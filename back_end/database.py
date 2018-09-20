import database_lib
import uuid
import time

def check_admin_user_id(user_id):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select count(*) from admin_user where user_id = '{}';".format(user_id)
    result = database_object.search(sql)
    database_object.close()
    if result[0][0] == 0:
        return True
    else:
        return False

def create_admin_user(user_profile):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into admin_user values \
    ('{}', '{}', '{}', '{}', {}, '{}');".format(user_profile["user_id"], user_profile["passwd"], user_profile.get("name", user_profile["user_id"]), user_profile["email"], user_profile["type"], user_profile.get("photo", "None"))
    database_object.update(sql)
    database_object.close()

def get_admin_user(user_id):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from admin_user where user_id = '{}';".format(user_id)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["user_id", "passwd", "name", "email", "type", "photo"]
    result = convert_result_to_dict(result, key_list, True)
    return result

def get_admin_passwd(user_id):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from admin_user where user_id = '{}';".format(user_id)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["user_id", "passwd", "name", "email", "type", "photo"]
    result = convert_result_to_dict(result, key_list)
    return result[0]["passwd"]

def change_admin_user_info(user_id, field, new_data):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update admin_user set {} = '{}' where user_id = '{}';".format(field, new_data, user_id)
    database_object.update(sql)
    database_object.close()

def change_admin_passwd(user_id, new_passwd):
    change_admin_user_info(user_id, "password", new_passwd)

def change_admin_name(user_id, new_name):
    change_admin_user_info(user_id, "name", new_name)

def change_admin_email(user_id, new_email):
    change_admin_user_info(user_id, "email", new_email)

def change_admin_type(user_id, new_type):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update admin_user set type = {} where user_id = '{}';".format(new_type, user_id)
    database_object.update(sql)
    database_object.close()

def change_admin_photo(user_id, new_photo):
    change_admin_user_info(user_id, "photo", new_photo)

def check_student_user_id(user_id):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select count(*) from students where user_id = '{}';".format(user_id)
    result = database_object.search(sql)
    database_object.close()
    if result[0][0] == 0:
        return True
    else:
        return False

def create_student_user(user_profile):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into students values \
    ('{}', '{}', '{}', '{}', {}, '{}');".format(user_profile["user_id"], user_profile["passwd"], user_profile.get("name", user_profile["user_id"]), user_profile["email"], user_profile.get("mark", "Null"), user_profile.get("photo", "None"))
    database_object.update(sql)
    database_object.close()

def get_student_user(user_id):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from students where user_id = '{}';".format(user_id)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["user_id", "passwd", "name", "email", "mark", "photo"]
    result = convert_result_to_dict(result, key_list, True)
    return result

def get_student_passwd(user_id):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from students where user_id = '{}';".format(user_id)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["user_id", "passwd", "name", "email", "type", "photo"]
    result = convert_result_to_dict(result, key_list)
    return result[0]["passwd"]

def change_student_info(user_id, field, new_data):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update students set {} = '{}' where user_id = '{}';".format(field, new_data, user_id)
    database_object.update(sql)
    database_object.close()

def change_student_passwd(user_id, new_passwd):
    change_student_info(user_id, "password", new_passwd)

def change_student_name(user_id, new_name):
    change_student_info(user_id, "name", new_name)

def change_student_email(user_id, new_email):
    change_student_info(user_id, "email", new_email)

def change_student_mark(user_id, new_mark):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update students set mark = {} where user_id = '{}';".format(new_mark, user_id)
    database_object.update(sql)
    database_object.close()

def change_student_photo(user_id, new_photo):
    change_student_info(user_id, "photo", new_photo)

def create_group(name, project_uuid):
    group_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into groups values \
    ('{}', '{}', '{}', {});".format(group_uuid, name, project_uuid, "Null")
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
    key_list = ["group_uuid", "name", "project_uuid", "mark"]
    result = convert_result_to_dict(result, key_list)
    return result

def mark_group(group_uuid, new_mark):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update groups set mark = {} where group_uuid = '{}';".format(new_mark, group_uuid)
    database_object.update(sql)
    database_object.close()

def create_group_relation(user_id, group_uuid, member_type = 1):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into group_relation values \
    ('{}', '{}', {});".format(user_id, group_uuid, member_type)
    database_object.update(sql)
    database_object.close()

def leave_group(user_id, group_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from group_relation where user_id = '{}' and group_uuid = '{}';".format(user_id, group_uuid)
    database_object.update(sql)
    database_object.close()

def create_managements(user_id, group_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into managements values \
    ('{}', '{}');".format(user_id, group_uuid)
    database_object.update(sql)
    database_object.close()

def delete_managements(user_id, group_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from managements where user_id = '{}' and group_uuid = '{}';".format(user_id, group_uuid)
    database_object.update(sql)
    database_object.close()

def create_submits(group_uuid, ass_uuid, address):
    submit_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into submits values \
    ('{}', '{}', '{}', '{}', '{}', {});".format(submit_uuid, group_uuid, ass_uuid, address, time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())+"+0", "Null")
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

def create_projects(master, name, deadline, mark_release = "Null", address = "None"):
    project_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into projects values \
    ('{}', '{}', '{}', '{}', '{}', '{}');".format(project_uuid, master, name, deadline, mark_release, address)
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
    key_list = ["project_uuid", "master", "name", "deadline", "mark_release", "address"]
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
    change_ass_info("projects", "project_uuid", project_uuid, "name", new_name)
    
def change_project_deadline(project_uuid, new_deadline):
    change_ass_info("projects", "project_uuid", project_uuid, "deadline", new_deadline)

def change_project_mark_release(project_uuid, new_mark_release):
    change_ass_info("projects", "project_uuid", project_uuid, "mark_release", new_mark_release)

def change_project_address(project_uuid, new_addr):
    change_ass_info("projects", "project_uuid", project_uuid, "address", new_addr)

def delete_project(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from projects where project_uuid = '{}';".format(project_uuid)
    database_object.update(sql)
    database_object.close()

def create_phases(project_uuid, name, deadline, mark_release = "Null", submit_require = 0, address = "None"):
    phase_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into phases values \
    ('{}', '{}', '{}', '{}', '{}', {}, '{}');".format(phase_uuid, project_uuid, name, deadline, mark_release, submit_require, address)
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
    key_list = ["phase_uuid", "project_uuid", "name", "deadline", "mark_release", "submit_require", "address"]
    result = convert_result_to_dict(result, key_list)
    return result

def get_project_all_phases(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from phases where project_uuid = '{}';".format(project_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["phase_uuid", "project_uuid", "name", "deadline", "mark_release", "submit_require", "address"]
    result = convert_result_to_dict(result, key_list)
    return result

def change_phases_name(phase_uuid, new_name):
    change_ass_info("phases", "phase_uuid", phase_uuid, "name", new_name)

def change_phases_deadline(phase_uuid, new_deadline):
    change_ass_info("phases", "phase_uuid", phase_uuid, "deadline", new_deadline)

def change_phases_mark_release(phase_uuid, new_mark_release):
    change_ass_info("phases", "phase_uuid", phase_uuid, "mark_release", new_mark_release)

def change_phases_address(phase_uuid, new_addr):
    change_ass_info("phases", "phase_uuid", phase_uuid, "address", new_addr)

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

def create_tasks(phase_uuid, name, deadline, mark_release = "Null", submit_require = 0, address = "None"):
    task_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into tasks values \
    ('{}', '{}', '{}', '{}', '{}', {}, '{}');".format(task_uuid, phase_uuid, name, deadline, mark_release, submit_require, address)
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
    key_list = ["task_uuid", "phase_uuid", "name", "deadline", "mark_release", "submit_require", "address"]
    result = convert_result_to_dict(result, key_list)
    return result

def get_phase_all_tasks(phase_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from tasks where phase_uuid = '{}';".format(phase_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["task_uuid", "phase_uuid", "name", "deadline", "mark_release", "submit_require", "address"]
    result = convert_result_to_dict(result, key_list)
    return result

def change_tasks_name(task_uuid, new_name):
    change_ass_info("tasks", "task_uuid", task_uuid, "name", new_name)

def change_tasks_deadline(task_uuid, new_deadline):
    change_ass_info("tasks", "task_uuid", task_uuid, "deadline", new_deadline)

def change_tasks_mark_release(task_uuid, new_mark_release):
    change_ass_info("tasks", "task_uuid", task_uuid, "mark_release", new_mark_release)

def change_tasks_address(task_uuid, new_addr):
    change_ass_info("tasks", "task_uuid", task_uuid, "address", new_addr)

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

def check_submit(group_uuid, ass_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from submits where ass_uuid = '{}' and group_uuid = '{}';".format(ass_uuid, group_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["submit_uuid", "group_uuid", "ass_uuid", "address", "submit_time", "mark"]
    result = convert_result_to_dict(result, key_list)
    return result

def get_student_timeline(user_id):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select gr.user_id as user_id, gr.group_uuid as group_uuid, g.name as group_name,\
    g.project_uuid as project_uuid, pj.name as project_name, pj.deadline as project_deadline,\
    pj.mark_release as project_mark_release, ph.phase_uuid as phase_uuid, ph.name as phase_name,\
    ph.deadline as phase_deadline, ph.mark_release as phase_mark_release,\
    ph.submit_require as phase_submit_require, t.task_uuid as task_uuid, t.name as task_name,\
    t.deadline as task_deadline, t.mark_release as task_mark_release, t.submit_require as task_submit_require\
    from group_relation gr, groups g, projects pj, phases ph, tasks t where gr.user_id = '{}' and\
    gr.group_uuid = g.group_uuid and g.project_uuid = pj.project_uuid and pj.project_uuid = ph.project_uuid\
    and ph.phase_uuid = t.phase_uuid;".format(user_id)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['user_id', 'group_uuid', 'group_name', 'project_uuid', 'project_name', 'project_deadline', 'project_mark_release', 'phase_uuid', 'phase_name', 'phase_deadline', 'phase_mark_release', 'phase_submit_require', 'task_uuid', 'task_name', 'task_deadline', 'task_mark_release', 'task_submit_require']
    result = convert_result_to_dict(result, key_list)
    return result


def create_test_data():
    create_admin_user({"user_id": "test1", "passwd": "123456", "email": "test1@test.com", "type": 1})
    create_admin_user({"user_id": "test2", "passwd": "123456", "email": "test2@test.com", "type": 2})
    create_student_user({"user_id": "test3", "passwd": "123456", "email": "test3@test.com"})
    create_student_user({"user_id": "test4", "passwd": "123456", "email": "test4@test.com"})
    project_uuid = create_projects("test1", "test", "2018-09-11 18:29:55+10", "2018-09-11 18:29:55+10")
    phase_uuid = create_phases(project_uuid=project_uuid, name="test", deadline="2018-09-11 18:29:55+10", mark_release="2018-09-11 18:29:55+10")
    task_uuid = create_tasks(phase_uuid, "test", "2018-09-11 18:29:55+10", mark_release="2018-09-11 18:29:55+10")

def convert_result_to_dict(temp_result, key_list, except_passwd = False):
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
   
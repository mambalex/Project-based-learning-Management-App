import database_lib
import uuid
import time
import datetime
import random


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
    ('{}', '{}', '{}', '{}', '{}', '{}', '{}');".format(user_profile["email"], user_profile["passwd"],
                                          user_profile.get("name", user_profile["email"]), user_profile.get('gender', "None"),
                                          user_profile.get("dob", "October 05"), user_profile["user_type"], user_profile.get("photo", "None"))
    database_object.update(sql)
    database_object.close()


def get_user(email):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from user_info where email = '{}';".format(email)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["email", "passwd", "name", "gender", "dob", "user_type", "photo"]
    result = convert_result_to_dict(result, key_list, True)
    return result


def get_user_passwd(email):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from user_info where email = '{}';".format(email)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["email", "passwd", "name", "gender", "dob", "user_type", "photo"]
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

def change_user_gender(email, new_gender):
    change_user_info(email, 'gender', new_gender)

def change_user_dob(email, new_dob):
    change_user_info(email, 'dob', new_dob)

def change_user_type(email, new_type):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update user_info set user_type = '{}' where email = '{}';".format(new_type, email)
    database_object.update(sql)
    database_object.close()


def change_user_photo(email, new_photo):
    change_user_info(email, "photo", new_photo)


# enrol project part

def enrol_project(email, project_uuid, user_type='student'):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into enrol_project (email, project_uuid, user_type) values ('{}', '{}', '{}');".format(email,
                                                                                                         project_uuid,
                                                                                                         user_type)
    database_object.update(sql)
    database_object.close()


def change_student_mark(email, project_uuid, new_mark):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update enrol_project set mark = {} where email = '{}' and project_uuid = '{}';".format(new_mark, email,
                                                                                                  project_uuid)
    database_object.update(sql)
    database_object.close()


def get_project_student_list(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select u_i.email, u_i.name from enrol_project e_p, user_info u_i where e_p.project_uuid = '{}' and e_p.email = u_i.email and e_p.user_type = 'student';".format(
        project_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['email', 'name']
    result = convert_result_to_dict(result, key_list)
    return result


# group part
def create_group(group_name, project_uuid, description="None"):
    group_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into groups (group_uuid, group_name, project_uuid, description) values \
    ('{}', '{}', '{}', '{}');".format(group_uuid, group_name, project_uuid, description)
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


def clear_all_group(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select group_uuid, group_name from groups where project_uuid = '{}';".format(project_uuid)
    group_list = database_object.search(sql)
    key_list = ['group_uuid', 'group_name']
    group_list = convert_result_to_dict(group_list, key_list)
    for group in group_list:
        sql = "delete from groups where group_uuid = '{}';".format(group['group_uuid'])
        database_object.update(sql)
        sql = "delete from group_relation where group_uuid = '{}';".format(group['group_uuid'])
        database_object.update(sql)
    database_object.close()


def random_group(project_uuid, group_data):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    print(group_data)
    sql = "select * from projects where project_uuid = '{}';".format(project_uuid)
    project_info = database_object.search(sql)
    key_list = ["project_uuid", "master", "project_name", "deadline", "mark_release", "spec_address"]
    project_info = convert_result_to_dict(project_info, key_list)[0]
    for i in group_data:
        group_uuid = uuid.uuid1()
        group_name = "Group {}".format(i+1)
        description = "{} group {}".format(project_info["project_name"], i+1)
        sql = "insert into groups (group_uuid, group_name, project_uuid, description) values \
            ('{}', '{}', '{}', '{}');".format(group_uuid, group_name, project_uuid, description)
        database_object.update(sql)
        for student in group_data[i]:
            sql = "insert into group_relation values \
                  ('{}', '{}', {});".format(student['email'], group_uuid, 1)
            database_object.update(sql)
    database_object.close()


def get_all_group(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from groups where project_uuid = '{}';".format(project_uuid)
    result = database_object.search(sql)
    key_list = ["group_uuid", "group_name", "project_uuid", "description", "mark"]
    result = convert_result_to_dict(result, key_list)
    for group in result:
        sql = "select u_i.email, u_i.name, u_i.photo, g_r.mem_type from group_relation g_r, user_info u_i where g_r.group_uuid = '{}' and g_r.email = u_i.email;".format(group['group_uuid'])
        mem_result = database_object.search(sql)
        key_list = ['email', 'name', 'photo', 'mem_type']
        mem_result = convert_result_to_dict(mem_result, key_list)
        group["member"] = mem_result
    database_object.close()
    return result


def mark_group(group_uuid, new_mark):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update groups set mark = {} where group_uuid = '{}';".format(new_mark, group_uuid)
    database_object.update(sql)
    database_object.close()


def change_group_description(group_uuid, new_description):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update groups set description = '{}' where group_uuid = '{}';".format(new_description, group_uuid)
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
    sql = "select * from group_relation where email = '{}' and group_uuid = '{}';".format(email, group_uuid)
    result = database_object.search(sql)
    if result[0][0] == 0:
        sql = "delete from group_relation where group_uuid = '{}';".format(group_uuid)
        database_object.update(sql)
        sql = "delete from groups where group_uuid = '{}';".format(group_uuid)
        database_object.update(sql)
    else:
        sql = "delete from group_relation where email = '{}' and group_uuid = '{}';".format(email, group_uuid)
        database_object.update(sql)
    database_object.close()


def get_group_member(group_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select u_i.email, u_i.name, u_i.photo, g_r.mem_type from group_relation g_r, user_info u_i where g_r.group_uuid = '{}' and g_r.email = u_i.email;".format(group_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['email', 'name', 'photo', 'mem_type']
    result = convert_result_to_dict(result, key_list)
    return result

def get_group_info(group_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from groups where group_uuid = '{}';".format(
        group_uuid)
    result = database_object.search(sql)
    key_list = ['group_uuid', 'group_name', 'project_uuid', 'description', 'mark']
    result = convert_result_to_dict(result, key_list)
    for group in result:
        sql = "select u_i.email, u_i.name, u_i.photo, g_r.mem_type from group_relation g_r, user_info u_i where g_r.group_uuid = '{}' and g_r.email = u_i.email;".format(group['group_uuid'])
        mem_result = database_object.search(sql)
        key_list = ['email', 'name', 'photo', 'mem_type']
        mem_result = convert_result_to_dict(mem_result, key_list)
        group["member"] = mem_result
    database_object.close()
    return result

def get_self_group(email, project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select g.* from groups g, group_relation g_r where g.project_uuid = '{}' and g.group_uuid = g_r.group_uuid and g_r.email = '{}';".format(
        project_uuid, email)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['group_uuid', 'group_name', 'project_uuid', 'description', 'mark']
    result = convert_result_to_dict(result, key_list)
    return result

def check_has_group(email, project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select count(*) from groups g, group_relation g_r where g.project_uuid = '{}' and g.group_uuid = g_r.group_uuid and g_r.email = '{}';".format(project_uuid, email)
    result = database_object.search(sql)
    database_object.close()
    if result[0][0] == 0:
        return False
    else:
        return True

def get_ungroup_student(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select u_i.email, u_i.name from enrol_project e_p, user_info u_i where e_p.project_uuid = '{}' and e_p.email = u_i.email and e_p.user_type = 'student';".format(
        project_uuid)
    all_student_list = database_object.search(sql)
    sql = "select g_r.email, count(*) from groups g, group_relation g_r where g.project_uuid = '{}' and g.group_uuid = g_r.group_uuid group by g_r.email;".format(project_uuid)
    ingroup_student_list = database_object.search(sql)
    database_object.close()
    all_student_list = convert_result_to_dict(temp_result=all_student_list, key_list=["email", "name"])
    ingroup_student_list = convert_result_to_dict(temp_result=ingroup_student_list, key_list=["email", "count"])
    all_list = [item["email"] for item in all_student_list]
    all_student_list = {item["email"]: item["name"] for item in all_student_list}
    in_list = list()
    for item in ingroup_student_list:
        if item["count"] > 0:
            in_list.append(item["email"])
    result = list()

    for email in all_list:
        if email not in in_list:
            result.append({'email': email, 'name': all_student_list[email]})

    return result



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


def get_submits(ass_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select s.submit_uuid, g.group_uuid, g.group_name, s.file_address, s.submit_time, s.mark from submits s, groups g where s.group_uuid = g.group_uuid and s.ass_uuid = '{}';".format(
        ass_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['submit_uuid', 'group_uuid', 'group_name', 'file_address', 'submit_time', 'mark']
    result = convert_result_to_dict(result, key_list)
    return result


def check_submits(group_uuid, ass_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select count(*) from submits where group_uuid = '{}' and ass_uuid = '{}';".format(
        group_uuid, ass_uuid)
    result = database_object.search(sql)
    database_object.close()
    if result[0][0] == 0:
        return False
    else:
        return True


def re_submit(submit_uuid, address):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update submits set submit_time = '{}' where submit_uuid = '{}';".format(time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime()) + "+0", submit_uuid)
    database_object.update(sql)
    sql = "update submits set file_address = '{}' where submit_uuid = '{}';".format(address, submit_uuid)
    database_object.update(sql)
    database_object.close()
    return submit_uuid

# project part
def create_projects(master, project_name, deadline, mark_release=None, spec_address="None"):
    project_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    if mark_release is None:
        sql = "insert into projects (project_uuid, master, project_name, deadline, spec_address) values \
    ('{}', '{}', '{}', '{}', '{}');".format(project_uuid, master, project_name, deadline, spec_address)
    else:
        sql = "insert into projects values \
    ('{}', '{}', '{}', '{}', '{}', '{}');".format(project_uuid, master, project_name, deadline, mark_release,
                                                  spec_address)
    database_object.update(sql)
    database_object.close()
    return project_uuid


def create_whole_project(master, project_data):
    print(project_data)


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
    sql = "select p.*, u_i.name  from projects p, user_info u_i where p.master = u_i.email;"
    result = database_object.search(sql)
    database_object.close()
    key_list = ["project_uuid", "master", "project_name", "deadline", "mark_release", "spec_address", "master_name"]
    result = convert_result_to_dict(result, key_list)
    return result


def get_self_project_list(email):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select p.*, u_i.name from projects p, enrol_project e_p, user_info u_i where e_p.email = '{}' and e_p.project_uuid = p.project_uuid and p.master = u_i.email;".format(
        email)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["project_uuid", "master", "project_name", "deadline", "mark_release", "spec_address", "master_name"]
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
def create_phases(project_uuid, phase_index, phase_name, deadline, mark_release=None, submit_require=0, spec_address="None"):
    phase_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    if mark_release is None:
        sql = "insert into phases (phase_uuid, project_uuid, phase_name, deadline, submit_require, spec_address) values \
    ('{}', '{}', {}, '{}', '{}', {}, '{}');".format(phase_uuid, project_uuid, phase_index, phase_name, deadline,
                                                submit_require, spec_address)
    else:
        sql = "insert into phases values \
    ('{}', '{}', {}, '{}', '{}', '{}', {}, '{}');".format(phase_uuid, project_uuid, phase_index, phase_name, deadline, mark_release,
                                                      submit_require, spec_address)
    database_object.update(sql)
    database_object.close()
    return phase_uuid


def is_phase(phase_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select count(*) from phases where phase_uuid = '{}';".format(phase_uuid)
    result = database_object.search(sql)
    database_object.close()
    if result[0][0] == 1:
        return True
    else:
        return False


def get_phases(phase_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from phases where phase_uuid = '{}';".format(phase_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["phase_uuid", "project_uuid", "phase_index", "phase_name", "deadline", "mark_release", "submit_require",
                "spec_address"]
    result = convert_result_to_dict(result, key_list)
    return result


def get_project_all_phases(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from phases where project_uuid = '{}' order by deadline;".format(project_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["phase_uuid", "project_uuid", "phase_index", "phase_name", "deadline", "mark_release", "submit_require",
                "spec_address"]
    result = convert_result_to_dict(result, key_list)
    return result


def get_current_phase_index(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from phases where project_uuid = '{}' and now() < deadline order by deadline;".format(project_uuid)
    result = database_object.search(sql)
    database_object.close()
    if len(result) == 0:
        return -1
    else:
        key_list = ["phase_uuid", "project_uuid", "phase_index", "phase_name", "deadline", "mark_release", "submit_require",
                    "spec_address"]
        result = convert_result_to_dict(result, key_list)
        return result[0]["phase_index"]-1


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
def create_tasks(phase_uuid, task_name, deadline, mark_release=None, submit_require=0, spec_address="None"):
    task_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    if mark_release is None:
        sql = "insert into tasks (task_uuid, phase_uuid, task_name, deadline, submit_require, spec_address) values \
    ('{}', '{}', '{}', '{}', {}, '{}');".format(task_uuid, phase_uuid, task_name, deadline,
                                                submit_require, spec_address)
    else:
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
    sql = "select * from tasks where phase_uuid = '{}' order by deadline;".format(phase_uuid)
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
def get_self_submit(group_uuid, ass_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from submits where ass_uuid = '{}' and group_uuid = '{}';".format(ass_uuid, group_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["submit_uuid", "group_uuid", "ass_uuid", "file_address", "submit_time", "mark"]
    result = convert_result_to_dict(result, key_list)
    return result


def get_student_timeline(email, group_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select gr.email as email, gr.group_uuid as group_uuid, g.group_name as group_name,\
    g.project_uuid as project_uuid, pj.project_name as project_name, pj.deadline as project_deadline,\
    pj.mark_release as project_mark_release, ph.phase_uuid as phase_uuid, ph.phase_index, ph.phase_name as phase_name,\
    ph.deadline as phase_deadline, ph.mark_release as phase_mark_release,\
    ph.submit_require as phase_submit_require, t.task_uuid as task_uuid, t.task_name as task_name,\
    t.deadline as task_deadline, t.mark_release as task_mark_release, t.submit_require as task_submit_require\
    from group_relation gr, groups g, projects pj, phases ph, tasks t where gr.email = '{}' and gr.group_uuid = '{}' and\
    gr.group_uuid = g.group_uuid and g.project_uuid = pj.project_uuid and pj.project_uuid = ph.project_uuid\
    and ph.phase_uuid = t.phase_uuid;".format(email, group_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['email', 'group_uuid', 'group_name', 'project_uuid', 'project_name', 'project_deadline',
                'project_mark_release', 'phase_uuid', "phase_index", 'phase_name', 'phase_deadline', 'phase_mark_release',
                'phase_submit_require', 'task_uuid', 'task_name', 'task_deadline', 'task_mark_release',
                'task_submit_require']
    result = convert_result_to_dict(result, key_list)
    return result


# reminder part
def create_reminder(email, project_uuid, ass_uuid, message, submit_check="no"):
    reminder_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    timestamp = time.time()
    sql = "insert into reminder values \
    ('{}', '{}', '{}', '{}', '{}', '{}', '{}');".format(reminder_uuid, email, project_uuid, ass_uuid, message, submit_check, time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(timestamp)) + "+0")
    database_object.update(sql)
    database_object.close()
    return [reminder_uuid, time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(timestamp))]


def change_reminder_info(reminder_uuid, field, new_data):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update reminder set {} = '{}' where reminder_uuid = '{}';".format(field, new_data, reminder_uuid)
    database_object.update(sql)
    database_object.close()


def change_reminder_ass(reminder_uuid, new_ass_uuid):
    change_reminder_info(reminder_uuid, "ass_uuid", new_ass_uuid)


def change_reminder_message(reminder_uuid, new_message):
    change_reminder_info(reminder_uuid, "message", new_message)


def change_reminder_submit_check(reminder_uuid, new_submit_check):
    change_reminder_info(reminder_uuid, "submit_check", new_submit_check)


def delete_reminder(reminder_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from reminder where reminder_uuid = '{}';".format(reminder_uuid)
    database_object.update(sql)
    database_object.close()


def admin_get_self_reminder(email, project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from reminder where master = '{}' and project_uuid = '{}';".format(email, project_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["reminder_uuid", "master", "project_uuid", "ass_uuid", "message", "submit_check", "post_time"]
    result = convert_result_to_dict(result, key_list)
    return result


def student_get_self_global_reminder(project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from reminder where project_uuid = '{}' and submit_check = 'no' order by post_time desc;".format(project_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ["reminder_uuid", "master", "project_uuid", "ass_uuid", "message", "submit_check", "post_time"]
    result = convert_result_to_dict(result, key_list)
    return result


def student_get_self_unsubmit_reminder(email, project_uuid):
    dbconfig = {"dbname": "comp9323"}
    result = list()
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from reminder where project_uuid = '{}' and submit_check = 'yes' order by post_time desc;".format(project_uuid)
    require_submit_reminder = database_object.search(sql)
    key_list = ["reminder_uuid", "master", "project_uuid", "ass_uuid", "message", "submit_check", "post_time"]
    require_submit_reminder = convert_result_to_dict(require_submit_reminder, key_list)
    sql = "select rem.* from reminder rem, submits s, groups g, group_relation g_r \
        where rem.project_uuid = '{}' and rem.project_uuid = g.project_uuid and \
        g.group_uuid = g_r.group_uuid and g_r.email = '{}' and rem.submit_check = \
        'yes' order by rem.post_time desc;".format(project_uuid, email)
    submit_reminder = database_object.search(sql)
    submit_reminder = convert_result_to_dict(submit_reminder, key_list)
    database_object.close()
    submit_reminder_list = [reminder['reminder_uuid'] for reminder in submit_reminder]
    for reminder in require_submit_reminder:
        if reminder['reminder_uuid'] not in submit_reminder_list:
            result.append(reminder)
    return result


# addition resource
def add_addition_resource(email, project_uuid, filename, phase_uuid = None, description="None", file_addr="None"):
    resource_uuid = uuid.uuid1()
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    if phase_uuid is None:
        sql = "insert into addition_resource (res_uuid, master, project_uuid, filename, description, file_addr) values \
        ('{}', '{}', '{}', '{}', '{}', '{}');".format(resource_uuid, email, project_uuid, filename, description, file_addr)
    else:
        sql = "insert into addition_resource values \
            ('{}', '{}', '{}', '{}', '{}', '{}', '{}');".format(resource_uuid, email, project_uuid, phase_uuid, filename, description, file_addr)
    database_object.update(sql)
    database_object.close()
    return resource_uuid


def delete_addition_resource(resource_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from addition_resource where res_uuid = '{}';".format(resource_uuid)
    database_object.update(sql)
    database_object.close()


def get_resource_list(project_uuid, phase_uuid = None):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    if phase_uuid is None:
        sql = "select res_uuid, master, filename, description, file_addr from addition_resource where project_uuid = '{}';".format(
            project_uuid)
    else:
        sql = "select res_uuid, master, filename, description, file_addr from addition_resource where project_uuid = '{}' and phase_uuid = '{}';".format(
            project_uuid, phase_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['resource_uuid', 'master', 'filename', 'description', 'file_addr']
    result = convert_result_to_dict(temp_result=result, key_list=key_list)
    return result


def get_upload_file_list(email, project_uuid):
    dbconfig = {"dbname": "comp9323"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select res_uuid, master, filename, description, file_addr from addition_resource where master = '{}' and project_uuid = '{}';".format(
        email, project_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['resource_uuid', 'master', 'filename', 'description', 'file_addr']
    result = convert_result_to_dict(temp_result=result, key_list=key_list)
    return result


def create_test_data():
    create_user({"passwd": "123456", "email": "test1@test.com", "user_type": 'lecturer'})
    create_user({"passwd": "123456", "email": "test2@test.com", "user_type": 'mentor'})
    create_user({"passwd": "123456", "email": "test3@test.com", "user_type": 'student'})
    create_user({"passwd": "123456", "email": "test4@test.com", "user_type": 'student'})
    project_uuid = create_projects("test1@test.com", "Test Project", "2018-10-20 23:59:59+0", "2018-10-25 00:00:00+0")
    phase_uuid = create_phases(project_uuid=project_uuid, phase_index=1, phase_name="Phase 1", deadline="2018-10-11 23:59:59+0",
                               mark_release="2018-10-13 00:00:00+0")
    task_uuid = create_tasks(phase_uuid, "Proposal", "2018-10-11 23:59:59+0", mark_release="2018-10-13 00:00:00+0", submit_require=1)
    phase_uuid = create_phases(project_uuid=project_uuid, phase_index=2, phase_name="Phase 2", deadline="2018-10-13 23:59:59+0",
                               mark_release="2018-10-15 00:00:00+0")
    task_uuid = create_tasks(phase_uuid, "Requirement document & Design document", "2018-10-13 23:59:59+0", mark_release="2018-10-15 00:00:00+0", submit_require=1)
    phase_uuid = create_phases(project_uuid=project_uuid, phase_index=3, phase_name="Phase 3", deadline="2018-10-15 23:59:59+0",
                               mark_release="2018-10-17 00:00:00+0")
    task_uuid = create_tasks(phase_uuid, "Implementation", "2018-10-15 23:59:59+0", mark_release="2018-10-17 00:00:00+0", submit_require=1)
    phase_uuid = create_phases(project_uuid=project_uuid, phase_index=4, phase_name="Phase 4", deadline="2018-10-17 23:59:59+0",
                               mark_release="2018-10-20 00:00:00+0")
    task_uuid = create_tasks(phase_uuid, "Demo", "2018-10-17 23:59:59+0", mark_release="2018-10-20 00:00:00+0", submit_require=1)
    enrol_project("test3@test.com", project_uuid)
    group_uuid = create_group("group 1", project_uuid)
    create_group_relation("test3@test.com", group_uuid, 0)

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
            elif isinstance(tuples[i], str):
                temp_dict[key_list[i]] = tuples[i].rstrip()
            elif isinstance(tuples[i], datetime.datetime):
                temp_dict[key_list[i]] = tuples[i].strftime("%Y-%m-%d %H:%M:%S")
            else:
                temp_dict[key_list[i]] = tuples[i]

        result.append(temp_dict)
    return result


if __name__ == "__main__":
    create_test_data()

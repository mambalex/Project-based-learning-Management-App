import database_lib
import uuid

def check_username(username):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select count(*) from user_info where username = '{}';".format(username)
    result = database_object.search(sql)
    database_object.close()
    if result[0][0] == 0:
        return True
    else:
        return False

def create_user(user_profile):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into user_info values ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')';".format(user_profile["username"], user_profile.get("name", user_profile["username"]), user_profile["password"], user_profile["email"], user_profile.get("location", "Sydney"), user_profile["type"], user_profile.get("description", "Nothing to show."), user_profile.get("photo", "None"))
    database_object.update(sql)
    database_object.close()

def get_user_info_by_username(username):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from user_info where username = '{}';".format(username)
    result = database_object.search(sql)
    database_object.close()
    result = convert_user_info(result)
    return result

def get_user_info_by_name(uname):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from user_info where uname like '%{}%'".format(uname)
    result = database_object.search(sql)
    database_object.close()
    result = convert_user_info(result)
    return result

def get_user_password(username):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select password from user_info where username = '{}';".format(username)
    result = database_object.search(sql)
    database_object.close()
    result = result[0][0]
    result.rstrip()
    return result

def change_user_info(username, field, new_data):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update user_info set {} = '{}' where username = '{}';".format(field, new_data, username)
    database_object.update(sql)
    database_object.close()

def change_user_password(username, new_password):
    change_user_info(username, "password", new_password)

def change_user_name(username, new_uname):
    change_user_info(username, "uname", new_uname)

def change_user_email(username, new_email):
    change_user_info(username, "email", new_email)

def change_user_type(username, type_code):
    change_user_info(username, "type", type_code)

def change_user_photo(username, photo_addr):
    change_user_info(username, "photo", photo_addr)

def change_user_location(username, new_location):
    change_user_info(username, "location", new_location)

def change_user_description(username, new_description):
    change_user_info(username, "description", new_description)

def create_skill(uuid, skill_name):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into skills values ('{}', '{}');".format(uuid, skill_name)
    database_object.update(sql)
    database_object.close()

def get_skill_name(uuid):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from skills where skill_id = '{}';".format(uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['id', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def get_all_skill():
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from skills;"
    result = database_object.search(sql)
    database_object.close()
    key_list = ['id', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def search_skill(skill_name):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from skills where skill_name like '%{}%';".format(skill_name)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['id', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def create_course(code, course_name):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into courses values ('{}', '{}');".format(code, course_name)
    database_object.update(sql)
    database_object.close()

def get_course_name(code):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from courses where code = '{}';".format(code)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['code', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def search_course(course_name):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from courses where course_name like '%{}%';".format(course_name)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['code', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def create_course_and_skill_link(course_code, skill_uuid, relevance = 1.0):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into course_and_skill values ('{}', '{}', {});".format(course_code, skill_uuid, relevance)
    database_object.update(sql)
    database_object.close()

def search_skill_by_course_code(course_code):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select s.* from course_and_skill cs, skills s where cs.code = '{}' and cs.skill_id = s.skill_id;".format(course_code)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['id', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def search_course_by_skill_uuid(skill_uuid):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select c.* from course_and_skill cs, courses c where cs.skill_id = '{}' and cs.code = c.code;".format(skill_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['code', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def search_skill_by_course_name(name):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select s.* from course_and_skill cs, skills s, courses c \
    where c.course_name like '%{}%' and c.code = cs.code and cs.skill_id = s.skill_id;".format(name)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['id', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def search_course_by_skill_name(name):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select c.* from course_and_skill cs, skills s, courses c \
    where s.skill_name like '%{}%' and c.code = cs.code and cs.skill_id = s.skill_id;".format(name)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['code', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def create_job_and_skill_link(job_uuid, skill_uuid, relevance = 1.0):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into job_and_skill values ('{}', '{}', {});".format(job_uuid, skill_uuid, relevance)
    database_object.update(sql)
    database_object.close()

def search_skill_by_job_uuid(job_uuid):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select s.* from job_and_skill js, skills s where js.job_id = '{}' and js.skill_id = s.skill_id;".format(job_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['id', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def search_job_by_skill_uuid(skill_uuid):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select j.* from job_and_skill js, job_title j where js.skill_id = '{}' and js.job_id = j.job_id;".format(skill_uuid)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['id', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def search_skill_by_job_title(name):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select s.* from job_and_skill js, skills s, job_title j \
    where j.job_name like '%{}%' and j.job_id = js.job_id and js.skill_id = s.skill_id;".format(name)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['id', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def search_job_by_skill_name(name):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select j.* from job_and_skill js, skills s, job_title j \
    where s.skill_name like '%{}%' and j.job_id = js.job_id and js.skill_id = s.skill_id;".format(name)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['id', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def add_course_to_list(username, code, certificat = 1):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into course_list values ('{}', '{}', {});".format(username, code, certificat)
    database_object.update(sql)
    database_object.close()

def get_course_list(username):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select c.* from course_list sl, courses c where sl.student_id = '{}' and sl.code = c.code;".format(username)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['code', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def delete_course_from_list(username, code):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from course_list where student_id = '{}' and code = '{}';".format(username, code)
    database_object.update(sql)
    database_object.close()

def create_resume(resume_uuid, username, address):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into resume values ('{}', '{}', '{}');".format(resume_uuid, username, address)
    database_object.update(sql)
    database_object.close()

def get_self_resume(username):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from resume where student_id = '{}';".format(username)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['id', 'username', 'address']
    result = convert_result_to_dict(result, key_list)
    return result

#TODO unfinished function
def search_resume():
    pass

def delete_resume(resume_uuid):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from resume where resume_id = '{}';".format(resume_uuid)
    database_object.update(sql)
    database_object.close()

def create_job_title(uuid, name):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into job_title values ('{}', '{}');".format(uuid, name)
    database_object.update(sql)
    database_object.close()

def search_job_title(name):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from job_title where job_name like '%{}%';".format(name)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['id', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def get_all_job_title():
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from job_title;"
    result = database_object.search(sql)
    database_object.close()
    key_list = ['id', 'name']
    result = convert_result_to_dict(result, key_list)
    return result

def get_job_info_by_job_uuid(job_uuid):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select j.job_name, ui.uname, ji.* from job_title j, job_info ji, uses_info ui where j.job_id = '{}' and j.job_id = ji.job_id and ji.company_id = ui.username;"
    result = database_object.search(sql)
    database_object.close()
    key_list = ['job_title', 'company_name', 'job_info_id', 'company_id', 'description', 'salary', 'address']
    result = convert_result_to_dict(result, key_list)
    return result

def create_job_info(info_uuid, job_uuid, company_id, address, description = "None", salary = 0):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into job_info values ('{}', '{}', '{}', '{}', '{}', '{}');".format(info_uuid, job_uuid, company_id, description, salary,address)
    database_object.update(sql)
    database_object.close()

def change_job_info_address(info_uuid, new_address):
    change_job_info(info_uuid, "address", new_address)

def change_job_info_title(info_uuid, new_title_uuid):
    change_job_info(info_uuid, "job_id", new_title_uuid)

def change_job_info_description(info_uuid, new_description):
    change_job_info(info_uuid, "description", new_description)

def change_job_info_salary(info_uuid, new_salary):
    change_job_info(info_uuid, "salary", new_salary)

def change_job_info(info_uuid, field, new_data):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update job_info set {} = '{}' where job_info_id = '{}';".format(field, new_data, info_uuid)
    database_object.update(sql)
    database_object.close()

def delete_job_info(info_uuid):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from job_info where job_info_id = '{}';".format(info_uuid)
    database_object.update(sql)
    database_object.close()

def send_resume(enrol_id, student_id, company_id, resume_id):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into enrolment values ('{}', '{}', '{}', '{}');".format(enrol_id, student_id, company_id, resume_id)
    database_object.update(sql)
    database_object.close()

def cancel_resume_send(enrol_id):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from enrolment where enrol_id = '{}';".format(enrol_id)
    database_object.update(sql)
    database_object.close()

def get_resume_list(company_id):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select enrol_id, student_id, resume_id from enrolment where company_id = '{}';".format(company_id)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['enrol_id', 'student_id', 'resume_id']
    result = convert_result_to_dict(result, key_list)
    return result

def create_education_exp(student_id, major, university, degree):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into education_exp values ('{}', '{}', '{}', '{}');".format(student_id, major, university, degree)
    database_object.update(sql)
    database_object.close()

def get_education_exp(student_id):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "select * from education_exp where student_id = '{}';".format(student_id)
    result = database_object.search(sql)
    database_object.close()
    key_list = ['student_id', 'major', 'university', 'degree']
    result = convert_result_to_dict(result, key_list)
    return result

def change_major(student_id, new_major):
    change_education_exp(student_id, "major", new_major)

def change_university(student_id, new_university):
    change_education_exp(student_id, "university", new_university)

def change_degree(student_id, new_degree):
    change_education_exp(student_id, "degree", new_degree)

def change_education_exp(student_id, field, new_data):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "update education_exp set {} = '{}' where student_id = '{}';".format(field, new_data, student_id)
    database_object.update(sql)
    database_object.close()

def delete_education_exp(student_id):
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "delete from education_exp where student_id = '{}';".format(student_id)
    database_object.update(sql)
    database_object.close()

def convert_result_to_dict(temp_result, key_list):
    result = list()
    for tuples in temp_result:
        temp_dict = {}
        for i in range(len(tuples)):
            temp_dict[key_list[i]] = tuples[i].rstrip()
        result.append(temp_dict)
    return result

def convert_user_info(temp_result):
    result = list()
    for temp_tuple in temp_result:
        temp_dict = {}
        temp_dict["username"] = temp_tuple[0].rstrip()
        temp_dict["name"] = temp_tuple[1].rstrip()
        temp_dict["email"] = temp_tuple[3].rstrip()
        temp_dict["location"] = temp_tuple[4]
        temp_dict["type"] = temp_tuple[5]
        temp_dict["description"] = temp_tuple[6].rstrip()
        temp_dict["photo"] = temp_tuple[7]
        result.append(temp_dict)
    return result

def create_test_data():
    dbconfig = {"dbname": "comp9900"}
    database_object = database_lib.Database_object(dbconfig)
    database_object.open()
    sql = "insert into user_info values ('test1','test1','123456','test1@abc.com', 'Sydney',1,'Nothing to show.','None');\
            insert into user_info values ('test2','test2','456789','test2@abc.com', 'Sydney',1, 'None','None');\
            insert into user_info values ('test3','test3','123789','test3@abc.com','Sydney',1, '404','None');\
            insert into skills values ('45a113ac-c7f2-30b0-90a5-a399ab912716', 'Java');\
            insert into skills values ('c501822b-22a8-37ff-91a9-9545f4689a3d', 'Python');\
            insert into job_title values ('f1917643-06b2-3e6d-ab77-0a5044067d0a', 'Network Engineering');\
            insert into job_title values ('bf7f1e5a-6b28-310c-8f9e-f815dbd56fb7', 'Software Engineering');\
            insert into courses values ('COMP9900', 'Information Technology Project');\
            insert into courses values ('COMP9323', 'Software as a Service Project');\
            insert into course_and_skill values ('COMP9900', 'c501822b-22a8-37ff-91a9-9545f4689a3d');\
            insert into job_and_skill values ('bf7f1e5a-6b28-310c-8f9e-f815dbd56fb7', 'c501822b-22a8-37ff-91a9-9545f4689a3d');\
            insert into course_list values ('test1', 'COMP9900', 1);"
    database_object.update(sql)
    database_object.close()

if __name__ == "__main__":
    # create_test_data()
    pass
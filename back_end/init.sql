-- Method to use
-- Open terminal in current directory
-- $ createdb comp9323
-- $ psql comp9323 -s
-- $ \i init.sql
-- and all tables will be create

CREATE TABLE user_info
(
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    gender text,
    dob text,
    user_type text NOT NULL,
    photo text,
    PRIMARY KEY (email)
);

CREATE TABLE groups
(
    group_uuid uuid NOT NULL,
    group_name text NOT NULL,
    project_uuid uuid NOT NULL,
    description text,
    mark integer,
    PRIMARY KEY (group_uuid)
);

CREATE TABLE group_relation
(
    email text NOT NULL,
    group_uuid uuid NOT NULL,
    mem_type integer NOT NULL,
    PRIMARY KEY (email, group_uuid)
);

CREATE TABLE managements
(
    email text NOT NULL,
    group_uuid uuid NOT NULL,
    PRIMARY KEY (email, group_uuid)
);

CREATE TABLE enrol_project
(
    email text NOT NULL,
    project_uuid uuid NOT NULL,
    user_type text NOT NULL,
    mark integer
);

CREATE TABLE projects
(
    project_uuid uuid NOT NULL,
    master text NOT NULL,
    project_name text NOT NULL,
    deadline timestamp(0) with time zone NOT NULL,
    mark_release timestamp(0) with time zone,
    spec_address text,
    PRIMARY KEY (project_uuid)
);

CREATE TABLE phases
(
    phase_uuid uuid NOT NULL,
    project_uuid uuid NOT NULL,
    phase_name text NOT NULL,
    deadline timestamp(0) with time zone NOT NULL,
    mark_release timestamp(0) with time zone,
    submit_require integer NOT NULL,
    spec_address text,
    PRIMARY KEY (phase_uuid)
);

CREATE TABLE tasks
(
    task_uuid uuid NOT NULL,
    phase_uuid uuid NOT NULL,
    task_name text NOT NULL,
    deadline timestamp(0) with time zone NOT NULL,
    mark_release timestamp(0) with time zone,
    submit_require integer NOT NULL,
    spec_address text,
    PRIMARY KEY (task_uuid)
);

CREATE TABLE submits
(
    submit_uuid uuid NOT NULL,
    group_uuid uuid NOT NULL,
    ass_uuid uuid NOT NULL,
    file_address text NOT NULL,
    submit_time timestamp(0) with time zone NOT NULL,
    mark integer,
    PRIMARY KEY (submit_uuid)
);

CREATE TABLE reminder
(
    reminder_uuid uuid NOT NULL,
    master text NOT NULL,
    project_uuid uuid NOT NULL,
    ass_uuid uuid NOT NULL,
    message text,
    submit_check text NOT NULL,
    post_time timestamp(0) with time zone NOT NULL,
    PRIMARY KEY (reminder_uuid)
);

CREATE TABLE addition_resource
(
    res_uuid uuid NOT NULL,
    master text NOT NULL,
    project_uuid uuid NOT NULL,
    phase_uuid uuid,
    filename text NOT NULL,
    description text NOT NULL,
    file_addr text NOT NULL,
    PRIMARY KEY (res_uuid)
);

insert into user_info values ('lecturer1@gmail.com', '123456', 'Emma', 'female', 'October 05', 'lecturer', 'None');
insert into user_info values ('lecturer2@gmail.com', '123456', 'James', 'male', 'October 05', 'lecturer', 'None');
insert into user_info values ('mentor1@gmail.com', '123456', 'Mary', 'female', 'October 05', 'mentor', 'None');
insert into user_info values ('mentor2@gmail.com', '123456', 'Allen', 'male', 'October 05', 'mentor', 'None');
insert into user_info values ('student1@gmail.com', '123456', 'Alex', 'male', 'October 05', 'student', 'None');
insert into user_info values ('student2@gmail.com', '123456', 'John', 'male', 'October 05', 'student', 'None');
insert into user_info values ('student3@gmail.com', '123456', 'Olivia', 'female', 'October 05', 'student', 'None');
insert into user_info values ('student4@gmail.com', '123456', 'Kevin', 'male', 'October 05', 'student', 'None');
insert into user_info values ('student5@gmail.com', '123456', 'Rose', 'female', 'October 05', 'student', 'None');
insert into user_info values ('student6@gmail.com', '123456', 'Jeanne', 'female', 'October 05', 'student', 'None');
insert into user_info values ('student7@gmail.com', '123456', 'Charles', 'male', 'October 05', 'student', 'None');
insert into user_info values ('student8@gmail.com', '123456', 'Shirley', 'female', 'October 05', 'student', 'None');
insert into user_info values ('student9@gmail.com', '123456', 'Robert', 'male', 'October 05', 'student', 'None');
insert into user_info values ('student10@gmail.com', '123456', 'Angel', 'female', 'October 05', 'student', 'None');

insert into projects values ('a5259728-c967-11e8-8220-4c3275989ef5', 'lecturer1@gmail.com', 'COMP9323 Project', '2018-10-20 23:59:59+0', '2018-10-25 00:00:00+0', 'None');
insert into phases values ('a528cb28-c967-11e8-9304-4c3275989ef5', 'a5259728-c967-11e8-8220-4c3275989ef5', 'Phase 1', '2018-10-11 23:59:59+0', '2018-10-13 00:00:00+0', 0, 'None');
insert into tasks values ('a529fd7a-c967-11e8-a7be-4c3275989ef5', 'a528cb28-c967-11e8-9304-4c3275989ef5', 'Proposal', '2018-10-11 23:59:59+0', '2018-10-13 00:00:00+0', 1, 'None');
insert into phases values ('a52b99de-c967-11e8-9bd2-4c3275989ef5', 'a5259728-c967-11e8-8220-4c3275989ef5', 'Phase 2', '2018-10-13 23:59:59+0', '2018-10-15 00:00:00+0', 0, 'None');
insert into tasks values ('a52cf4be-c967-11e8-8b38-4c3275989ef5', 'a52b99de-c967-11e8-9bd2-4c3275989ef5', 'Requirement document', '2018-10-13 23:59:59+0', '2018-10-15 00:00:00+0', 1, 'None');
insert into tasks values ('2733b150-c9ea-11e8-94ac-4c3275989ef5', 'a52b99de-c967-11e8-9bd2-4c3275989ef5', 'Design document', '2018-10-13 23:59:59+0', '2018-10-15 00:00:00+0', 1, 'None');
insert into phases values ('a52e00d4-c967-11e8-8949-4c3275989ef5', 'a5259728-c967-11e8-8220-4c3275989ef5', 'Phase 3', '2018-10-15 23:59:59+0', '2018-10-17 00:00:00+0', 0, 'None');
insert into tasks values ('a52fa206-c967-11e8-989a-4c3275989ef5', 'a52e00d4-c967-11e8-8949-4c3275989ef5', 'Implementation', '2018-10-15 23:59:59+0', '2018-10-17 00:00:00+0', 1, 'None');
insert into phases values ('a53111fa-c967-11e8-93b0-4c3275989ef5', 'a5259728-c967-11e8-8220-4c3275989ef5', 'Phase 4', '2018-10-17 23:59:59+0', '2018-10-20 00:00:00+0', 0, 'None');
insert into tasks values ('a53257cc-c967-11e8-9495-4c3275989ef5', 'a53111fa-c967-11e8-93b0-4c3275989ef5', 'Demo', '2018-10-17 23:59:59+0', '2018-10-20 00:00:00+0', 1, 'None');

insert into projects values ('04a676cc-c968-11e8-b2f6-4c3275989ef5', 'lecturer2@gmail.com', 'COMP9900 Project', '2018-10-20 23:59:59+0', '2018-10-25 00:00:00+0', 'None');
insert into phases values ('04aabee4-c968-11e8-8dc6-4c3275989ef5', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'Phase 1', '2018-10-11 23:59:59+0', '2018-10-13 00:00:00+0', 0, 'None');
insert into tasks values ('04ac2358-c968-11e8-a538-4c3275989ef5', '04aabee4-c968-11e8-8dc6-4c3275989ef5', 'Proposal', '2018-10-11 23:59:59+0', '2018-10-13 00:00:00+0', 1, 'None');
insert into phases values ('04adb2b6-c968-11e8-9522-4c3275989ef5', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'Phase 2', '2018-10-13 23:59:59+0', '2018-10-15 00:00:00+0', 0, 'None');
insert into tasks values ('04afe482-c968-11e8-8423-4c3275989ef5', '04adb2b6-c968-11e8-9522-4c3275989ef5', 'Requirement document & Design document', '2018-10-13 23:59:59+0', '2018-10-15 00:00:00+0', 1, 'None');
insert into phases values ('04b1cd58-c968-11e8-8192-4c3275989ef5', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'Phase 3', '2018-10-15 23:59:59+0', '2018-10-17 00:00:00+0', 0, 'None');
insert into tasks values ('04b30358-c968-11e8-802b-4c3275989ef5', '04b1cd58-c968-11e8-8192-4c3275989ef5', 'Implementation', '2018-10-15 23:59:59+0', '2018-10-17 00:00:00+0', 1, 'None');
insert into phases values ('04b4dac8-c968-11e8-bc21-4c3275989ef5', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'Phase 4', '2018-10-17 23:59:59+0', '2018-10-20 00:00:00+0', 0, 'None');
insert into tasks values ('04b6bc30-c968-11e8-af25-4c3275989ef5', '04b4dac8-c968-11e8-bc21-4c3275989ef5', 'Demo', '2018-10-17 23:59:59+0', '2018-10-20 00:00:00+0', 1, 'None');

insert into enrol_project (email, project_uuid, user_type) values ('student1@gmail.com', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'student');
insert into enrol_project (email, project_uuid, user_type) values ('student2@gmail.com', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'student');
insert into enrol_project (email, project_uuid, user_type) values ('student3@gmail.com', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'student');
insert into enrol_project (email, project_uuid, user_type) values ('student4@gmail.com', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'student');
insert into enrol_project (email, project_uuid, user_type) values ('student5@gmail.com', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'student');
insert into enrol_project (email, project_uuid, user_type) values ('student6@gmail.com', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'student');
insert into enrol_project (email, project_uuid, user_type) values ('student7@gmail.com', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'student');
insert into enrol_project (email, project_uuid, user_type) values ('student8@gmail.com', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'student');
insert into enrol_project (email, project_uuid, user_type) values ('student9@gmail.com', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'student');

insert into groups (group_uuid, group_name, project_uuid, description) values ('04b9e23e-c968-11e8-87f5-4c3275989ef5', 'Group 1', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'None');
insert into group_relation values ('student1@gmail.com', '04b9e23e-c968-11e8-87f5-4c3275989ef5', 0);
insert into group_relation values ('student2@gmail.com', '04b9e23e-c968-11e8-87f5-4c3275989ef5', 1);
insert into group_relation values ('student3@gmail.com', '04b9e23e-c968-11e8-87f5-4c3275989ef5', 1);

insert into groups (group_uuid, group_name, project_uuid, description) values ('caf594d4-c968-11e8-badd-4c3275989ef5', 'Group 2', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'None');
insert into group_relation values ('student4@gmail.com', 'caf594d4-c968-11e8-badd-4c3275989ef5', 0);
insert into group_relation values ('student5@gmail.com', 'caf594d4-c968-11e8-badd-4c3275989ef5', 1);
insert into group_relation values ('student6@gmail.com', 'caf594d4-c968-11e8-badd-4c3275989ef5', 1);

insert into groups (group_uuid, group_name, project_uuid, description) values ('05c5f5d8-c969-11e8-91ee-4c3275989ef5', 'Group 3', '04a676cc-c968-11e8-b2f6-4c3275989ef5', 'None');
insert into group_relation values ('student7@gmail.com', '05c5f5d8-c969-11e8-91ee-4c3275989ef5', 0);
insert into group_relation values ('student8@gmail.com', '05c5f5d8-c969-11e8-91ee-4c3275989ef5', 1);
insert into group_relation values ('student9@gmail.com', '05c5f5d8-c969-11e8-91ee-4c3275989ef5', 1);


insert into enrol_project (email, project_uuid, user_type) values ('student10@gmail.com', 'a5259728-c967-11e8-8220-4c3275989ef5', 'student');
insert into groups (group_uuid, group_name, project_uuid, description) values ('a5351b8a-c967-11e8-aca2-4c3275989ef5', 'First Group', 'a5259728-c967-11e8-8220-4c3275989ef5', 'None');
insert into group_relation values ('student10@gmail.com', 'a5351b8a-c967-11e8-aca2-4c3275989ef5', 0);
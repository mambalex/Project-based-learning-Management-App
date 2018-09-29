-- Method to use
-- Open terminal in current directory
-- $ createdb comp9900
-- $ psql comp9900 -s
-- $ \i init.sql
-- and all tables will be create

CREATE TABLE user_info
{
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    user_type integer NOT NULL,
    photo text,
    PRIMARY KEY (email)
};

CREATE TABLE groups
(
    group_uuid uuid NOT NULL,
    group_name text NOT NULL,
    project_uuid uuid NOT NULL,
    mark integer,
    PRIMARY KEY (group_uuid)
);

CREATE TABLE group_relation
(
    email text NOT NULL,
    group_uuid uuid NOT NULL,
    mem_type integer NOT NULL,
    PRIMARY KEY (user_id, group_uuid)
);

CREATE TABLE managements
(
    email text NOT NULL,
    group_uuid uuid NOT NULL,
    PRIMARY KEY (user_id, group_uuid)
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
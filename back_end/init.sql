-- Method to use
-- Open terminal in current directory
-- $ createdb comp9900
-- $ psql comp9900 -s
-- $ \i init.sql
-- and all tables will be create

CREATE TABLE admin_user
(
    user_id character varying(40) NOT NULL,
    password character varying(40) NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    type integer NOT NULL,
    photo text,
    PRIMARY KEY (user_id)
);

CREATE TABLE students
(
    user_id character varying(40) NOT NULL,
    password character varying(40) NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    mark integer,
    photo text,
    PRIMARY KEY (user_id)
);

CREATE TABLE groups
(
    group_uuid uuid NOT NULL,
    name text NOT NULL,
    project_uuid uuid NOT NULL,
    mark integer,
    PRIMARY KEY (group_uuid)
);

CREATE TABLE group_relation
(
    user_id character varying(40) NOT NULL,
    group_uuid uuid NOT NULL,
    type integer NOT NULL,
    PRIMARY KEY (user_id, group_uuid)
);

CREATE TABLE managements
(
    user_id character varying(40) NOT NULL,
    group_uuid uuid NOT NULL,
    PRIMARY KEY (user_id, group_uuid)
);

CREATE TABLE projects
(
    project_uuid uuid NOT NULL,
    master character varying(40) NOT NULL,
    name text NOT NULL,
    deadline timestamp(0) with time zone NOT NULL,
    mark_release timestamp(0) with time zone,
    address text,
    PRIMARY KEY (project_uuid)
);

CREATE TABLE phases
(
    phase_uuid uuid NOT NULL,
    project_uuid uuid NOT NULL,
    name text NOT NULL,
    deadline timestamp(0) with time zone NOT NULL,
    mark_release timestamp(0) with time zone,
    submit_require integer NOT NULL,
    address text,
    PRIMARY KEY (phase_uuid)
);

CREATE TABLE tasks
(
    task_uuid uuid NOT NULL,
    phase_uuid uuid NOT NULL,
    name text NOT NULL,
    deadline timestamp(0) with time zone NOT NULL,
    mark_release timestamp(0) with time zone,
    submit_require integer NOT NULL,
    address text,
    PRIMARY KEY (task_uuid)
);

CREATE TABLE submits
(
    submit_uuid uuid NOT NULL,
    group_uuid uuid NOT NULL,
    ass_uuid uuid NOT NULL,
    address text NOT NULL,
    submit_time timestamp(0) with time zone NOT NULL,
    mark integer,
    PRIMARY KEY (submit_uuid)
);
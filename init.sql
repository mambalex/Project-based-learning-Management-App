--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4
-- Dumped by pg_dump version 10.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: addition_resource; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addition_resource (
    res_uuid uuid NOT NULL,
    master text NOT NULL,
    project_uuid uuid NOT NULL,
    phase_uuid uuid,
    filename text NOT NULL,
    description text NOT NULL,
    file_addr text NOT NULL
);


--
-- Name: enrol_project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enrol_project (
    email text NOT NULL,
    project_uuid uuid NOT NULL,
    user_type text NOT NULL,
    mark integer
);


--
-- Name: group_relation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_relation (
    email text NOT NULL,
    group_uuid uuid NOT NULL,
    mem_type integer NOT NULL
);


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    group_uuid uuid NOT NULL,
    group_name text NOT NULL,
    project_uuid uuid NOT NULL,
    description text,
    mark double precision
);


--
-- Name: managements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.managements (
    email text NOT NULL,
    group_uuid uuid NOT NULL
);


--
-- Name: phases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.phases (
    phase_uuid uuid NOT NULL,
    project_uuid uuid NOT NULL,
    phase_index integer NOT NULL,
    phase_name text NOT NULL,
    deadline timestamp(0) with time zone NOT NULL,
    mark_release timestamp(0) with time zone,
    submit_require integer NOT NULL,
    spec_address text
);


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    project_uuid uuid NOT NULL,
    master text NOT NULL,
    project_name text NOT NULL,
    deadline timestamp(0) with time zone NOT NULL,
    mark_release timestamp(0) with time zone,
    spec_address text,
    group_method integer NOT NULL
);


--
-- Name: reminder; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reminder (
    reminder_uuid uuid NOT NULL,
    master text NOT NULL,
    project_uuid uuid NOT NULL,
    ass_uuid uuid NOT NULL,
    message text,
    submit_check text NOT NULL,
    post_time timestamp(0) with time zone NOT NULL
);


--
-- Name: submits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.submits (
    submit_uuid uuid NOT NULL,
    group_uuid uuid NOT NULL,
    ass_uuid uuid NOT NULL,
    file_address text NOT NULL,
    submit_time timestamp(0) with time zone NOT NULL,
    mark double precision
);


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    task_uuid uuid NOT NULL,
    phase_uuid uuid NOT NULL,
    task_name text NOT NULL,
    deadline timestamp(0) with time zone NOT NULL,
    mark_release timestamp(0) with time zone,
    submit_require integer NOT NULL,
    spec_address text
);


--
-- Name: user_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_info (
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    gender text,
    dob text,
    user_type text NOT NULL,
    photo text
);


--
-- Data for Name: addition_resource; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.addition_resource (res_uuid, master, project_uuid, phase_uuid, filename, description, file_addr) FROM stdin;
\.


--
-- Data for Name: enrol_project; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.enrol_project (email, project_uuid, user_type, mark) FROM stdin;
student1@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
student2@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
student3@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
student4@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
student5@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
student6@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
student7@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
student8@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
student9@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
student10@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
lam@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
martin@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
gelbero@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
thomas@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
roy@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
tremblay@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
byrne@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
brown@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
linda@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
barbara@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
susan@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
margaret@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
jessica@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
sarah@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
murphy@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
jones@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
williams@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
taylor@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
davies@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
wilson@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
evans@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
roberts@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
smith@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
walsh@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
noah@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
jack@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
harry@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
jacob@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
charlie@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
george@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
oscar@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
james@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
william@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
connor@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
callum@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
kyle@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
joe@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
reece@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
rhys@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
damian@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
liam@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
mason@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
ethan@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
michael@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
alexander@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
daniel@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
john@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
robert@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
david@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	student	\N
student1@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	student	\N
\.


--
-- Data for Name: group_relation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.group_relation (email, group_uuid, mem_type) FROM stdin;
student10@gmail.com	a5351b8a-c967-11e8-aca2-4c3275989ef5	0
lam@gmail.com	115b390f-f50e-4a39-9002-8bb160e2e476	0
martin@gmail.com	115b390f-f50e-4a39-9002-8bb160e2e476	1
gelbero@gmail.com	115b390f-f50e-4a39-9002-8bb160e2e476	1
thomas@gmail.com	370f053f-68db-4d2e-975b-bc566eed449a	0
roy@gmail.com	370f053f-68db-4d2e-975b-bc566eed449a	1
tremblay@gmail.com	370f053f-68db-4d2e-975b-bc566eed449a	1
byrne@gmail.com	d59ee857-c394-420d-9d49-ad160448b676	0
brown@gmail.com	d59ee857-c394-420d-9d49-ad160448b676	1
linda@gmail.com	d59ee857-c394-420d-9d49-ad160448b676	1
murphy@gmail.com	1aadf9c6-123b-4090-b209-ece1891e4467	0
evans@gmail.com	1aadf9c6-123b-4090-b209-ece1891e4467	1
wilson@gmail.com	1aadf9c6-123b-4090-b209-ece1891e4467	1
barbara@gmail.com	370f053f-68db-4d2e-975b-bc566eed449a	1
susan@gmail.com	370f053f-68db-4d2e-975b-bc566eed449a	1
margaret@gmail.com	115b390f-f50e-4a39-9002-8bb160e2e476	1
jessica@gmail.com	115b390f-f50e-4a39-9002-8bb160e2e476	1
sarah@gmail.com	370f053f-68db-4d2e-975b-bc566eed449a	1
jones@gmail.com	370f053f-68db-4d2e-975b-bc566eed449a	1
williams@gmail.com	370f053f-68db-4d2e-975b-bc566eed449a	1
taylor@gmail.com	d59ee857-c394-420d-9d49-ad160448b676	1
davies@gmail.com	1aadf9c6-123b-4090-b209-ece1891e4467	1
roberts@gmail.com	a5351b8a-c967-11e8-aca2-4c3275989ef5	1
smith@gmail.com	a5351b8a-c967-11e8-aca2-4c3275989ef5	1
student1@gmail.com	a5351b8a-c967-11e8-aca2-4c3275989ef5	1
connor@gmail.com	ed4773ec-d681-11e8-8421-4c32759e2eb9	1
joe@gmail.com	ed4773ec-d681-11e8-8421-4c32759e2eb9	1
noah@gmail.com	ed4773ec-d681-11e8-8421-4c32759e2eb9	1
student2@gmail.com	ed4773ec-d681-11e8-8421-4c32759e2eb9	1
charlie@gmail.com	ed47fb3a-d681-11e8-8c00-4c32759e2eb9	1
jacob@gmail.com	ed47fb3a-d681-11e8-8c00-4c32759e2eb9	1
george@gmail.com	ed47fb3a-d681-11e8-8c00-4c32759e2eb9	1
student6@gmail.com	ed47fb3a-d681-11e8-8c00-4c32759e2eb9	1
oscar@gmail.com	ed488f28-d681-11e8-9944-4c32759e2eb9	1
michael@gmail.com	ed488f28-d681-11e8-9944-4c32759e2eb9	1
jack@gmail.com	ed488f28-d681-11e8-9944-4c32759e2eb9	1
student3@gmail.com	ed488f28-d681-11e8-9944-4c32759e2eb9	1
damian@gmail.com	ed490c70-d681-11e8-b7b3-4c32759e2eb9	1
john@gmail.com	ed490c70-d681-11e8-b7b3-4c32759e2eb9	1
rhys@gmail.com	ed490c70-d681-11e8-b7b3-4c32759e2eb9	1
kyle@gmail.com	ed490c70-d681-11e8-b7b3-4c32759e2eb9	1
ethan@gmail.com	ed490c70-d681-11e8-b7b3-4c32759e2eb9	1
harry@gmail.com	ed498308-d681-11e8-96c1-4c32759e2eb9	1
student5@gmail.com	ed498308-d681-11e8-96c1-4c32759e2eb9	1
william@gmail.com	ed498308-d681-11e8-96c1-4c32759e2eb9	1
walsh@gmail.com	ed498308-d681-11e8-96c1-4c32759e2eb9	1
student4@gmail.com	ed49e424-d681-11e8-9da0-4c32759e2eb9	1
student8@gmail.com	ed49e424-d681-11e8-9da0-4c32759e2eb9	1
alexander@gmail.com	ed49e424-d681-11e8-9da0-4c32759e2eb9	1
robert@gmail.com	ed49e424-d681-11e8-9da0-4c32759e2eb9	1
liam@gmail.com	ed4a42b6-d681-11e8-988d-4c32759e2eb9	1
student9@gmail.com	ed4a42b6-d681-11e8-988d-4c32759e2eb9	1
student7@gmail.com	ed4a42b6-d681-11e8-988d-4c32759e2eb9	1
david@gmail.com	ed4a42b6-d681-11e8-988d-4c32759e2eb9	1
callum@gmail.com	ed4a42b6-d681-11e8-988d-4c32759e2eb9	1
james@gmail.com	ed4aeedc-d681-11e8-97f8-4c32759e2eb9	1
reece@gmail.com	ed4aeedc-d681-11e8-97f8-4c32759e2eb9	1
mason@gmail.com	ed4aeedc-d681-11e8-97f8-4c32759e2eb9	1
daniel@gmail.com	ed4aeedc-d681-11e8-97f8-4c32759e2eb9	1
student1@gmail.com	ed47fb3a-d681-11e8-8c00-4c32759e2eb9	1
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.groups (group_uuid, group_name, project_uuid, description, mark) FROM stdin;
115b390f-f50e-4a39-9002-8bb160e2e476	Club Win.	04a676cc-c968-11e8-b2f6-4c3275989ef5	Fight coding!	\N
370f053f-68db-4d2e-975b-bc566eed449a	Hustle & Flo.	04a676cc-c968-11e8-b2f6-4c3275989ef5	Fight coding!	\N
d59ee857-c394-420d-9d49-ad160448b676	Mental Toss Flycoons.	04a676cc-c968-11e8-b2f6-4c3275989ef5	New star	\N
1aadf9c6-123b-4090-b209-ece1891e4467	Wonder Women.	04a676cc-c968-11e8-b2f6-4c3275989ef5	fire on the hole	\N
a5351b8a-c967-11e8-aca2-4c3275989ef5	First Group	04a676cc-c968-11e8-b2f6-4c3275989ef5	MEAN stack	\N
ed4773ec-d681-11e8-8421-4c32759e2eb9	Group 1	a5259728-c967-11e8-8220-4c3275989ef5	COMP9323 Project group 1	\N
ed47fb3a-d681-11e8-8c00-4c32759e2eb9	Group 2	a5259728-c967-11e8-8220-4c3275989ef5	COMP9323 Project group 2	\N
ed488f28-d681-11e8-9944-4c32759e2eb9	Group 3	a5259728-c967-11e8-8220-4c3275989ef5	COMP9323 Project group 3	\N
ed490c70-d681-11e8-b7b3-4c32759e2eb9	Group 4	a5259728-c967-11e8-8220-4c3275989ef5	COMP9323 Project group 4	\N
ed498308-d681-11e8-96c1-4c32759e2eb9	Group 5	a5259728-c967-11e8-8220-4c3275989ef5	COMP9323 Project group 5	\N
ed49e424-d681-11e8-9da0-4c32759e2eb9	Group 6	a5259728-c967-11e8-8220-4c3275989ef5	COMP9323 Project group 6	\N
ed4a42b6-d681-11e8-988d-4c32759e2eb9	Group 7	a5259728-c967-11e8-8220-4c3275989ef5	COMP9323 Project group 7	\N
ed4aeedc-d681-11e8-97f8-4c32759e2eb9	Group 8	a5259728-c967-11e8-8220-4c3275989ef5	COMP9323 Project group 8	\N
\.


--
-- Data for Name: managements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.managements (email, group_uuid) FROM stdin;
\.


--
-- Data for Name: phases; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.phases (phase_uuid, project_uuid, phase_index, phase_name, deadline, mark_release, submit_require, spec_address) FROM stdin;
04aabee4-c968-11e8-8dc6-4c3275989ef5	04a676cc-c968-11e8-b2f6-4c3275989ef5	1	Project Scoping & Group forming	2018-10-12 10:59:59+11	2018-10-13 11:00:00+11	0	None
a528cb28-c967-11e8-9304-4c3275989ef5	a5259728-c967-11e8-8220-4c3275989ef5	1	Initiation	2018-10-21 10:59:59+11	2018-10-21 11:00:00+11	0	None
a52b99de-c967-11e8-9bd2-4c3275989ef5	a5259728-c967-11e8-8220-4c3275989ef5	2	Planning	2018-10-26 10:59:59+11	2018-10-26 11:00:00+11	0	None
a52e00d4-c967-11e8-8949-4c3275989ef5	a5259728-c967-11e8-8220-4c3275989ef5	3	Execution	2018-10-30 10:59:59+11	2018-10-30 11:00:00+11	0	None
a53111fa-c967-11e8-93b0-4c3275989ef5	a5259728-c967-11e8-8220-4c3275989ef5	4	Closure	2018-11-03 10:59:59+11	2018-11-05 11:00:00+11	0	None
04adb2b6-c968-11e8-9522-4c3275989ef5	04a676cc-c968-11e8-b2f6-4c3275989ef5	2	Requirement document & Design document	2018-10-14 10:59:59+11	2018-10-15 11:00:00+11	0	None
04b1cd58-c968-11e8-8192-4c3275989ef5	04a676cc-c968-11e8-b2f6-4c3275989ef5	3	Software prototyping & Implementation	2018-10-16 10:59:59+11	2018-10-17 11:00:00+11	0	None
04b4dac8-c968-11e8-bc21-4c3275989ef5	04a676cc-c968-11e8-b2f6-4c3275989ef5	4	Implementation & Testing & Documentation	2018-10-18 10:59:59+11	2018-10-20 11:00:00+11	0	None
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (project_uuid, master, project_name, deadline, mark_release, spec_address, group_method) FROM stdin;
04a676cc-c968-11e8-b2f6-4c3275989ef5	lecturer2@gmail.com	COMP9900 Project	2018-10-21 10:59:59+11	2018-10-25 11:00:00+11	None	0
a5259728-c967-11e8-8220-4c3275989ef5	lecturer1@gmail.com	COMP9323 Project	2018-10-21 10:59:59+11	2018-10-25 11:00:00+11	None	1
\.


--
-- Data for Name: reminder; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reminder (reminder_uuid, master, project_uuid, ass_uuid, message, submit_check, post_time) FROM stdin;
e6aef29a-ca23-11e8-8c13-4c3275989ef5	lecturer1@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	a529fd7a-c967-11e8-a7be-4c3275989ef5	Task one proposal due soon.	no	2018-10-17 22:26:57+11
e6b15800-ca23-11e8-be86-4c3275989ef5	lecturer1@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	a529fd7a-c967-11e8-a7be-4c3275989ef5	Task one proposal due soon, you have not submit.	yes	2018-10-17 22:26:57+11
5cc5cde1-b608-4dde-ae8e-7583164fb808	lecturer1@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	a53257cc-c967-11e8-9495-4c3275989ef5	Task closed, no more submission accpected	yes	2018-10-20 22:26:57+11
450a43be-0c38-41eb-9ca4-3ebae905b736	lecturer1@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	a53257cc-c967-11e8-9495-4c3275989ef5	Excels at developing programs	yes	2018-10-20 22:26:57+11
610273b7-3100-42a4-a2a9-c7e6d95fac62	lecturer1@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	a53257cc-c967-11e8-9495-4c3275989ef5	Keeps documents organized via google drive to avoid duplicate information	yes	2018-10-12 22:26:57+11
b6c36550-d678-11e8-a5a6-4c32759e2eb9	lecturer2@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	04a676cc-c968-11e8-b2f6-4c3275989ef5	Welcome to COMP3900 (Computer Science Project) / COMP9900 (Information Technology Project). See you all in our first lecture on Tuesday 24 July 2018 at 10am in Chemical Sc M18 (K-F10-M18).	no	2018-10-09 10:59:59+11
8527db3a-d677-11e8-bb3e-4c32759e2eb9	lecturer2@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	04ac2358-c968-11e8-a538-4c3275989ef5	This is to let you know of the following: I just added the sample project proposal I discussed in the class to the Week 2 lecture slides. You have now two project proposal samples. These are by no means perfect. You should aim at doing better than that. Please have a look at them by opening the updated lecture Week 2 slides. Secondly, the Project Proposal Submission link is now available. Please see the right part of the course website on WebCMS3 for Upcoming Due Dates. There is one item "Project Proposal Submission" which is due 11-10-2018.	yes	2018-10-11 10:59:59+11
b50ad708-d677-11e8-8c6d-4c32759e2eb9	lecturer2@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	04afe482-c968-11e8-8423-4c3275989ef5	This is to let you know that extra useful information about Topic 2 (e-portfolio) has been provided. You can find it under Project>Topics.\nPlease do have a look at this important information while working on your project proposal.\nIf you have any questions, please post them in the Forums under Project/Topics/Topic 2. 	no	2018-10-12 10:59:59+11
07883426-d678-11e8-8307-4c32759e2eb9	lecturer2@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	04b30358-c968-11e8-802b-4c3275989ef5	No COMP3900/COMP9900 Labs on 14-10-2018\nInformation about make-up sessions for M16A and M18A teams (some sessions are also open to T16A) is posted.	no	2018-10-14 10:59:59+11
2b786536-d678-11e8-92d5-4c32759e2eb9	lecturer2@gmail.com	04a676cc-c968-11e8-b2f6-4c3275989ef5	04b6bc30-c968-11e8-af25-4c3275989ef5	Dear Students,\nThis is a gentle reminder of Project final Demo Starting from Mon15, Oct 2018. The Demo Schedule can be found in resource tab.\nSubmission links are up, please read the submission instructions carefully.\nGood Luck	no	2018-10-17 10:59:59+11
5e6c4ec2-5d7c-44e0-a0cf-1d948df8afe3	lecturer1@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	a5259728-c967-11e8-8220-4c3275989ef5	Phase modification, read instructions.	no	2018-10-09 22:26:57+11
f0891b0e-d920-4993-9e5a-d27f470c5f8e	lecturer1@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	a5259728-c967-11e8-8220-4c3275989ef5	Achieves optimal levels of performance and accomplishment 	no	2018-10-10 22:26:57+11
be980096-58c0-4664-b600-4f40833013ec	lecturer1@gmail.com	a5259728-c967-11e8-8220-4c3275989ef5	a5259728-c967-11e8-8220-4c3275989ef5	Exceeded the original goal of TASK by 80% through methods given in class	no	2018-10-11 22:26:57+11
\.


--
-- Data for Name: submits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.submits (submit_uuid, group_uuid, ass_uuid, file_address, submit_time, mark) FROM stdin;
6a1a77ae-d680-11e8-bdc8-4c32759e2eb9	a5351b8a-c967-11e8-aca2-4c3275989ef5	04b6bc30-c968-11e8-af25-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270765.pdf	2018-10-23 15:59:25+11	84
77df641c-d680-11e8-9a9a-4c32759e2eb9	115b390f-f50e-4a39-9002-8bb160e2e476	04b30358-c968-11e8-802b-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270789.pdf	2018-10-23 15:59:49+11	40
d191b3f4-d67b-11e8-a870-4c32759e2eb9	370f053f-68db-4d2e-975b-bc566eed449a	04ac2358-c968-11e8-a538-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540268792.pdf	2018-10-23 15:26:32+11	60
f6e17502-d67b-11e8-a72b-4c32759e2eb9	d59ee857-c394-420d-9d49-ad160448b676	04ac2358-c968-11e8-a538-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540269072.pdf	2018-10-23 15:31:12+11	74
9acdff64-d67c-11e8-8afe-4c32759e2eb9	1aadf9c6-123b-4090-b209-ece1891e4467	04ac2358-c968-11e8-a538-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540269129.pdf	2018-10-23 15:32:09+11	81
693da730-d67a-11e8-b4a9-4c32759e2eb9	a5351b8a-c967-11e8-aca2-4c3275989ef5	04ac2358-c968-11e8-a538-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540268187.pdf	2018-10-23 15:16:27+11	90
b87e4986-d67b-11e8-8b5b-4c32759e2eb9	115b390f-f50e-4a39-9002-8bb160e2e476	04ac2358-c968-11e8-a538-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540268749.pdf	2018-10-23 15:25:49+11	90
14776e1a-d680-11e8-9121-4c32759e2eb9	115b390f-f50e-4a39-9002-8bb160e2e476	04afe482-c968-11e8-8423-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270622.pdf	2018-10-23 15:57:02+11	74
250c324c-d680-11e8-bad9-4c32759e2eb9	370f053f-68db-4d2e-975b-bc566eed449a	04afe482-c968-11e8-8423-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270650.pdf	2018-10-23 15:57:30+11	69
34b44a06-d680-11e8-8c16-4c32759e2eb9	d59ee857-c394-420d-9d49-ad160448b676	04afe482-c968-11e8-8423-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270676.pdf	2018-10-23 15:57:56+11	80
449e72b4-d680-11e8-b017-4c32759e2eb9	1aadf9c6-123b-4090-b209-ece1891e4467	04afe482-c968-11e8-8423-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270703.pdf	2018-10-23 15:58:23+11	76
04daef0c-d680-11e8-8a4e-4c32759e2eb9	a5351b8a-c967-11e8-aca2-4c3275989ef5	04afe482-c968-11e8-8423-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270596.pdf	2018-10-23 15:56:36+11	86
ad5d5fde-d682-11e8-96f4-4c32759e2eb9	ed49e424-d681-11e8-9da0-4c32759e2eb9	a529fd7a-c967-11e8-a7be-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271737.pdf	2018-10-23 16:15:37+11	74
911d39f4-d680-11e8-b333-4c32759e2eb9	370f053f-68db-4d2e-975b-bc566eed449a	04b30358-c968-11e8-802b-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270831.pdf	2018-10-23 16:00:31+11	75
c7e53630-d680-11e8-be6f-4c32759e2eb9	d59ee857-c394-420d-9d49-ad160448b676	04b30358-c968-11e8-802b-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270923.pdf	2018-10-23 16:02:03+11	69
4c141f8a-d680-11e8-a2a5-4c32759e2eb9	1aadf9c6-123b-4090-b209-ece1891e4467	04b30358-c968-11e8-802b-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270715.pdf	2018-10-23 15:58:35+11	73
61dc4cde-d680-11e8-8060-4c32759e2eb9	a5351b8a-c967-11e8-aca2-4c3275989ef5	04b30358-c968-11e8-802b-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270752.pdf	2018-10-23 15:59:12+11	87
7db6101e-d680-11e8-a2b4-4c32759e2eb9	115b390f-f50e-4a39-9002-8bb160e2e476	04b6bc30-c968-11e8-af25-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270798.pdf	2018-10-23 15:59:58+11	55
9a1510e8-d680-11e8-b1f5-4c32759e2eb9	370f053f-68db-4d2e-975b-bc566eed449a	04b6bc30-c968-11e8-af25-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270846.pdf	2018-10-23 16:00:46+11	67
cefafba8-d680-11e8-91c2-4c32759e2eb9	d59ee857-c394-420d-9d49-ad160448b676	04b6bc30-c968-11e8-af25-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270935.pdf	2018-10-23 16:02:15+11	72
5264e068-d680-11e8-b31e-4c32759e2eb9	1aadf9c6-123b-4090-b209-ece1891e4467	04b6bc30-c968-11e8-af25-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540270726.pdf	2018-10-23 15:58:46+11	76
2c5681c2-d682-11e8-903f-4c32759e2eb9	ed4773ec-d681-11e8-8421-4c32759e2eb9	a52cf4be-c967-11e8-8b38-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271521.pdf	2018-10-23 16:12:01+11	\N
321bff7e-d682-11e8-8589-4c32759e2eb9	ed4773ec-d681-11e8-8421-4c32759e2eb9	2733b150-c9ea-11e8-94ac-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271530.pdf	2018-10-23 16:12:10+11	\N
558f12c0-d682-11e8-8774-4c32759e2eb9	ed47fb3a-d681-11e8-8c00-4c32759e2eb9	2733b150-c9ea-11e8-94ac-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271590.pdf	2018-10-23 16:13:10+11	\N
6a7b7c50-d682-11e8-941f-4c32759e2eb9	ed488f28-d681-11e8-9944-4c32759e2eb9	a52cf4be-c967-11e8-8b38-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271625.pdf	2018-10-23 16:13:45+11	\N
833c01d8-d682-11e8-b5f2-4c32759e2eb9	ed490c70-d681-11e8-b7b3-4c32759e2eb9	2733b150-c9ea-11e8-94ac-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271667.pdf	2018-10-23 16:14:27+11	\N
89f95bf6-d682-11e8-8d45-4c32759e2eb9	ed490c70-d681-11e8-b7b3-4c32759e2eb9	a52cf4be-c967-11e8-8b38-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271678.pdf	2018-10-23 16:14:38+11	\N
b2aa907e-d682-11e8-a834-4c32759e2eb9	ed49e424-d681-11e8-9da0-4c32759e2eb9	a52cf4be-c967-11e8-8b38-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271746.pdf	2018-10-23 16:15:46+11	\N
2568fb7e-d682-11e8-9195-4c32759e2eb9	ed4773ec-d681-11e8-8421-4c32759e2eb9	a529fd7a-c967-11e8-a7be-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271509.pdf	2018-10-23 16:11:49+11	55
4ec88c98-d682-11e8-b96d-4c32759e2eb9	ed47fb3a-d681-11e8-8c00-4c32759e2eb9	a529fd7a-c967-11e8-a7be-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271579.pdf	2018-10-23 16:12:59+11	86
64b41dae-d682-11e8-9ae9-4c32759e2eb9	ed488f28-d681-11e8-9944-4c32759e2eb9	a529fd7a-c967-11e8-a7be-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271615.pdf	2018-10-23 16:13:35+11	69
f9bdf1fe-d682-11e8-99f3-4c32759e2eb9	ed4a42b6-d681-11e8-988d-4c32759e2eb9	a529fd7a-c967-11e8-a7be-4c3275989ef5	None	2018-10-23 16:17:46+11	0
7ce7de9c-d682-11e8-b437-4c32759e2eb9	ed490c70-d681-11e8-b7b3-4c32759e2eb9	a529fd7a-c967-11e8-a7be-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271656.pdf	2018-10-23 16:14:16+11	76
9beec99a-d682-11e8-96a9-4c32759e2eb9	ed498308-d681-11e8-96c1-4c32759e2eb9	a529fd7a-c967-11e8-a7be-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271708.pdf	2018-10-23 16:15:08+11	79
c341f0c6-d682-11e8-be7a-4c32759e2eb9	ed4aeedc-d681-11e8-97f8-4c32759e2eb9	a529fd7a-c967-11e8-a7be-4c3275989ef5	/Users/alex/Documents/9323/Project-based-learning-Management-App/temp/1540271774.pdf	2018-10-23 16:16:14+11	82
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tasks (task_uuid, phase_uuid, task_name, deadline, mark_release, submit_require, spec_address) FROM stdin;
a529fd7a-c967-11e8-a7be-4c3275989ef5	a528cb28-c967-11e8-9304-4c3275989ef5	Proposal	2018-10-21 10:59:59+11	2018-10-21 11:00:00+11	1	None
a52cf4be-c967-11e8-8b38-4c3275989ef5	a52b99de-c967-11e8-9bd2-4c3275989ef5	Requirement document	2018-10-26 10:59:59+11	2018-10-26 11:00:00+11	1	None
2733b150-c9ea-11e8-94ac-4c3275989ef5	a52b99de-c967-11e8-9bd2-4c3275989ef5	Design document	2018-10-26 10:59:59+11	2018-10-26 11:00:00+11	1	None
a52fa206-c967-11e8-989a-4c3275989ef5	a52e00d4-c967-11e8-8949-4c3275989ef5	Implementation	2018-10-30 10:59:59+11	2018-10-30 11:00:00+11	1	None
a53257cc-c967-11e8-9495-4c3275989ef5	a53111fa-c967-11e8-93b0-4c3275989ef5	Demo	2018-11-03 10:59:59+11	2018-11-05 11:00:00+11	1	None
04ac2358-c968-11e8-a538-4c3275989ef5	04aabee4-c968-11e8-8dc6-4c3275989ef5	Proposal	2018-10-12 10:59:59+11	2018-10-13 11:00:00+11	1	None
04afe482-c968-11e8-8423-4c3275989ef5	04adb2b6-c968-11e8-9522-4c3275989ef5	Design document	2018-10-14 10:59:59+11	2018-10-15 11:00:00+11	1	None
04b30358-c968-11e8-802b-4c3275989ef5	04b1cd58-c968-11e8-8192-4c3275989ef5	Implementation	2018-10-16 10:59:59+11	2018-10-17 11:00:00+11	1	None
04b6bc30-c968-11e8-af25-4c3275989ef5	04b4dac8-c968-11e8-bc21-4c3275989ef5	Demo	2018-10-18 10:59:59+11	2018-10-20 11:00:00+11	1	None
\.


--
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_info (email, password, name, gender, dob, user_type, photo) FROM stdin;
lecturer1@gmail.com	123456	Emma	female	October 05	lecturer	None
lecturer2@gmail.com	123456	James	male	October 05	lecturer	None
mentor1@gmail.com	123456	Mary	female	October 05	mentor	None
mentor2@gmail.com	123456	Allen	male	October 05	mentor	None
student1@gmail.com	123456	Alex	male	October 05	student	None
student2@gmail.com	123456	John	male	October 05	student	None
student3@gmail.com	123456	Olivia	female	October 05	student	None
student4@gmail.com	123456	Kevin	male	October 05	student	None
student5@gmail.com	123456	Rose	female	October 05	student	None
student6@gmail.com	123456	Jeanne	female	October 05	student	None
student7@gmail.com	123456	Charles	male	October 05	student	None
student8@gmail.com	123456	Shirley	female	October 05	student	None
student9@gmail.com	123456	Robert	male	October 05	student	None
student10@gmail.com	123456	Angel	female	October 05	student	None
noah@gmail.com	123456	Noah	male	October 05	student	None
jack@gmail.com	123456	Jack	male	October 05	student	None
harry@gmail.com	123456	Harry	male	October 05	student	None
jacob@gmail.com	123456	Jacob	male	October 05	student	None
charlie@gmail.com	123456	Charlie	male	October 05	student	None
thomas@gmail.com	123456	Thomas	male	October 05	student	None
george@gmail.com	123456	George	male	October 05	student	None
oscar@gmail.com	123456	Oscar	male	October 05	student	None
james@gmail.com	123456	James	male	October 05	student	None
william@gmail.com	123456	William	male	October 05	student	None
connor@gmail.com	123456	Connor	male	October 05	student	None
callum@gmail.com	123456	Callum	male	October 05	student	None
kyle@gmail.com	123456	Kyle	male	October 05	student	None
joe@gmail.com	123456	Joe	male	October 05	student	None
reece@gmail.com	123456	Reece	male	October 05	student	None
rhys@gmail.com	123456	Rhys	male	October 05	student	None
damian@gmail.com	123456	Damian	male	October 05	student	None
liam@gmail.com	123456	Liam	male	October 05	student	None
mason@gmail.com	123456	Mason	male	October 05	student	None
ethan@gmail.com	123456	Ethan	male	October 05	student	None
michael@gmail.com	123456	Michael	male	October 05	student	None
alexander@gmail.com	123456	Alexander	male	October 05	student	None
daniel@gmail.com	123456	Daniel	male	October 05	student	None
john@gmail.com	123456	John	male	October 05	student	None
robert@gmail.com	123456	Robert	male	October 05	student	None
david@gmail.com	123456	David	male	October 05	student	None
linda@gmail.com	123456	Linda	female	October 05	student	None
barbara@gmail.com	123456	Barbara	female	October 05	student	None
susan@gmail.com	123456	Susan	female	October 05	student	None
margaret@gmail.com	123456	Margaret	female	October 05	student	None
jessica@gmail.com	123456	Jessica	female	October 05	student	None
sarah@gmail.com	123456	Sarah	female	October 05	student	None
murphy@gmail.com	123456	Murphy	female	October 05	student	None
jones@gmail.com	123456	Jones	female	October 05	student	None
williams@gmail.com	123456	Williams	female	October 05	student	None
brown@gmail.com	123456	Brown	female	October 05	student	None
taylor@gmail.com	123456	Taylor	female	October 05	student	None
davies@gmail.com	123456	Davies	female	October 05	student	None
wilson@gmail.com	123456	Wilson	female	October 05	student	None
evans@gmail.com	123456	Evans	female	October 05	student	None
tom@gmail.com	123456	Tom	male	October 05	student	None
roberts@gmail.com	123456	Roberts	female	October 05	student	None
smith@gmail.com	123456	Smith	female	October 05	student	None
walsh@gmail.com	123456	Walsh	female	October 05	student	None
byrne@gmail.com	123456	Byrne	female	October 05	student	None
lam@gmail.com	123456	Lam	female	October 05	student	None
martin@gmail.com	123456	Martin	female	October 05	student	None
\.


--
-- Name: addition_resource addition_resource_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addition_resource
    ADD CONSTRAINT addition_resource_pkey PRIMARY KEY (res_uuid);


--
-- Name: group_relation group_relation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_relation
    ADD CONSTRAINT group_relation_pkey PRIMARY KEY (email, group_uuid);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (group_uuid);


--
-- Name: managements managements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.managements
    ADD CONSTRAINT managements_pkey PRIMARY KEY (email, group_uuid);


--
-- Name: phases phases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phases
    ADD CONSTRAINT phases_pkey PRIMARY KEY (phase_uuid);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project_uuid);


--
-- Name: reminder reminder_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reminder
    ADD CONSTRAINT reminder_pkey PRIMARY KEY (reminder_uuid);


--
-- Name: submits submits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submits
    ADD CONSTRAINT submits_pkey PRIMARY KEY (submit_uuid);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (task_uuid);


--
-- Name: user_info user_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_pkey PRIMARY KEY (email);


--
-- PostgreSQL database dump complete
--


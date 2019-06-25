# Project-based-learning-Management-App
Project for comp9323

# The requirement of this application
This application work on MacOS and Linux.
For Linux, only test on Debian.

### requirement ###
Database: Postgresql, run on localhost port 5432 with a database named "comp9323".
For the detail of setup database, see setup database part

Server: Python3. For detail, see setup server part.

# Setup

### Setup Server part ###

This application use Python3 as running environment and Flask as framework.
To setup server, run the following command.

On your own machine, in virtualenv:

```bash
# create a sandbox for the backend
$ python3 -m virtualenv env
# enter sandbox
$ source env/bin/activate
# set up sandbox
$ pip install -r requirements.txt
```

### Setup database part ###

This application use Postgresql as database to maintien data. Make sure you have a 
Postgresql server running on localhost:5432 and createdb, dropdb, psql commands could be used.

```bash
$ createdb comp9323
$ psql comp9323
comp9323=# \i init.sql
comp9323=# \q
```

Once you finish using this application, run the following command to drop whole database.

```bash
$ dropdb comp9323
```

# Start application

After you finish all setup part, you can use following command to start this
application. 
This application will run on localhost:5000, make sure no other service or 
application running on port 5000.


```bash
$ python3 backend.py
```
And now application is running on localhost:5000. You could use test account
<pre>
email: 'student1@gmail.com', password: '123456' 
email: 'lecturer1@gmail.com', password: '123456'
</pre>


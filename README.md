acj-versus
==========

Introduction
------------
Adaptive Comparative Judgement (ACJ) is based on the law of comparative judgement conceived by L. L. Thurstone in 1927 as a method for psychological measurements.
First used for psychological measurements, today it offers an alternative to marking, especially for performance assessments for which achievement can be difficult to describe in mark schemes and for those where inter-marker reliability is often a problem.

This application is based on an updated 2012 paper which details ACJ's method and history.
Students answer questions asked by instructors or other students and are then able to compare and judge the given answers. From these judgements a score for each answer is calculated according to ACJ's methods.


Frameworks
----------
The frontend is purely written in Javascript, using [AngularJS](http://angularjs.org/) as a MVC-framework and [Bootstrap](http://getbootstrap.com/) for the design.
The backend uses the python web application framework [Flask](http://flask.pocoo.org/) with [Flask SQLAlchemy]{http://pythonhosted.org/Flask-SQLAlchemy/] for database persistence.
[SQLAlchemy Migrate] (https://sqlalchemy-migrate.readthedocs.org) is used to maintain database updates.


Installation
-----------
*list all Python dependencies here*

Running the application
-----------------------
To start the application execute `python runacj.py`.
To start the application in a testing environment use the parameter '--t'. This enables functionality such as resetting the database and shutting down the webserver via URL.

Database
--------
The database connection parameters can be configured in settings.py.
When running the application, any missing tables are automatically created.
For any updates to the database model SQLAlchemy Migrate scripts are used. ([detailed information](https://sqlalchemy-migrate.readthedocs.org/en/v0.7.2/versioning.html))

###Setting up SQLALchemy Migrate
* Create a repository: `migrate create acjDB "acj"`
* Link the repository to the database: `python acjDB/manage.py version_control <db_connection_parameter>`
* Create a link to execute commands on the repository: `migrate manage manage.py --repository=acjDB --url=<db_connection_parameter>`

###Updating the databse schema
* When the application gets updated simply run: `python manage.py upgrade`


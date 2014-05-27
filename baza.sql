CREATE TABLE Employee(
	id_employee int  PRIMARY KEY auto_increment,
	name VARCHAR(200) NOT NULL,
	surname VARCHAR(300) NOT NULL,
	username varchar(100) NOT NULL,
	password varchar(100) NOT NULL,
	role VARCHAR(100) NOT NULL
);

CREATE TABLE Project(
	id_project INT PRIMARY KEY auto_increment,
	name VARCHAR(400) NOT NULL,
	description VARCHAR(500) NOT NULL
);

CREATE TABLE ProjectEmployee(
	id_project int not null,
	id_employee int not null
)ENGINE=INNODB;

CREATE TABLE Tasks(
	id_task INT PRIMARY KEY auto_increment,
	id_project INT,
	id_employee INT,
	description VARCHAR(500),
	repo_link VARCHAR(400)
)ENGINE=INNODB;


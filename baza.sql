CREATE SCHEMA `manager_zadan` CHARACTER SET utf8 COLLATE utf8_general_ci;
 
CREATE TABLE Employee (
        id_employee int  PRIMARY KEY auto_increment,
        name VARCHAR(255) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        password varchar(255) NOT NULL,
        role varchar(255) NOT NULL
);
 
ALTER TABLE Employee CHARACTER SET utf8 COLLATE utf8_general_ci;
 
CREATE TABLE Project(
        id_project  INT PRIMARY KEY auto_increment,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(500) NOT NULL
);
 
ALTER TABLE Project CHARACTER SET utf8 COLLATE utf8_general_ci;
 
CREATE TABLE ProjectEmployee(
        id_project int not null,
        id_employee int not null
)ENGINE=INNODB;
 
ALTER TABLE ProjectEmployee CHARACTER SET utf8 COLLATE utf8_general_ci;
 
CREATE TABLE Tasks(
        id_task INT PRIMARY KEY auto_increment,
        id_project INT,
        id_employee INT,
        operator VARCHAR(255),
        description VARCHAR(500),
        name VARCHAR(255),
        status VARCHAR(255)
)ENGINE=INNODB;
 
ALTER TABLE Tasks CHARACTER SET utf8 COLLATE utf8_general_ci;
 
CREATE TABLE SocketStore (
        id_employee int NOT NULL,
        id_socket VARCHAR(255) NOT NULL
);
 
ALTER TABLE SocketStore CHARACTER SET utf8 COLLATE utf8_general_ci;


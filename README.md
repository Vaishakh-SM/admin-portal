# admin-portal

Create database:
```
create database dbproject;
```

Create table users:
```
create table Users (UID int PRIMARY KEY AUTO_INCREMENT, username varchar(255) UNIQUE, password varchar(255), employment enum('Guest House Services','Market Shop Services','Landscaping Services','Administration'));
```

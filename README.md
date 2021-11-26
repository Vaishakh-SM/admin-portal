# admin-portal

Create database:

```
create database dbproject;
```

Create user and role table

```

CREATE TABLE Users (UID int PRIMARY KEY AUTO_INCREMENT, username varchar(255) UNIQUE, password varchar(255), RoleID INT, FOREIGN KEY (RoleID) REFERENCES Role(RoleID));

CREATE TABLE Role(RoleID INT PRIMARY KEY AUTO_INCREMENT, RoleDesc VARCHAR(255));

```

Create permission tables

```
CREATE TABLE Permissions (PID INT PRIMARY KEY AUTO_INCREMENT, PDesc VARCHAR(255));

CREATE TABLE PermissionsJoin(
    UID INT,
    PID INT,
    FOREIGN KEY(PID) REFERENCES Permissions(PID),
    FOREIGN KEY(UID) REFERENCES Users(UID)
);

CREATE TABLE PermissionSet(
    RoleID INT, PID INT,
    FOREIGN KEY(PID) REFERENCES Permissions(PID),
    FOREIGN KEY(RoleID) REFERENCES Role(RoleID)
);

```

Creating trigger for permission

```
DELIMITER $$
CREATE TRIGGER grant_permission_set
AFTER INSERT
ON Users FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE permission INT;
    DECLARE cur CURSOR FOR SELECT PID FROM PermissionSet WHERE RoleID=NEW.RoleID;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;
    my_cur_loop:
        LOOP FETCH cur INTO permission;
        IF done = 1 THEN
            LEAVE my_cur_loop;
        END IF;

        INSERT INTO PermissionsJoin VALUES (NEW.UID, permission);
    END LOOP my_cur_loop;
    CLOSE cur;

END $$
DELIMITER ;

```

Linking roleID to roleDesc (Add here for more roles)

```
INSERT INTO Role VALUES('1','Admin');
INSERT INTO Role VALUES('2','Guest House');
INSERT INTO Role VALUES('3','Market Services');
INSERT INTO Role VALUES('4','Landscaping Services');
INSERT INTO Role VALUES('5','General user');
```

Some trial permissions

```
INSERT INTO Permissions VALUES('101','Add user');
INSERT INTO Permissions VALUES('201','Book room');
```

Trial permission set.

```
INSERT INTO PermissionSet VALUES('1','101');
INSERT INTO PermissionSet VALUES('1','201');
INSERT INTO PermissionSet VALUES('2','201');
```

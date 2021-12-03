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

INSERT INTO Role VALUES('201','Regular Cook');
INSERT INTO Role VALUES('202','Contract Cook');
INSERT INTO Role VALUES('203','Cleaner');
INSERT INTO Role VALUES('204','Cook Supervisor');
INSERT INTO Role VALUES('205','Guesthouse Staff');

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

Guest house room table

```
CREATE TABLE Room(
    RoomID INT PRIMARY KEY,
    MaxCapacity INT,
    Beds INT,
    Type VARCHAR(255),
    Rate INT
);

CREATE TABLE RoomBooking(
    RoomBookingID INT PRIMARY KEY AUTO_INCREMENT,
    UID INT,
    RoomID INT,
    StartDate DATE,
    EndDate DATE,
    PaymentStatus ENUM('Pending','Done'),
    FOREIGN KEY (UID) REFERENCES Users(UID),
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
);


SELECT RoomID FROM `Room` WHERE MaxCapacity >= 3 AND Beds=4 AND type='AC' AND RoomID NOT IN (Select RoomID FROM Bookings WHERE (StartDate >= '2021-12-24' AND StartDate <= '2021-12-25') OR (EndDate >= '2021-12-24' AND EndDate <= '2021-12-25'));

INSERT INTO Room VALUEs ('101','4','4','AC');
INSERT INTO Room VALUEs ('102','4','4','AC');
INSERT INTO Room VALUEs ('103','4','4','AC');

```

Food

```
CREATE TABLE Food(
    FoodID INT PRIMARY KEY AUTO_INCREMENT,
    FoodName VARCHAR(255),
    FoodDesc VARCHAR(255),
    Rate INT,
    ImageLink VARCHAR(255)
);

CREATE TABLE FoodBooking(
    FoodBookingID INT PRIMARY KEY AUTO_INCREMENT,
    UID INT,
    FoodID INT,
    BookedDate DATE,
    OrderStatus ENUM('Placed', 'Delivered'),
    PaymentStatus ENUM('Pending','Done'),
    FOREIGN KEY (UID) REFERENCES Users(UID),
    FOREIGN KEY (FoodID) REFERENCES Food(FoodID)
);

```

```
CREATE VIEW PendingOrders AS
(SELECT FoodBooking.FoodBookingID, FoodBooking.UID, FoodBooking.FoodID, Food.FoodName FROM FoodBooking, Food WHERE OrderStatus='Placed' AND FoodBooking.FoodID=Food.FoodID);
```

Bill Views

```
CREATE VIEW RoomBills AS(
SELECT UID, RoomID, EndDate, (Days*Rate) AS Cost FROM(
Select RoomBooking.UID, RoomBooking.RoomID, DATEDIFF(EndDate,StartDate) As Days, Room.Rate, RoomBooking.EndDate FROM RoomBooking, Room WHERE Room.RoomID = RoomBooking.RoomID AND RoomBooking.PaymentStatus='Pending') AS T);



CREATE VIEW FoodBills AS(
SELECT UID, FoodName, BookedDate, Rate FROM
(SELECT FoodBooking.UID, FoodBooking.FoodID, FoodBooking.BookedDate, Food.Rate, Food.FoodName FROM FoodBooking, Food WHERE PaymentStatus='Pending' AND FoodBooking.FoodID = Food.FoodID) AS T
);

CREATE VIEW TotalBills AS(
WITH
T1 AS (select UID, sum(Cost) AS Cost FROM RoomBills GROUP BY UID),
T2 AS (select UID, sum(Rate) AS Cost FROM FoodBills GROUP BY UID)
SELECT T1.UID, (T1.Cost + T2.Cost) AS GrandTotal FROM T1, T2 WHERE T1.UID=T2.UID);

Select FoodBooking.FoodBookingID, Food.FoodName, FoodBooking.BookedDate FROM FoodBooking, Food WHERE UID='2' AND OrderStatus='Delivered' AND PaymentStatus='Pending' AND FoodBooking.FoodID = Food.FoodID;

```

Guesthouse staff

```
CREATE TABLE GuestHouseStaff(
    StaffID INT PRIMARY KEY AUTO_INCREMENT,
    UID INT,
    Name VARCHAR(255),
    FOREIGN KEY (UID) REFERENCES Users(UID)
);


DELIMITER $$
CREATE TRIGGER add_guesthouse_employee
AFTER INSERT
ON Users FOR EACH ROW
BEGIN
    IF (NEW.RoleID = 2) OR (NEW.RoleID>200) THEN
        INSERT INTO GuestHouseStaff VALUES (NULL,NEW.UID,NEW.username);
    END IF;

END $$
DELIMITER ;

```

Guesthouse staff schedule

```
CREATE TABLE GuestHouseStaffSchedule(
    StaffID INT,
    ShiftDate DATE,
    ShiftTime ENUM('Morning','Night'),
    FOREIGN KEY (StaffID) REFERENCES GuestHouseStaff(StaffID)
);

```

```
INSERT INTO Users VALUES(NULL,'Regular','$2b$10$Ys9CxSNzb2QS8FRq..Of3eG2kowa4DNGRDX3fuufzZuEnIRfJblxu','201');

INSERT INTO Users VALUES(NULL,'CC1','$2b$10$Ys9CxSNzb2QS8FRq..Of3eG2kowa4DNGRDX3fuufzZuEnIRfJblxu','202');
INSERT INTO Users VALUES(NULL,'CC2','$2b$10$Ys9CxSNzb2QS8FRq..Of3eG2kowa4DNGRDX3fuufzZuEnIRfJblxu','202');

INSERT INTO Users VALUES(NULL,'Help1','$2b$10$Ys9CxSNzb2QS8FRq..Of3eG2kowa4DNGRDX3fuufzZuEnIRfJblxu','203');
INSERT INTO Users VALUES(NULL,'Help2','$2b$10$Ys9CxSNzb2QS8FRq..Of3eG2kowa4DNGRDX3fuufzZuEnIRfJblxu','203');
```

Monthly expenditure

```
CREATE TABLE GuestHouseExpenditure (
    ExpID INT PRIMARY KEY AUTO_INCREMENT,
    ExpDesc VARCHAR(255),
    ExpDate DATE,
    TotalExp INT
);
```

// TODO

ADD trigger for when someone books to add to payment
Show the total money needed

Add trigger for food
Add functionality for employee to add and remove food

Add functionality for employee to list some food as out of stock
Order see live

Make a table for Guest house employees.
Role will be contractual cook, regular cook, cook supervisor, guesthouse staff, cook cleaner

Regular cook 6 days and contractual cook 5 days in a week

Add data scheduling
For Seeing schedule, some calendar should be there and for reassigning also
Add preferred shift table in Staff table
Add specialized in field too (like what he cooks usually)
Basically just some random data fields with no relevance

// Supervisor: Scheduling, bills and bill payments

```
SELECT *
INTO OUTFILE '/home/data.csv'
FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'
FROM Users;

SELECT *
INTO OUTFILE '/home/RoomBooking1.csv'
FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'
FROM RoomBooking;

SELECT *
INTO OUTFILE '/home/Staff.csv'
FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'
FROM GuestHouseStaff;

SELECT *
INTO OUTFILE '/home/GuestHouseStaffSchedule.csv'
FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'
FROM GuestHouseStaffSchedule;

SELECT *
INTO OUTFILE '/home/GuestHouseExpenditure.csv'
FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n'
FROM GuestHouseExpenditure;
```

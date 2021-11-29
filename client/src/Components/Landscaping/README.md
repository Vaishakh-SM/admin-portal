Creating tables for Landscaping Service: 

```
CREATE TABLE Gardener(
  LID INT PRIMARY KEY AUTO_INCREMENT, 
  username VARCHAR(255) UNIQUE, 
  name VARCHAR(255), 
  phonenumber BIGINT, 
  employeeID VARCHAR(20) UNIQUE,
  monthHours INT,
  leaveDay INT,
  garden VARCHAR(50),
  FOREIGN KEY (username) REFERENCES Users(username), 
  FOREIGN KEY (garden) REFERENCES Garden(name));
 ```

```
CREATE TABLE Garden(
    name VARCHAR(50) PRIMARY KEY,
    priority INT,
    peopleHours INT,
    cropped INT);
  ```

```
CREATE TABLE Equipment(
    equipID VARCHAR(30) PRIMARY KEY,
    type VARCHAR(30),
    equipcondition VARCHAR(80),
    gardener varchar(50),
    vendor varchar(30),
    repairStatus varchar(255),
    FOREIGN KEY(gardener) REFERENCES Gardener(employeeID),
    FOREIGN KEY(vendor) REFERENCES Vendor(username));
  ```
```
CREATE TABLE Vendor(
    username VARCHAR(255) PRIMARY KEY,
    vendorID VARCHAR(30),
    field VARCHAR(50),
    dues INT,
    FOREIGN KEY(username) REFERENCES Users(username));
  ```

```
DELIMITER $$
CREATE TRIGGER add_landscape
AFTER INSERT
ON Users FOR EACH ROW
BEGIN
  IF new.RoleID = '4' THEN
    INSERT INTO Gardener VALUES(NULL, new.username, NULL, NULL, NULL, NULL, NULL, NULL );
  END IF;
END $$
DELIMITER ;
```

```
CREATE TABLE CutRecs(
  RID INT PRIMARY KEY AUTO_INCREMENT,
  garden VARCHAR(50),
  FOREIGN KEY (garden) REFERENCES Garden(name)
);
```
```
CREATE TABLE Notes(
  noteDate DATE,
  gardener VARCHAR(255),
  garden VARCHAR(50),
  notes VARCHAR(255),
);
```
```
DELIMITER $$
CREATE TRIGGER add_vendor
AFTER INSERT
ON Users FOR EACH ROW
BEGIN
  IF new.RoleID = '401' THEN
    INSERT INTO Vendor VALUES(new.username, NULL, NULL, NULL);
  END IF;
END $$
DELIMITER ;
```

```
CREATE TABLE VendorBills(
  billDate date,
  username VARCHAR(255) UNIQUE,
  vendorID VARCHAR(30),
  equipID VARCHAR(30),
  reason VARCHAR(255),
  dues INT
);
```
```
CREATE TABLE Supervisor(
  username VARCHAR(255) PRIMARY KEY,
  name VARCHAR(50),
  employeeID VARCHAR(50),
  FOREIGN KEY (username) REFERENCES Users(username)
);
```
```
DELIMITER $$
CREATE TRIGGER add_supervisor
AFTER INSERT
ON Users FOR EACH ROW
BEGIN
  IF new.RoleID = '402' THEN
    INSERT INTO Supervisor VALUES(new.username, NULL, NULL);
  END IF;
END $$
DELIMITER ;
```
```
```
CREATE TABLE WeekSchedule(
  day VARCHAR(20),
  number INT,
  garden VARCHAR(255)
);
```
```
CREATE PROCEDURE refresh()
BEGIN
INSERT INTO WeekSchedule VALUES
('Monday',1,':'),
('Tuesday',2,':'),
('Wednesday',3,':'),
('Thursday',4,':'),
('Friday',5,':'),
('Saturday',6,':');
END$$
```

CREATE PROCEDURE scheduler()
BEGIN
DECLARE gCount INT default 0;
DECLARE gaCount INT default 0;
DECLARE garden INT default 0;
DECLARE gsize INT default 0;
DECLARE hours INT default 8;
DECLARE gcounter INT default 0;
DECLARE dcounter INT default 1;
SELECT count(*) into garden from Garden;
SELECT count(*) into gaCount from Gardener;
SET gCount = gaCount * 8;
WHILE gcounter<garden DO
  SELECT peopleHours INTO gsize FROM Garden WHERE Priority = dcounter;
  IF gsize <= gaCount THEN 
    UPDATE WeekSchedule SET garden = CONCAT(WeekSchedule.garden + Garden.garden) WHERE Garden.priority = dcounter;
    SET gaCount = gaCount - gsize;
    SET gcounter = gcounter + 1;
  END IF;
  IF gsize > gaCount THEN
    UPDATE WeekSchedule SET garden= CONCAT(WeekSchedule.garden + Garden.garden) WHERE Garden.priority = dcounter;
    SET dcounter = dcounter + 1;
    SET gaCount = gCount * 8;
  END IF;
END WHILE;
END$$



END$$


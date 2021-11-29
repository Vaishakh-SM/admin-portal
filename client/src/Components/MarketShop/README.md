Creating tables for market services:

```
CREATE TABLE Shopkeepers(
  SID INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  storeID INT UNIQUE,
  phonenumber BIGINT,
  securitypassID VARCHAR(20),
  passexpiry DATE,
  FOREIGN KEY (username) REFERENCES Users(username),
  FOREIGN KEY (storeID) REFERENCES Stores(StoreID));
```

```
CREATE TABLE billrequests(
  	breqID INT PRIMARY KEY AUTO_INCREMENT,
  	amount INT,
  	transactionID  VARCHAR(255),
  	modeofpayment VARCHAR(100),
  	status ENUM('Denied','Accepted','In review','On hold') DEFAULT 'In review',
	pb_id INT,
	FOREIGN KEY (pb_id) REFERENCES pendingbills(pb_id)
);
```

```
CREATE TABLE license(
	LicenseID VARCHAR(10) PRIMARY KEY,
	LicenseExpiry DATE,
	StoreID INT,
	FOREIGN KEY (storeID) REFERENCES Stores(storeID))
);
```

```
CREATE TABLE license_ext_req(
    	er_id INT PRIMARY AUTO_INCREMENT,
    	licenseID varchar(10) unique,
    	period FLOAT,
    	fee_paid INT,
    	status enum('Denied','Accepted','In review','On hold') default 'In review',
    	transactionID VARCHAR(255) UNIQUE,
    	modeofpayment VARCHAR(100),
    	FOREIGN KEY (licenseID) REFERENCES license(licenseID)
);
```

```
CREATE TABLE pendingbills(
	pb_id INT PRIMARY KEY AUTO_INCREMENT,
	storeID INT,
	type ENUM ('Rent','Electricity','Others'),
	month DATE,
	due_amount INT
);
```

```
CREATE TABLE Stores(
	StoreID INT PRIMARY KEY AUTO_INCREMENT,
	StoreName TEXT,
	Location TEXT,
	Category TEXT,
	Availability TEXT,
	Rating FLOAT
);
```

```
CREATE TABLE Feedback(
	FeedbackID INT PRIMARY KEY AUTO_INCREMENT,
	StoreID INT,
	Service Availability,
	Availability INT,
	Quality INT,
	Price INT,
	Conduct INT,
	Message TEXT, 
	FOREIGN KEY (StoreID) REFERENCES Stores(StoreID)
);
```

Adding triggers:

```
DELIMITER $$
CREATE TRIGGER insertShopkeeper
AFTER INSERT
ON Users FOR EACH ROW
BEGIN
IF(NEW.RoleID=3) THEN
INSERT INTO shopkeepers(username) VALUES (new.username);
END IF;
END$$
DELIMITER ;
```

Creating procedures:

```
DELIMITER $$
CREATE PROCEDURE updateRating(IN sID INT)
BEGIN
DECLARE s,a,q,p,c FLOAT DEFAULT 0;
SELECT AVG(service),AVG(availability),AVG(quality),AVG(price),AVG(conduct) INTO s,a,q,p,c FROM feedback WHERE storeID=sID;
UPDATE Stores SET rating=((s+a+q+p+c)/5.0) WHERE storeID=sID;
END$$
DELIMITER ;
```

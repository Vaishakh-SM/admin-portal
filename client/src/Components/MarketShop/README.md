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
  	storeID INT,
  	amount INT,
  	type ENUM('Rent','Electricity','Others'),
  	transactionID  VARCHAR(255),
  	modeofpayment VARCHAR(100),
  	status ENUM('Denied','Accepted','In review','On hold') DEFAULT 'In review',
  	FOREIGN KEY (storeID) REFERENCES Stores(storeID));
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
 create table license_ext_req(
    	er_id int primary key auto_increment,
    	licenseID varchar(10) unique,
    	period float,
    	fee_paid int,
    	status enum('Denied','Accepted','In review','On hold') default 'In review',
    	transactionID varchar(255) unique,
    	modeofpayment varchar(100),
    	foreign key (licenseID) references license(licenseID)
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

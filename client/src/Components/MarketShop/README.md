Creating tables for market services:

```
CREATE TABLE Shopkeepers(
  SID INT PRIMARY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  storeID INT,
  phonenumber BIGINT,
  securitypassID VARCHAR(20),
  passexpiry DATE,
  FOREIGN KEY (username) REFERENCES Users(username),
  FOREIGN KEY (storeID) REFERENCES Stores(StoreID));
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

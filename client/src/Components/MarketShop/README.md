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

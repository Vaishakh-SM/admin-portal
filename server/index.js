const cors = require("cors");
const express = require("express");
const session = require("express-session");
const mysql = require("mysql2/promise");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const options = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "dbproject",
  port: 3306,
};

const db = mysql.createPool(options);

const mysqlStore = require("express-mysql-session")(session);
const sessionStore = new mysqlStore({}, db);

const TWO_HOURS = 1000 * 60 * 60 * 2;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    name: "session_name",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: "temporary_Secret",
    cookie: {
      maxAge: TWO_HOURS,
      sameSite: true,
      secure: false,
    },
  })
);

app.listen(3001, () => {
  console.log("Lmao Im listening to port 3001");
});

app.get("/", (req, res) => {
  res.send("Worked");
  console.log(req.session);
});

app.get("/api/addAdmin", (req, res) => {
  const query = "INSERT INTO Users VALUES (?,?);";

  bcrypt.hash("admin", saltRounds, function (err, hash) {
    if (err) throw err;

    db.query(query, ["admin", hash], (err, res) => {
      if (err) throw err;
      return console.log("RES is", res);
    });
  });

  res.send("Added Admin");
});

app.post("/api/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const passQuery =
    "SELECT `password`,`RoleID` FROM `Users` WHERE `username` = ?";

  const [rows, fields] = await db.query(passQuery, [username]);
  const requiredHash = rows[0].password;
  const roleID = rows[0].RoleID;

  bcrypt.compare(password, requiredHash, (err, result) => {
    try {
      if (result == true) {
        req.session.username = username;

        console.log("Session is now ", req.sessionID);
        req.session.save();
        return res.send({
          success: true,
          roleID: roleID,
        });
      } else {
        res.send({ success: false });
      }
    } catch (e) {
      console.log(e);
    }
  });
});

app.post("/api/register", async (req, res) => {
  const username = req.body.username;
  const pass = req.body.password;
  const cpass = req.body.confirm_password;
  const roleID = req.body.role.roleID;

  const passQuery = "SELECT * FROM `Users` WHERE `username` = ?";
  const [rows, fields] = await db.query(passQuery, [username]);
  if (rows.length > 0) {
    res.send({ success: false, message: "Username already exists." });
    throw new Error("User exists.");
  }

  if (pass != cpass) {
    res.send({ success: false, message: "Passwords do not match" });
    throw new Error("Passwords need to match");
  }

  const query =
    "INSERT IGNORE INTO `Users`(`username`,`password`,`roleID`) VALUES (?,?,?)";
  try {
    bcrypt.hash(pass, saltRounds, function (err, hash) {
      if (err) throw err;
      db.query(query, [username, hash, roleID], (err, res) => {
        if (err) throw err;
        console.log("res is ", res);
      });
    });
    res.send({
      success: true,
      message: "User successfully registered. Redirected to login.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.get("/api/getUser", (req, res) => {
  console.log("User cookie is", req.sessionID);
  res.send({
    username: req.session.username,
  });
});

app.get("/api/extractStores", async (req, res) => {
  const query = "SELECT * from `Stores`";
  const [rows, fields] = await db.query(query);

  try {
    res.send({ success: true, info: rows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});

app.get("/api/getStoreDetails", async (req, res) => {
  const query =
    "SELECT * from `Stores` WHERE `StoreID`=(SELECT `StoreID` FROM `Shopkeepers` WHERE `username`=?) ";
  const [rows, fields] = await db.query(query, [req.session.username]);

  const lquery =
    "SELECT * from `License` WHERE `StoreID`=(SELECT `StoreID` FROM `Shopkeepers` WHERE `username`=?) ";
  const [lrows, lfields] = await db.query(lquery, [req.session.username]);

  var obj = Object.assign({}, rows[0], lrows[0]);
  obj.LicenseExpiry = obj.LicenseExpiry.toDateString();
  try {
    res.send({ success: true, info: obj });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});

app.get("/api/getPendingBills", async (req, res) => {
  const query =
    "SELECT * from `pendingbills` WHERE `StoreID`=(SELECT `StoreID` FROM `Shopkeepers` WHERE `username`=?) ";
  const [rows, fields] = await db.query(query, [req.session.username]);

  try {
    res.send({ success: true, info: rows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});

app.get("/api/getRequestStatus", async (req, res) => {
  const bquery =
    "SELECT `a`.`pb_id` as `id`,`type`,`status` from `billrequests` `a` LEFT JOIN `pendingbills` `b` ON `a`.`pb_id`=`b`.`pb_id` WHERE `StoreID` = (SELECT `StoreID` FROM `Shopkeepers` WHERE `username` =?) ";
  const [brows, bfields] = await db.query(bquery, [req.session.username]);

  const lquery =
    "SELECT `licenseID` as `id`,`status` from `license_ext_req` WHERE `LicenseID`=(SELECT `LicenseID` from `License` WHERE `StoreID`=(SELECT `StoreID` FROM `Shopkeepers` WHERE `username`=?)) ";
  const [lrows, lfields] = await db.query(lquery, [req.session.username]);
  for (let i = 0; i < lrows.length; i++) {
    lrows[i].type = "License";
  }
  Array.prototype.push.apply(brows, lrows);
  try {
    res.send({ success: true, info: brows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});

app.get("/api/getBillRequests", async (req, res) => {
  const query =
    "SELECT `a`.*,`storeID`,`type`,`month`,`due_amount` from `billrequests` `a` LEFT JOIN `pendingbills` `b` ON `a`.`pb_id`=`b`.`pb_id` WHERE `status`!='Accepted'";
  const [rows, fields] = await db.query(query);

  try {
    res.send({ success: true, info: rows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});

app.get("/api/getLicenseRequests", async (req, res) => {
  const query =
    "SELECT `a`.*,`storeID`,`licenseExpiry` from `license_ext_req` `a` LEFT JOIN `license` `b` ON `a`.`licenseID`=`b`.`licenseID` WHERE `status`!='Accepted'";
  const [rows, fields] = await db.query(query);

  try {
    res.send({ success: true, info: rows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});

app.get("/api/getShopkeeper", async (req, res) => {
  const username = req.session.username;

  const [rows, fields] = await db.query(
    "SELECT * FROM `shopkeepers` WHERE username=?",
    [username]
  );

  try {
    const [rows2, fields2] = await db.query(
      "SELECT `StoreName` FROM `Stores` WHERE `StoreID`=?",
      [rows[0].storeID]
    );

    res.send({
      success: true,
      username: req.session.username,
      name: rows[0].name,
      storeID: rows[0].storeID,
      storeName: rows2[0].StoreName,
      phonenumber: rows[0].phonenumber,
      securitypassID: rows[0].securitypassID,
      passexpiry: rows[0].passexpiry.toDateString(),
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});

app.get("/api/getFeedback", async (req, res) => {
  const query =
    "SELECT `message` from `feedback` WHERE `StoreID`=(SELECT `StoreID` FROM `Shopkeepers` WHERE `username`=?) AND `message` IS NOT NULL ";
  const [rows, fields] = await db.query(query, [req.session.username]);

  try {
    res.send({ success: true, info: rows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});

app.post("/api/addStore", async (req, res) => {
  const name = req.body.storename;
  const location = req.body.location;
  const category = req.body.category;
  const availability = req.body.availability;

  const query =
    "INSERT IGNORE INTO `Stores`(`storeName`,`location`,`category`,`availability`) VALUES(?,?,?,?)";
  try {
    db.query(query, [name, location, category, availability], (err, res) => {
      if (err) throw err;
      console.log("res is", res);
    });
    res.send({
      success: true,
      message: "Store added.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.post("/api/addFeedback", async (req, res) => {
  const store = req.body.store;
  const storeID = Number(store.split("-")[0]);
  const service = req.body.service;
  const conduct = req.body.conduct;
  const availability = req.body.availability;
  const quality = req.body.quality;
  const price = req.body.price;
  const message = req.body.message;

  try {
    const query =
      "INSERT IGNORE INTO `Feedback`(`storeID`,`service`,`availability`,`quality`,`price`,`conduct`,`message`) VALUES(?,?,?,?,?,?,?)";
    db.query(
      query,
      [storeID, service, availability, quality, price, conduct, message],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );

    const query2 = "CALL updateRating(?);";
    db.query(query2, [storeID], (err, res) => {
      if (err) throw err;
      console.log("res is", res);
    });
    res.send({
      success: true,
      message: "Feedback submitted.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.post("/api/addShopkeeperDetails", async (req, res) => {
  const username = req.session.username;
  const name = req.body.name;
  const store = req.body.store;
  const phno = req.body.phonenumber;
  const securitypassID = req.body.securitypass;
  const expiry = req.body.expiry;
  const storeID = Number(store.split("-")[0]);

  const passQuery =
    "SELECT * FROM `shopkeepers` WHERE `securitypassID` = ? OR `storeID` = ?";
  const [rows, fields] = await db.query(passQuery, [securitypassID, storeID]);
  if (rows.length > 0) {
    res.send({ success: false, message: "User already exists." });
    throw new Error("User exists.");
  }

  const query =
    "UPDATE `shopkeepers` SET `name`=?,`storeID`=?,`phonenumber`=?,`securitypassID`=?,`passexpiry`=? WHERE `username`=?";
  try {
    db.query(
      query,
      [name, storeID, phno, securitypassID, expiry, username],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Details updated. Redirect to profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.post("/api/addBillRequest", async (req, res) => {
  const username = req.session.username;
  const month = new Date(req.body.month);
  const amount = req.body.amount;
  const type = req.body.type;
  const transactionID = req.body.transactionID;
  const modeofpayment = req.body.modeofpayment;

  const query1 = "SELECT `storeID` FROM `Shopkeepers` WHERE `username`=?";
  const [rows1, fields1] = await db.query(query1, [username]);
  const storeID = rows1[0].storeID;

  const query2 =
    "SELECT `PB_ID` FROM `pendingbills` WHERE `type`=? AND MONTH(`month`)=? AND YEAR(`month`)=? AND `StoreID`=?";
  const [rows2, fields2] = await db.query(query2, [
    type,
    month.getMonth() + 1,
    month.getFullYear(),
    storeID,
  ]);
  const pb_id = rows2[0].PB_ID;

  const query =
    "INSERT IGNORE INTO `billrequests`(`pb_id`,`amount`,`transactionID`,`modeofpayment`) VALUES (?,?,?,?)";
  try {
    db.query(
      query,
      [pb_id, amount, transactionID, modeofpayment],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Details updated. Redirect to store profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.post("/api/updateBillRequest", async (req, res) => {
  const records = req.body;
  const query = "UPDATE `billrequests` SET `status`=? WHERE `breqID`=?";
  try {
    records.forEach(async (obj, i) => {
      db.query(query, [obj.status, obj.id], (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      });
      if (obj.status === "Accepted") {
        const query0 =
          "SELECT `amount`,`pb_id` FROM `billrequests` WHERE `breqID`=?";
        const [rows, fields] = await db.query(query0, [obj.id]);
        const query1 =
          "UPDATE `pendingbills` SET `due_amount`=`due_amount`-? WHERE `pb_id`=? ";
        db.query(query1, [rows[0].amount, rows[0].pb_id], (err, res) => {
          if (err) throw err;
        });

        const query2 =
          "SELECT `due_amount` FROM `pendingbills` WHERE `pb_id`=?";
        const [rows2, fields2] = await db.query(query2, [rows[0].pb_id]);
        console.log(rows2[0].due_amount);
        if (rows2[0].due_amount === 0) {
          const query3 = "DELETE FROM `pendingbills` WHERE `pb_id`=?";
          db.query(query3, [rows[0].pb_id], (err, res) => {
            if (err) throw err;
            console.log("res is", res);
          });
        }
      }
    });
    res.send({
      success: true,
      message: "Status updated.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.post("/api/updateLicenseRequest", async (req, res) => {
  const records = req.body;
  const query = "UPDATE `license_ext_req` SET `status`=? WHERE `er_id`=?";
  try {
    records.forEach(async (obj, i) => {
      db.query(query, [obj.status, obj.id], (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      });
      if (obj.status === "Accepted") {
        const query0 = "SELECT `period` FROM `license_ext_req` WHERE `er_id`=?";
        const [rows, fields] = await db.query(query0, [obj.id]);

        const query1 =
          "UPDATE `license` SET `licenseExpiry`=DATE_ADD(`licenseExpiry`,INTERVAL ? YEAR) WHERE `licenseID`=(SELECT `licenseID` FROM `license_ext_req` WHERE `er_id`=?)";
        db.query(query1, [rows[0].period, obj.id]);
      }
    });
    res.send({
      success: true,
      message: "Status updated.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.post("/api/addLicenseExt", async (req, res) => {
  const username = req.session.username;
  const period = req.body.extPeriod;
  const fee = req.body.fee;
  const transactionID = req.body.transactionID;
  const modeofpayment = req.body.modeofpayment;

  const query1 = "SELECT `storeID` FROM `Shopkeepers` WHERE `username`=?";
  const [rows1, fields1] = await db.query(query1, [username]);
  const storeID = rows1[0].storeID;

  const query2 = "SELECT `licenseID` FROM `license` WHERE `StoreID`=?";
  const [rows2, fields2] = await db.query(query2, [storeID]);
  const licenseID = rows2[0].licenseID;

  const query =
    "INSERT IGNORE INTO `license_ext_req`(`licenseID`,`period`,`fee_paid`,`transactionID`,`modeofpayment`) VALUES (?,?,?,?,?)";
  try {
    db.query(
      query,
      [licenseID, period, fee, transactionID, modeofpayment],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Details updated. Redirect to store profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send("Unable to log out");
      } else {
        res.send("Logout successful");
      }
    });
  } else {
    res.end();
  }
});

app.get("/api/getGardener", async (req, res) => {
  console.log("User cookie is", req.sessionID);
  const username = req.session.username;

  const [rows, fields] = await db.query(
    "SELECT * FROM `Gardener` WHERE username=?",
    [username]
  );
  res.send({
    success: true,
    name: rows[0].name,
    employeeID: rows[0].employeeID,
    monthHours: rows[0].monthHours,
    phonenumber: rows[0].phonenumber,
    leaveDay: rows[0].leaveDay,
    garden: rows[0].garden,
  });
  } 
);

app.post("/api/addGardener", async (req, res) => {
  const username = req.session.username;
  const name = req.body.name;
  const phno = req.body.phonenumber;
  const employeeID = req.body.employeeID;
  const leaveDay = req.body.leaveDay;
  const garden = req.body.garden;

  const query =
    "UPDATE `Gardener` SET `name`=?,`phonenumber`=?,`employeeID`=?,`leaveDay`=?,`garden`=? WHERE username=?";
  try {
    db.query(
      query,
      [name, phno, employeeID, leaveDay, garden, username],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Details updated. Redirect to profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});


app.post("/api/locGardener", async (req, res) => {
  const username = req.session.username;
  const garden = req.body.garden;

  const query =
    "UPDATE `Gardener` SET `garden`=? WHERE username=?";
  try {
    db.query(
      query,
      [garden, username],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Location updated. Redirect to profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.get("/api/getGardens", async (req, res) => {
  const query =
    "SELECT * from `Garden`";
  const [rows, fields] = await db.query(query, [req.session.username]);

  try {
    res.send({ success: true, info: rows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});


app.post("/api/requestCut", async (req, res) => {
  const username = req.session.username;
  const garden = req.body.garden;

  const query =
    "INSERT INTO `CutRecs`(`garden`) VALUES (?)";
  try {
    db.query(
      query,
      [garden],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Cut Requested. Redirect to profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.post("/api/gardenNote", async (req, res) => {
  const username = req.session.username;
  const date = req.body.date;
  const garden = req.body.garden;
  const notes = req.body.notes;
  console.log(req.body);

  const query =
    "INSERT INTO `Notes` VALUES (?,?,?,?)";
  try {
    db.query(
      query,
      [date,username,garden,notes],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Note saved. Redirect to profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.get("/api/getNotes", async (req, res) => {
  const query =
    "SELECT * from `Notes`";
  const [rows, fields] = await db.query(query, [req.session.username]);

  try {
    res.send({ success: true, info: rows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});

app.get("/api/getVendor", async (req, res) => {
  console.log("User cookie is", req.sessionID);
  const username = req.session.username;

  const [rows, fields] = await db.query(
    "SELECT * FROM `Vendor` WHERE username=?",
    [username]
  );
  res.send({
    success: true,
    vendorID: rows[0].vendorID,
    field: rows[0].field,
    dues: rows[0].dues,
  });
  } 
);

app.post("/api/updateVendor", async (req, res) => {
  const username = req.session.username;
  const vendorID = req.body.vendorID;
  const field = req.body.field;
  const dues = req.body.dues;

  const query =
    "UPDATE `Vendor` SET `vendorID`=?,`field`=?,`dues`=? WHERE username=?";
  try {
    db.query(
      query,
      [vendorID, field, dues, username],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Details updated. Redirect to profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.post("/api/addDues", async (req, res) => {
  const username = req.session.username;
  const date = req.body.date;
  const vendorID = req.body.vendorID;
  const equipID = req.body.equipID;
  const reason = req.body.reason;
  const dues = req.body.dues;

  const query =
    "INSERT INTO `VendorBills` VALUES (?,?,?,?,?,?)";
  try {
    db.query(
      query,
      [date,username,vendorID,equipID,reason,dues],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Note saved. Redirect to profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.get("/api/getEquips", async (req, res) => {
  console.log("User cookie is", req.sessionID);
  const username = req.session.username;
  console.log(username);

  const [rows, fields] = await db.query(
    "SELECT * FROM `Equipment` WHERE vendor=?",
    [username]
  );
  try {
    res.send({ success: true, info: rows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
  } 
);

app.post("/api/updateRepair", async (req, res) => {
  const username = req.session.username;
  const equipID = req.body.equipID;
  const repairStatus = req.body.repairStatus;

  const query =
    "UPDATE `Equipment` SET `repairStatus`=? WHERE equipID=?";
  try {
    db.query(
      query,
      [repairStatus, equipID],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Status updated. Redirect to profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.get("/api/getSupervisor", async (req, res) => {
  console.log("User cookie is", req.sessionID);
  const username = req.session.username;

  const [rows, fields] = await db.query(
    "SELECT * FROM `Supervisor` WHERE username=?",
    [username]
  );
  res.send({
    success: true,
    name: rows[0].name,
    employeeID: rows[0].employeeID,
  });
  } 
);

app.post("/api/updateSupervisor", async (req, res) => {
  const username = req.session.username;
  const employeeID = req.body.employeeID;
  const name = req.body.name;

  const query =
    "UPDATE `Supervisor` SET `employeeID`=?,`name`=? WHERE username=?";
  try {
    db.query(
      query,
      [employeeID, name, username],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Details updated. Redirect to profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.get("/api/getBills", async (req, res) => {
  console.log("User cookie is", req.sessionID);
  const username = req.session.username;
  console.log(username);

  const [rows, fields] = await db.query(
    "SELECT * FROM `VendorBills`",
    [username]
  );
  try {
    res.send({ success: true, info: rows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
  } 
);

app.post("/api/clearPay", async (req, res) => {
  const username = req.session.username;
  const vendorID = req.body.vendorID;
  const equipmentID = req.body.equipmentID;
  const dues = req.body.dues;
  console.log(vendorID);
  console.log(equipmentID);
  console.log(dues);
  const query ="UPDATE `Vendor` SET `dues`=`dues`+ ? WHERE `vendorID`=?";
  const lquery ="DELETE FROM `VendorBills` WHERE `vendorID`=? AND `equipID`=?";
  try {
    db.query(
      query,
      [dues, vendorID],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Details updated. Redirect to profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.get("/api/getRecs", async (req, res) => {
  console.log("User cookie is", req.sessionID);
  const username = req.session.username;
  console.log(username);

  const [rows, fields] = await db.query(
    "SELECT * FROM `CutRecs`",
    
  );
  try {
    res.send({ success: true, info: rows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
  } 
);

app.get("/api/getSchedule", async (req, res) => {
  console.log("User cookie is", req.sessionID);
  const username = req.session.username;
  console.log(username);

  const [rows, fields] = await db.query(
    "SELECT * FROM `WeekSchedule`",
    
  );
  try {
    res.send({ success: true, info: rows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
  } 
);

app.post("/api/manualSchedule", async (req, res) => {
  const username = req.session.username;
  const day = req.body.day;
  const garden = req.body.garden;
  const number = req.body.number;

  const query =
    "UPDATE `WeekSchedule` SET `number`=?, `garden`=? WHERE day=?";
  try {
    db.query(
      query,
      [number, garden, day],
      (err, res) => {
        if (err) throw err;
        console.log("res is", res);
      }
    );
    res.send({
      success: true,
      message: "Day updated. Redirect to profile.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

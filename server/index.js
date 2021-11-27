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

app.post("/api/addShopkeeperDetails", async (req, res) => {
  const username = req.session.username;
  const name = req.body.name;
  const store = req.body.store;
  const phno = req.body.phonenumber;
  const securitypassID = req.body.securitypass;
  const expiry = req.body.expiry;
  const storeID = Number(store.split("-")[0]);

  const passQuery = "SELECT * FROM `shopkeepers` WHERE `securitypassID` = ?";
  const [rows, fields] = await db.query(passQuery, [securitypassID]);
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

app.get("/api/getShopkeeper", async (req, res) => {
  console.log("User cookie is", req.sessionID);
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

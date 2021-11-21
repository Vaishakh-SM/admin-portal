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
    "SELECT `password`,`employment` FROM `Users` WHERE `username` = ?";

  const [rows, fields] = await db.query(passQuery, [username]);
  const requiredHash = rows[0].password;
  const emp = rows[0].employment;

  bcrypt.compare(password, requiredHash, (err, result) => {
    try {
      if (result == true) {
        req.session.username = username;

        console.log("Session is now ", req.sessionID);
        req.session.save();
        return res.send({
          success: true,
          employment: emp,
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
  const emp = req.body.emp;

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
    "INSERT IGNORE INTO `Users`(`username`,`password`,`employment`) VALUES (?,?,?)";
  try {
    bcrypt.hash(pass, saltRounds, function (err, hash) {
      if (err) throw err;
      db.query(query, [username, hash, emp], (err, res) => {
        if (err) throw err;
        console.log("res is ", res);
      });
    });
    res.send({
      success: true,
      message: "User successfully registered. Redirect to login.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.get("/api/getUser", (req, res) => {
  console.log("User cookie is", req.sessionID);
  res.send({ username: req.session.username });
});

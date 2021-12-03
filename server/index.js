const path = require("path");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const mysql = require("mysql2/promise");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const PDFDocument = require("pdfkit-table");

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
      message: "User successfully registered. Redirect to login.",
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: "Something went wrong. Try again" });
  }
});

app.get("/api/getUser", (req, res) => {
  res.send({
    username: req.session.username,
  });
});

app.get("/api/getUserID", async (req, res) => {
  const [rows, fields] = await db.query(
    "Select UID, RoleID FROM Users WHERE username =?",
    [req.session.username]
  );
  res.send({
    UID: rows[0].UID,
    RoleID: rows[0].RoleID,
  });
});

app.get("/api/extractStore", async (req, res) => {
  const query = "SELECT `StoreID`,`StoreName` from `Stores`";
  const [rows, fields] = await db.query(query);

  try {
    res.send({ success: true, info: rows });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});

app.post("/api/addMarketPeople", async (req, res) => {
  const name = req.body.name;
  const role = req.body.role;
  const store = req.body.store;
  const phno = req.body.phonenumber;
  const securitypassID = req.body.securitypass;
  const expiry = req.body.expiry;
  const storeID = Number(store.split("-")[0]);

  const passQuery = "SELECT * FROM `marketPeople` WHERE `securitypassID` = ?";
  const [rows, fields] = await db.query(passQuery, [securitypassID]);
  if (rows.length > 0) {
    res.send({ success: false, message: "User already exists." });
    throw new Error("User exists.");
  }

  const query = "INSERT IGNORE INTO `marketpeople` VALUES(?,?,?,?,?,?)";
  try {
    db.query(
      query,
      [securitypassID, storeID, name, expiry, phno, role],
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

app.get("/api/getMarketPeople", async (req, res) => {
  console.log("User cookie is", req.sessionID);
  const username = req.session.username;

  const [rows, fields] = await db.query(
    "SELECT * FROM `marketpeople` WHERE username=?",
    [username]
  );

  const [rows2, fields2] = await db.query(
    "SELECT `StoreName` FROM `Stores` WHERE `StoreID`=?",
    [rows[0].storeID]
  );

  try {
    res.send({
      success: true,
      username: req.session.username,
      name: rows[0].name,
      storeID: rows[0].storeID,
      storeName: rows2[0].StoreName,
      role: rows[0].role,
      phonenumber: rows[0].phonenumber,
      securitypassID: rows[0].securitypassID,
      passexpiry: rows[0].passexpiry.toDateString(),
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});

app.post("/api/guesthouse/searchRoom", async (req, res) => {
  const username = req.session.username;
  const capacity = req.body.capacity;
  const beds = req.body.beds;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const type = req.body.type;
  const [rows, fields] = await db.query(
    "SELECT RoomID, Rate FROM `Room` WHERE MaxCapacity >= ? AND Beds=? AND type=? AND RoomID NOT IN (Select RoomID FROM RoomBooking WHERE (StartDate >= ? AND StartDate <= ?) OR (EndDate >= ? AND EndDate <= ?)) LIMIT 10",
    [capacity, beds, type, startDate, endDate, startDate, endDate]
  );

  res.send({
    success: true,
    message: "The available rooms for entered data are:",
    rooms: rows,
  });
});

app.post("/api/guesthouse/bookRoom", async (req, res) => {
  const username = req.session.username;
  const RoomID = req.body.roomID;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const [checkQuery, checkFields] = await db.query(
    "Select RoomID FROM `RoomBooking` WHERE ((StartDate >= ? AND StartDate <= ?) OR (EndDate >= ? AND EndDate <= ?)) AND RoomID=?",
    [startDate, endDate, startDate, endDate, RoomID]
  );

  if (checkQuery.length > 0) {
    return res.send({
      success: false,
      message: "Room is already booked in given date",
    });
  }
  // Check if all constraints are followed if possible
  const UIDQuery = "SELECT `UID` FROM `Users` WHERE `username` = ?";

  const [q1rows, q1fields] = await db.query(UIDQuery, [username]);
  const UID = q1rows[0].UID;

  const [rows, fields] = await db.query(
    "INSERT INTO `RoomBooking` VALUES (NULL,?,?,?,?,'Pending')",
    [UID, RoomID, startDate, endDate]
  );

  return res.send({
    success: true,
  });
});

app.get("/api/assets/uploads/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads", req.params[0]));
});

app.get("/api/guesthouse/getFood", async (req, res) => {
  const [rows, fields] = await db.query("Select * FROM `Food`");

  res.send({ foodItems: rows });
});

app.post("/api/guesthouse/addFood", upload.single("file"), async (req, res) => {
  const file = req.file;

  await db.query("INSERT INTO `Food` VALUES (NULL,?,?,?,?)", [
    req.body.FoodName,
    req.body.FoodDesc,
    req.body.Rate,
    file.filename,
  ]);

  return res.send({ success: true });
});

app.post("/api/guesthouse/orderFood", async (req, res) => {
  const FoodID = req.body.FoodID;

  const [uid, uidfields] = await db.query(
    "SELECT UID FROM Users WHERE username = ?",
    [req.session.username]
  );
  var datetime = new Date();

  const [bookedRoom, bookedRoomFileds] = await db.query(
    "SELECT `RoomID` FROM `RoomBooking` WHERE UID = ? AND StartDate <= ? AND EndDate >= ?",
    [
      uid[0].UID,
      datetime.toISOString().slice(0, 10),
      datetime.toISOString().slice(0, 10),
    ]
  );

  await db.query(
    "INSERT INTO `FoodBooking` VALUES (NULL,?,?,?,'Placed','Pending')",
    [uid[0].UID, FoodID, datetime.toISOString().slice(0, 10)]
  );

  return res.send({ success: true });
});

app.get("/api/guesthouse/cook/getOrders", async (req, res) => {
  const [rows, fields] = await db.query("Select * FROM `PendingOrders`");
  res.send({ foodItems: rows });
});

app.post("/api/guesthouse/cook/deliver", async (req, res) => {
  console.log("ID is ", req.body.FoodBookingID);
  try {
    await db.query(
      "UPDATE `FoodBooking` SET `OrderStatus`='Delivered' WHERE FoodBookingID = ?",
      [req.body.FoodBookingID]
    );
  } catch (e) {
    res.send({ success: false, message: "Some error has occured" });
    console.log(e);
  }
  res.send({ success: true });
});

app.get("/api/guesthouse/employee/bill/*", async (req, res) => {
  const UID = req.params[0];

  const [foodBill, foodBillFields] = await db.query(
    "Select * from FoodBills WHERE UID = ?",
    [UID]
  );

  const [roomBill, roomBillFields] = await db.query(
    "Select * from RoomBills WHERE UID = ?",
    [UID]
  );

  const [totalBill, totalBillFields] = await db.query(
    "Select * from TotalBills WHERE UID = ?",
    [UID]
  );

  let foodDetails = [];

  for (var i in foodBill) {
    foodDetails.push([]);
    for (var j in foodBill[i]) {
      if (j == "BookedDate") {
        foodDetails[i].push(String(foodBill[i][j]).slice(0, 10));
      } else {
        foodDetails[i].push(foodBill[i][j]);
      }
    }
  }

  let roomDetails = [];

  for (var i in roomBill) {
    roomDetails.push([]);
    for (var j in roomBill[i]) {
      if (j == "EndDate") {
        roomDetails[i].push(String(roomBill[i][j]).slice(0, 10));
      } else {
        roomDetails[i].push(roomBill[i][j]);
      }
    }
  }

  let totalDetails = [];

  for (var i in totalBill) {
    totalDetails.push([]);
    for (var j in totalBill[i]) {
      totalDetails[i].push(totalBill[i][j]);
    }
  }

  const doc = new PDFDocument({ margin: 50, size: "A4" });

  const foodTable = {
    title: "Food Bills",
    subtitle: "Bills for all the Food Bookings",
    headers: ["User ID", "Food Name", "Date of booking", "Cost"],
    rows: foodDetails,
  };

  const roomTable = {
    title: "Room Bills",
    subtitle: "Bills for all the Room Bookings",
    headers: ["User ID", "Room ID", "Last Date of stay", "Cost"],
    rows: roomDetails,
  };

  const totalTable = {
    title: "Total Bill",
    headers: ["User ID", "Grand total"],
    rows: totalDetails,
  };

  doc.table(foodTable, {
    width: 400,
  });

  doc.table(roomTable, {
    width: 400,
  });

  doc.table(totalTable, {
    width: 400,
  });

  doc.pipe(res);
  doc.end();
});

app.get("/api/guesthouse/supervisor/getCooks", async (req, res) => {
  const [regularCooks, RCfields] = await db.query(
    "Select GuestHouseStaff.StaffID, GuestHouseStaff.Name FROM GuestHouseStaff, Users WHERE GuestHouseStaff.UID = Users.UID AND Users.RoleID=201"
  );

  const [contractualCooks, CCfields] = await db.query(
    "Select GuestHouseStaff.StaffID, GuestHouseStaff.Name FROM GuestHouseStaff, Users WHERE GuestHouseStaff.UID = Users.UID AND Users.RoleID=202"
  );

  const [cleaner, cleanerfields] = await db.query(
    "Select GuestHouseStaff.StaffID, GuestHouseStaff.Name FROM GuestHouseStaff, Users WHERE GuestHouseStaff.UID = Users.UID AND Users.RoleID=203"
  );

  res.send({
    regular: regularCooks,
    contractual: contractualCooks,
    cleaner: cleaner,
  });
});

app.post("/api/guesthouse/supervisor/setSchedule", async (req, res) => {
  await db.query(
    "DELETE FROM GuestHouseStaffSchedule WHERE ShiftDate >= ? AND ShiftDate <= DATE_ADD(?, INTERVAL 7 DAY)",
    [req.body.startDate, req.body.startDate]
  );

  // Inserting in day 1 - 4
  for (let i = 0; i < 4; i++) {
    await db.query(
      "INSERT INTO GuestHouseStaffSchedule VALUES(?,DATE_ADD(?, INTERVAL ? DAY),?), (?,DATE_ADD(?, INTERVAL ? DAY),?)",
      [
        req.body.contractual1.StaffID,
        req.body.startDate,
        String(i),
        "Morning",
        req.body.contractual1.StaffID,
        req.body.startDate,
        String(i),
        "Night",
      ]
    );

    await db.query(
      "INSERT INTO GuestHouseStaffSchedule VALUES(?,DATE_ADD(?, INTERVAL ? DAY),?), (?,DATE_ADD(?, INTERVAL ? DAY),?)",
      [
        req.body.contractual2.StaffID,
        req.body.startDate,
        String(i),
        "Morning",
        req.body.contractual2.StaffID,
        req.body.startDate,
        String(i),
        "Night",
      ]
    );

    await db.query(
      "INSERT INTO GuestHouseStaffSchedule VALUES(?,DATE_ADD(?, INTERVAL ? DAY),?), (?,DATE_ADD(?, INTERVAL ? DAY),?)",
      [
        req.body.cleaner1.StaffID,
        req.body.startDate,
        String(i),
        "Morning",
        req.body.cleaner1.StaffID,
        req.body.startDate,
        String(i),
        "Night",
      ]
    );
  }

  // Day 5,7
  for (let i of ["4", "6"]) {
    await db.query(
      "INSERT INTO GuestHouseStaffSchedule VALUES(?,DATE_ADD(?, INTERVAL ? DAY),?), (?,DATE_ADD(?, INTERVAL ? DAY),?)",
      [
        req.body.regular.StaffID,
        req.body.startDate,
        i,
        "Morning",
        req.body.regular.StaffID,
        req.body.startDate,
        i,
        "Night",
      ]
    );

    await db.query(
      "INSERT INTO GuestHouseStaffSchedule VALUES(?,DATE_ADD(?, INTERVAL ? DAY),?), (?,DATE_ADD(?, INTERVAL ? DAY),?)",
      [
        req.body.contractual1.StaffID,
        req.body.startDate,
        i,
        "Morning",
        req.body.contractual1.StaffID,
        req.body.startDate,
        i,
        "Morning",
      ]
    );

    await db.query(
      "INSERT INTO GuestHouseStaffSchedule VALUES(?,DATE_ADD(?, INTERVAL ? DAY),?), (?,DATE_ADD(?, INTERVAL ? DAY),?)",
      [
        req.body.cleaner2.StaffID,
        req.body.startDate,
        i,
        "Morning",
        req.body.cleaner2.StaffID,
        req.body.startDate,
        i,
        "Morning",
      ]
    );
  }

  // Day 6

  await db.query(
    "INSERT INTO GuestHouseStaffSchedule VALUES(?,DATE_ADD(?, INTERVAL ? DAY),?), (?,DATE_ADD(?, INTERVAL ? DAY),?)",
    [
      req.body.regular.StaffID,
      req.body.startDate,
      "5",
      "Morning",
      req.body.regular.StaffID,
      req.body.startDate,
      "5",
      "Night",
    ]
  );

  await db.query(
    "INSERT INTO GuestHouseStaffSchedule VALUES(?,DATE_ADD(?, INTERVAL ? DAY),?), (?,DATE_ADD(?, INTERVAL ? DAY),?)",
    [
      req.body.contractual2.StaffID,
      req.body.startDate,
      "5",
      "Morning",
      req.body.contractual2.StaffID,
      req.body.startDate,
      "5",
      "Morning",
    ]
  );

  await db.query(
    "INSERT INTO GuestHouseStaffSchedule VALUES(?,DATE_ADD(?, INTERVAL ? DAY),?), (?,DATE_ADD(?, INTERVAL ? DAY),?)",
    [
      req.body.cleaner2.StaffID,
      req.body.startDate,
      "5",
      "Morning",
      req.body.cleaner2.StaffID,
      req.body.startDate,
      "5",
      "Morning",
    ]
  );

  res.send({ success: true });
});

app.post("/api/guesthouse/supervisor/getSchedule", async (req, res) => {
  const [schedule, scheduleFields] = await db.query(
    "Select GuestHouseStaff.Name, GuestHouseStaffSchedule.ShiftDate, GuestHouseStaffSchedule.ShiftTime FROM GuestHouseStaffSchedule, GuestHouseStaff WHERE ShiftDate >= ? AND ShiftDate <= ? AND GuestHouseStaff.StaffID = GuestHouseStaffSchedule.StaffID",
    [req.body.startDate, req.body.endDate]
  );

  res.send({ schedule: schedule });
});

app.post("/api/guesthouse/supervisor/setScheduleOnDate", async (req, res) => {
  if (req.body.shift == "Both") {
    await db.query("DELETE FROM GuestHouseStaffSchedule WHERE ShiftDate = ?", [
      req.body.startDate,
    ]);

    await db.query("INSERT INTO GuestHouseStaffSchedule VALUES (?,?,?)", [
      req.body.cook1.StaffID,
      req.body.startDate,
      "Morning",
    ]);

    await db.query("INSERT INTO GuestHouseStaffSchedule VALUES (?,?,?)", [
      req.body.cook1.StaffID,
      req.body.startDate,
      "Night",
    ]);

    await db.query("INSERT INTO GuestHouseStaffSchedule VALUES (?,?,?)", [
      req.body.cook2.StaffID,
      req.body.startDate,
      "Morning",
    ]);

    await db.query("INSERT INTO GuestHouseStaffSchedule VALUES (?,?,?)", [
      req.body.cook2.StaffID,
      req.body.startDate,
      "Night",
    ]);

    await db.query("INSERT INTO GuestHouseStaffSchedule VALUES (?,?,?)", [
      req.body.cleaner.StaffID,
      req.body.startDate,
      "Morning",
    ]);

    await db.query("INSERT INTO GuestHouseStaffSchedule VALUES (?,?,?)", [
      req.body.cleaner.StaffID,
      req.body.startDate,
      "Night",
    ]);
  } else {
    await db.query(
      "DELETE FROM GuestHouseStaffSchedule WHERE ShiftDate = ? AND ShiftTime = ?",
      [req.body.startDate, req.body.shift]
    );

    await db.query("INSERT INTO GuestHouseStaffSchedule VALUES (?,?,?)", [
      req.body.cook1.StaffID,
      req.body.startDate,
      req.body.shift,
    ]);

    await db.query("INSERT INTO GuestHouseStaffSchedule VALUES (?,?,?)", [
      req.body.cook2.StaffID,
      req.body.startDate,
      req.body.shift,
    ]);

    await db.query("INSERT INTO GuestHouseStaffSchedule VALUES (?,?,?)", [
      req.body.cleaner.StaffID,
      req.body.startDate,
      req.body.shift,
    ]);
  }

  res.send({ success: true });
});

app.get("/api/guesthouse/employee/getPendingFoodForID/*", async (req, res) => {
  const UID = req.params[0];

  const [rows, fields] = await db.query(
    "Select FoodBooking.FoodBookingID, Food.FoodName, Food.Rate, FoodBooking.BookedDate FROM FoodBooking, Food WHERE UID=? AND OrderStatus='Delivered' AND PaymentStatus='Pending' AND FoodBooking.FoodID = Food.FoodID",
    [UID]
  );

  res.send({ bill: rows });
});

app.post("/api/guesthouse/employee/clearBillsForID/", async (req, res) => {
  await db.query("DELETE FROM FoodBooking WHERE UID =?", [req.body.UID]);
  await db.query("DELETE FROM RoomBooking WHERE UID =?", [req.body.UID]);
  res.send({ success: true });
});

app.post("/api/guesthouse/employee/clearFoodBillsByID/", async (req, res) => {
  await db.query("DELETE FROM FoodBooking WHERE FoodBookingID =?", [
    req.body.FoodBookingID,
  ]);
  res.send({ success: true });
});

app.post("/api/guesthouse/employee/clearRoomBillsByID/", async (req, res) => {
  await db.query("DELETE FROM RoomBooking WHERE RoomBookingID =?", [
    req.body.RoomBookingID,
  ]);
  res.send({ success: true });
});

app.get("/api/guesthouse/employee/getPendingRoomForID/*", async (req, res) => {
  const UID = req.params[0];

  const [rows, fields] = await db.query(
    "SELECT UID, RoomBookingID, RoomID, EndDate, (Days*Rate) AS Cost FROM (Select RoomBooking.RoomBookingID, RoomBooking.UID, RoomBooking.RoomID, DATEDIFF(EndDate,StartDate) As Days, Room.Rate, RoomBooking.EndDate FROM RoomBooking, Room WHERE Room.RoomID = RoomBooking.RoomID AND RoomBooking.PaymentStatus='Pending') AS T WHERE UID = ?",
    [UID]
  );

  res.send({ bill: rows });
});

app.post("/api/guesthouse/employee/addExpenditure", async (req, res) => {
  await db.query("INSERT INTO GuestHouseExpenditure VALUES (NULL,?,?,?)", [
    req.body.ExpDesc,
    req.body.ExpDate,
    req.body.TotalExp,
  ]);

  res.send({ success: true });
});

app.post("/api/guesthouse/employee/getExpenditure", async (req, res) => {
  const [rows, fields] = await db.query(
    "Select * FROM GuestHouseExpenditure WHERE ExpDate >= ? AND ExpDate <= ?",
    [req.body.startDate, req.body.endDate]
  );

  res.send({ expenditure: rows });
});

app.post("/api/guesthouse/employee/deleteExpenditure", async (req, res) => {
  await db.query("DELETE FROM GuestHouseExpenditure WHERE ExpID = ?", [
    req.body.ExpID,
  ]);

  res.send({ success: true });
});

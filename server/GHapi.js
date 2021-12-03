function searchRoom(app, db) {
  app.post("/api/guesthouse/searchRoom", async (req, res) => {
    const capacity = req.body.capacity;
    const beds = req.body.beds;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const type = req.body.type;
    const [rows, fields] = await db.query(
      "SELECT RoomID FROM `Room` WHERE MaxCapacity >= ? AND Beds=? AND type=? AND RoomID NOT IN (Select RoomID FROM Bookings WHERE (StartDate >= ? AND StartDate <= ?) OR (EndDate >= ? AND EndDate <= ?)) LIMIT 10",
      [capacity, beds, type, startDate, endDate, startDate, endDate]
    );

    res.send({
      success: true,
      message: "The available rooms for entered data are:",
      rooms: rows,
    });
  });
}

function bookRoom(app, db) {
  app.post("/api/guesthouse/bookRoom", async (req, res) => {
    const username = req.session.username;
    const RoomID = req.body.roomID;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    const UIDQuery = "SELECT `UID` FROM `Users` WHERE `username` = ?";

    const [q1rows, q1fields] = await db.query(UIDQuery, [username]);
    const UID = q1rows[0].UID;

    const [rows, fields] = await db.query(
      "INSERT INTO `Bookings` VALUES (?,?,?,?)",
      [UID, RoomID, startDate, endDate]
    );

    res.send({
      success: true,
    });
  });
}

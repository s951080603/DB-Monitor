const express = require("express");
const { client } = require("./config.js");
const app = express();
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// LISTEN database

let formatData;

(async () => {
  formatData = await parseData();
})();

client.connect();

client.query("LISTEN record_changes");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

async function parseData() {
  try {
    const records = await client.query(
      'SELECT RegistedSnrs.sensorid, RegistedSnrs.mac, Subtype."Desc", Subtype.unit, Records.*, locations."locDesc" \
    FROM RegistedSnrs \
    INNER JOIN Subtype ON RegistedSnrs.stypeid = Subtype.stypeid \
    INNER JOIN Records ON RegistedSnrs.sensorid = Records.sensorid INNER JOIN locations ON RegistedSnrs.locid = locations.locid\
    ORDER BY Records."timestamp" DESC'
    );
    const recordsRow = records.rows;

    // format timestamp to Local timestamp
    for (const row of recordsRow) {
      row.value = row.value + " " + row.unit;
      row.timestamp = new Date(row.timestamp).toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        hour12: false,
      });
    }

    return recordsRow;
  } catch (e) {
    console.log("query error!");
    console.log(e);
    return;
  }
}

// socket connect
io.on("connection", (socket) => {
  console.log("A client connected");

  // send message to ALL client
  io.emit("message", "A new client connected");

  // when access the record insert or update
  client.on("notification", (msg) => {
    console.log(`Received notification: ${msg.payload}`);

    const objPayload = JSON.parse(msg.payload);

    const newPayload = {
      ...objPayload,
      value: objPayload.value + " " + objPayload.unit,
      timestamp: new Date(objPayload.timestamp).toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        hour12: false,
      }),
    };

    // update local data
    const tempData = formatData;
    if (!checkJsonDuplicate(objPayload, tempData)) {
      formatData = [newPayload, ...tempData];
      console.log(newPayload);
      socket.emit("db-notify", newPayload);
    }
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

app.get("/record/all", (req, res) => {
  try {
    const start = new Date();
    res.json(formatData);
    const end = new Date();
    console.log(`spend ${(end - start) / 1000}s`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Interval Server Error");
  }
});

app.listen(8963, () => {
  console.log("Server listening at port 8963 !!");
});

// data format
// Received notification: {"sensorid":75,"timestamp":"2023-05-14T14:15:37","value":0.01,"voltage":3.6}

server.listen(8080, () => {
  console.log("Socket.io server is running on port 8080");
});

function checkJsonDuplicate(newObj, objList) {
  objList.forEach((obj, index) => {
    if (JSON.stringify(newObj) === JSON.stringify(obj)) {
      return true;
    }
    if (index > 30) {
      // early return
      return false;
    }
  });
}

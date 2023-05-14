const express = require("express");

const { client } = require("./config.js");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const { log } = require("console");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// LISTEN database

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

app.get("/record/all", async (req, res) => {
  try {
    const queryResult = await client.query(
      'SELECT * FROM Records ORDER BY "timestamp" DESC'
    );
    const rows = queryResult.rows;
    for (const row of rows) {
      row.timestamp = new Date(row.timestamp).toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        hour12: false,
      });
    }
    res.json(rows);
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

io.on("connection", (socket) => {
  console.log("A client connected");

  // 在此發送訊息給所有客戶端
  io.emit("message", "A new client connected");

  client.on("notification", (msg) => {
    console.log(`Received notification: ${msg.payload}`);
    // 在此發送訊息給當前客戶端
    const objPayload = JSON.parse(msg.payload);
    const newPayload = {
      ...objPayload,
      timestamp: new Date(objPayload.timestamp).toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        hour12: false,
      }),
    };

    socket.emit("db-notify", newPayload);
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

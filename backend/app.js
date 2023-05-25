const express = require("express");
const { client } = require("./config.js");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});
// LISTEN database

let formatData;

(async () => {
  formatData = await parseData(
    'SELECT RegistedSnrs.sensorid, RegistedSnrs.mac, Subtype."Desc", Subtype.unit, Records.*, locations."locDesc" \
  FROM RegistedSnrs \
  INNER JOIN Subtype ON RegistedSnrs.stypeid = Subtype.stypeid \
  INNER JOIN Records ON RegistedSnrs.sensorid = Records.sensorid INNER JOIN locations ON RegistedSnrs.locid = locations.locid\
  ORDER BY Records."timestamp" DESC LIMIT 100'
  );
})(); // Daily Update Local Records Data
setInterval(async () => {
  formatData = await parseData();
  console.log(
    `Daily update data at ${new Date(Date.now()).toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      hour12: false,
    })}`
  );
}, 1000 * 60 * 60 * 24);

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

async function parseData(queryString) {
  try {
    const records = await client.query(queryString);
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
io.on("connection", () => {
  console.log("A client connected");

  // send message to ALL client
  io.emit("message", "A new client connected");
});

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
  formatData = [newPayload, ...tempData];
  console.log(newPayload);

  io.emit("db-notify", newPayload);
});

io.on("disconnect", () => {
  console.log("A client disconnected");
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

app.get("/record/:devEUI", (req, res) => {
  try {
    const devEUI = req.params.devEUI;
    (async () => {
      formatData = await parseData(
        `select * from records where sensorid in (select sensorid from registedsnrs where mac = '${devEUI}') order by "timestamp" desc`
      );
    })();
    res.json(formatData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Interval Server Error");
  }
});

app.get("/location", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM locations");
    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Interval Server Error");
  }
});

app.post("/location", async (req, res) => {
  try {
    // Access the request body
    const { locid, custid, bldno, floor, locDesc } = req.body;

    await client.query(
      `INSERT INTO locations (locid, custid, bldno, floor, locDesc) VALUES (${locid}, ${custid}, ${bldno}, ${floor}, ${locDesc})`
    );

    // Send a response
    res.status(200).json({ message: "Location data inserted successfully" });
  } catch (error) {
    console.error("Error inserting location data:", error);
    res.status(500).json({ message: "Error inserting location data" });
  }
});

app.patch("/sensor/:devEUI", async (req, res) => {
  try {
    const devEUI = req.params.devEUI;
    const body = req.body;
    console.log(body);
    console.log(devEUI);
    await client.query(`UPDATE registedsnrs SET locid = ${body.locid}
    WHERE mac = '${devEUI}';`);

    res.status(200).json({ message: "Update location id success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error inserting location data" });
  }
  // 这里可以根据 devEUI 进行相应的处理逻辑
  // ...
});

app.listen(8963, () => {
  console.log("Server listening at port 8963 !!");
});

// data format
// Received notification {"sensorid":75,"timestamp":"2023-05-14T14:15:37","value":0.01,"voltage":3.6}

server.listen(8080, () => {
  console.log("Socket.io server is running on port 8080");
});

const express = require("express");
const { pool, client } = require("./config.js");
const { chartHTML, getLoc, getdata } = require("./7-day-query.js");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const server = http.createServer(app);
const moment = require("moment");

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

// Daily Update Local Records Data
// setInterval(async () => {
//   formatData = await parseData();
//   console.log(
//     `Daily update data at ${new Date(Date.now()).toLocaleString("zh-TW", {
//       timeZone: "Asia/Taipei",
//       hour12: false,
//     })}`
//   );
// }, 1000 * 60 * 60 * 24);

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
      if (row.Desc == "TVOC") {
        row.value *= 1000;
        row.unit = "ppb";
      }
      row.timestamp = new Date(row.timestamp).toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        hourCycle: "h23",
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
    value:
      objPayload.Desc == "TVOC" ? objPayload.value * 1000 : objPayload.value,
    unit: objPayload.Desc == "TVOC" ? "ppb" : objPayload.unit,
    timestamp: new Date(objPayload.timestamp).toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      hourCycle: "h23",
    }),
  };

  // update local data
  const tempData = formatData;
  if (tempData != null) formatData = [newPayload, ...tempData];
  console.log(newPayload);

  io.emit("db-notify", newPayload);
});

io.on("disconnect", () => {
  console.log("A client disconnected");
});

app.get("/record/all", async (req, res) => {
  try {
    const start = new Date();

    formatData = await parseData(
      'SELECT RegistedSnrs.sensorid, RegistedSnrs.mac, Subtype."Desc", Subtype.unit, Records.*,locations.locid, locations."locDesc" \
      FROM RegistedSnrs \
      INNER JOIN Subtype ON RegistedSnrs.stypeid = Subtype.stypeid \
      INNER JOIN Records ON RegistedSnrs.sensorid = Records.sensorid INNER JOIN locations ON RegistedSnrs.locid = locations.locid\
      ORDER BY Records."timestamp" DESC'
    );

    res.json(formatData);
    const end = new Date();
    console.log(`spend ${(end - start) / 1000}s`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Interval Server Error");
  }
});

// Deprecated: Replace 'timeInterval' with 'start_time' when querying records for a specific timestamp interval.
/*
app.get("/record", async (req, res) => {
  try {
    const timeInterval = req.query.timeInterval;
    const endTime = Math.floor(Date.now() / 1000);
    formatData = await parseData(
      // 將 JS timestamp 轉為 PostgreSQL timestamp without time zone
      `SELECT RegistedSnrs.sensorid, RegistedSnrs.mac, Subtype."Desc", Subtype.unit, Records.*, locations.locid, locations."locDesc"
      FROM RegistedSnrs
      INNER JOIN Subtype ON RegistedSnrs.stypeid = Subtype.stypeid
      INNER JOIN Records ON RegistedSnrs.sensorid = Records.sensorid
      INNER JOIN locations ON RegistedSnrs.locid = locations.locid
      WHERE Records."timestamp" >= (NOW() -interval '${timeInterval || "8h"}'
        ) AND Records."timestamp" <= to_timestamp(${endTime})::timestamp without time zone
      ORDER BY Records."timestamp" DESC`
    ); 
    res.json(formatData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Interval Server Error");
  }
});
*/

app.get("/record", async (req, res) => {
  try {
    const startTime = req.query.startTime;
    const endTime = Math.floor(Date.now() / 1000);

    formatData = await parseData(
      `SELECT RegistedSnrs.sensorid, RegistedSnrs.mac, Subtype."Desc", Subtype.unit, Records.*, locations.locid, locations."locDesc"
      FROM RegistedSnrs
      INNER JOIN Subtype ON RegistedSnrs.stypeid = Subtype.stypeid
      INNER JOIN Records ON RegistedSnrs.sensorid = Records.sensorid
      INNER JOIN locations ON RegistedSnrs.locid = locations.locid
      WHERE Records."timestamp" >= '${startTime}'
      AND Records."timestamp" <= to_timestamp(${endTime})::timestamp without time zone
      ORDER BY Records."timestamp" DESC`
    ); /* 將 JS timestamp 轉為 PostgreSQL timestamp without time zone*/

    res.json(formatData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Interval Server Error");
  }
});

app.get("/record/:devEUI", async (req, res) => {
  try {
    const devEUI = req.params.devEUI;
    formatData = await parseData(
      `SELECT RegistedSnrs.sensorid, RegistedSnrs.mac, Subtype."Desc", Subtype.unit, Records.*,locations.locid , locations."locDesc" \
      FROM RegistedSnrs \
      INNER JOIN Subtype ON RegistedSnrs.stypeid = Subtype.stypeid \
      INNER JOIN Records ON RegistedSnrs.sensorid = Records.sensorid INNER JOIN locations ON RegistedSnrs.locid = locations.locid\
      WHERE RegistedSnrs.sensorid IN (select sensorid from registedsnrs where mac = '${devEUI}')
      ORDER BY Records."timestamp" DESC`
    );

    res.json(formatData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Interval Server Error");
  }
});

app.get("/location", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM locations ORDER BY locid");
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
      `INSERT INTO locations (locid, custid, bldno, floor, "locDesc") VALUES (${locid}, '${custid}', '${bldno}', ${floor}, '${locDesc}')`
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

app.get("/charts", function (req, resp) {
  let selected = "54";
  let search_ymd = moment()
    .add(-3, "days")
    .toISOString()
    .split("T")[0]
    .substring(0, 10); //日期預設值

  if (req.query.sensor_select != undefined) {
    selected = req.query.sensor_select;
  }

  if (req.query.yymmddd != undefined) {
    search_ymd = req.query.yymmddd;
  }

  console.log(req.query.sensor_select + "," + req.query.yymmddd);

  const set_hours = "24"; //設定1天查詢幾小時

  //getdata('32','2023-06-12','24','3',cbpm=>{

  getdata(selected, search_ymd, set_hours, "7", (cbpm) => {
    // console.log(cbpm);
    getLoc("", (list) => {
      let date_script = `\n<script type='text/javascript'>
	  	const datepicker = require('js-datepicker')
	  	const picker = datepicker('.yymmddd', {
		  formatter: (input, date, instance) => {
		    const value = date.toLocaleDateString()
		    input.value = value 
		  }
		})
  		</script>\n`;

      let select =
        date_script +
        '<form id="form1" action="http://140.138.179.222:8963/charts" method="get">\n';
      select +=
        '請選擇感測器: <select name="sensor_select" id="sensor_select">\n';

      for (var i = 0; i < list.length; i++) {
        if (list[i].sensorid == selected) {
          select =
            select +
            '<option value="' +
            list[i].sensorid +
            '" selected>' +
            list[i].sensorid +
            "-" +
            list[i].Desc +
            " " +
            list[i].locDesc +
            "</option>\n";
          console.log(list[i]);
          defaul_title = list[i];
        } else {
          select =
            select +
            '<option value="' +
            list[i].sensorid +
            '">' +
            list[i].sensorid +
            "-" +
            list[i].Desc +
            " " +
            list[i].locDesc +
            "</option>\n";
          console.log(list[i]);
        }
      }
      select = select + "</select>";
      select =
        select +
        '請選擇日期:<input type="date" id="yymmddd" name="yymmddd" required><button type="submit" name="submit">查詢</button></form>\n';
      resp.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      resp.write(
        '<link rel="stylsheet" type="text/css" href="datepicker.min.css">'
      );

      resp.write(select);

      var h = chartHTML(cbpm, defaul_title);
      resp.write(h);

      //console.log(select)

      resp.end();
    });
  });
});

//app.get('/liff/:dd', function (req, resp) {
app.get("/liff/:dd/:devid/:hh", function (req, resp) {
  //const cond='2023-06-08'
  const cond = req.params.dd;
  const id = req.params.devid;
  const hh = req.params.hh;

  getdata(id, cond, hh, (cbpm) => {
    getloc(id, (char_title) => {
      resp.writeHead(200, { "Content-Type": "text/html" });
      var h = chartHTML(id, cbpm, char_title[0], cond);
      resp.write(h);
      // console.log(h);
      resp.end();
    });
  });
});

app.listen(8963, () => {
  console.log("Server listening at port 8963 !!");
});

// data format
// Received notification {"sensorid":75,"timestamp":"2023-05-14T14:15:37","value":0.01,"voltage":3.6}

server.listen(8080, () => {
  console.log("Socket.io server is running on port 8080");
});

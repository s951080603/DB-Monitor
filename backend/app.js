const express = require("express");

const { client } = require("./config.js");
const app = express();
// LISTEN database

client.connect();

client.query("LISTEN record_changes");

client.on("notification", (msg) => {
  console.log(`Received notification: ${msg.payload}`);
});
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
    const queryResult = await client.query('SELECT * FROM Records ORDER BY "timestamp" DESC');
    res.json(queryResult.rows);
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

const express = require("express");
const { Client } = require("pg");

const app = express();
// LISTEN database

const client = new Client({
  user: "postgres",
  host: "epa.clrt814nnnpd.ap-southeast-1.rds.amazonaws.com",
  database: "epa",
  password: "#Yzu70936",
  port: 5432,
});

client.connect();

client.query("LISTEN record_changes");

client.on("notification", (msg) => {
  console.log(`Received notification: ${msg.payload}`);
});

app.get("/record/all", async (req, res) => {
  try {
    const queryResult = await client.query("SELECT * FROM Records");
    res.json(queryResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Interval Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server listening at port 3000 !!");
});

// data format
// Received notification: {"sensorid":75,"timestamp":"2023-05-14T14:15:37","value":0.01,"voltage":3.6}

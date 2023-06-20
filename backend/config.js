const { Pool, Client } = require("pg");
const moment = require("moment");

module.exports.client = new Client({
  user: "postgres",
  host: "epa.clrt814nnnpd.ap-southeast-1.rds.amazonaws.com",
  database: "epa",
  password: "#Yzu70936",
  port: 5432,
});

let types = require("pg").types;
const credentials = {
  user: "hywu",
  host: "epa.clrt814nnnpd.ap-southeast-1.rds.amazonaws.com",
  database: "sensors",
  password: "Oc!(L2vp",
  port: 5432,
};
module.exports.pool = new Pool({
  user: "postgres",
  host: "epa.clrt814nnnpd.ap-southeast-1.rds.amazonaws.com",
  database: "epa",
  password: "#Yzu70936",
  port: 5432,
});

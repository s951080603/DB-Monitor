const { Client } = require("pg");
module.exports.client = new Client({
  user: "postgres",
  host: "epa.clrt814nnnpd.ap-southeast-1.rds.amazonaws.com",
  database: "epa",
  password: "#Yzu70936",
  port: 5432,
});

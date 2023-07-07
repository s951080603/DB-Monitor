const { pool } = require("./config");
const moment = require("moment");

module.exports.getLoc = async function getLoc(sid, cb) {
  try {
    //sid='28'
    let queryStr = `select l."locDesc",s."Desc",re.sensorid  
    from registedsnrs re,locations l,subtype s
    where re.locid=l.locid AND s.stypeid=re.stypeid
    AND (l.bldno::text = '2'::text OR l.bldno::text = '3'::text)
    AND re.sensorid >= 52`;

    if (sid != "") queryStr = queryStr + ` and re.sensorid='${sid}'`;
    else queryStr = queryStr + ` order by re.sensorid`;

    const client = await pool.connect();

    await client.query(queryStr, function (err, res) {
      if (res.rows.length >= 1) cb(res.rows);
    });

    client.release();
    //client.end()
  } catch (err) {
    throw err;
  }
};

// id, lastDate, timeRangeOfChart, numberOfCharts, cb
module.exports.getdata = async function getdata(sensorid, dd, h = 8, days, cb) {
  try {
    const client = await pool.connect();

    let limit_n = h * 12 * days;
    let search_ymd = null;
    var time_data = [];
    var val_data = [];

    var results = [];

    search_ymd = moment(dd)
      .subtract(days - 1, "d")
      .format("YYYY-MM-DD");

    const queryStr = `SELECT grid.t5, ROUND(AVG(CASE WHEN t.sensorid IN (
      SELECT DISTINCT r1.sensorid
      FROM records r1, registedsnrs re, subtype s
      WHERE r1.sensorid = re.sensorid
          AND s.stypeid = re.stypeid
          AND s."Desc" = 'TVOC'
      ) THEN t.value * 1000 ELSE t.value END), 3) AS avg_value
      FROM (
      SELECT generate_series('${search_ymd} 00:00:00', '${dd} 23:59:59', interval '5 min') AS t5
      ) grid
      LEFT JOIN records t ON t."timestamp" >= grid.t5
      AND t."timestamp" < grid.t5 + interval '5 min'
      AND t.sensorid = '${sensorid}'
      AND "timestamp" > '${search_ymd} 00:00:00'
      GROUP BY grid.t5
      ORDER BY grid.t5
      LIMIT ${limit_n}
  `;

    //

    await client.query(queryStr, function (err, res) {
      if (err) {
        throw err;
      }

      //
      // console.log(res);

      var j = 0;
      var ymd = "";
      var ymd2 = "";
      var max_avg_value = 0;
      for (var i = 0; i < res.rows.length; i++) {
        ymd = moment(res.rows[i].t5)
          .add(8, "h")
          .toISOString()
          .split("T")[0]
          .substring(0, 10);
        if (ymd != ymd2) {
          time_data[ymd] = [];
          val_data[ymd] = [];
          j = 0;
        }

        time_data[ymd][j] = moment(res.rows[i].t5)
          .add(8, "h")
          .toISOString()
          .split("T")[1]
          .substring(0, 5);
        if (Number(res.rows[i].avg_value) > max_avg_value) {
          max_avg_value = res.rows[i].avg_value;
        }
        val_data[ymd][j] = res.rows[i].avg_value;
        ymd2 = ymd;
        j++;
      }
      results["time"] = time_data;
      results["val"] = val_data;
      results["max_avg_value"] = max_avg_value;
      cb(results);
    });

    client.release();
  } catch (err) {
    throw err;
  }
};

module.exports.chartHTML = function chartHTML(data_arr, chart_tit) {
  //圖表標題
  // BarCharName= JSON.stringify(chart_tit.locDesc+' '+dd)
  let BarCharName = [];

  let group_title = [];
  let group_label = [];
  let group_val = [];

  var idx = 0;

  var coloR = [];
  var dynamicColors = function () {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);

    var rgb = `'rgba(${r},${g},${b},1)'`;
    var rgba = `'rgba(${r},${g},${b},0.2)'`;
    return [rgb, rgba];
  };

  group_title[0] = JSON.stringify(chart_tit.Desc);
  var html_content = "";
  var html_script = "";
  var html_script2 = "";
  var html_script3 = "";
  var chart_ymd = Object.keys(data_arr["time"]);
  coloR.push(dynamicColors());

  for (var i = 0; i < chart_ymd.length; i++) {
    BarCharName[i] = JSON.stringify(chart_tit.locDesc + " " + chart_ymd[i]);
    group_label[i] = JSON.stringify(data_arr["time"][chart_ymd[i]]);
    group_val[i] = JSON.stringify(data_arr["val"][chart_ymd[i]]);
    coloR.push(dynamicColors());

    html_content += `<div id="container${i}" style="width: 75%;"><canvas id="canvas${i}"></canvas></div>`;
    html_script += `
			var barChartData${i} = {
			  labels: 
				${group_label[i]}
			  ,
			  datasets: [
				{
				  label: ${group_title[0]},
				  backgroundColor: ${coloR[i][0]},
				  borderColor: ${coloR[i][1]},
				  borderWidth: 1,
				  data: ${group_val[i]}
				} 
			  ]
			};

			var chartOptions${i} = {
			  responsive: true,
			  legend: {
				position: "top"
			  },
			  title: {
				display: true,
				text: ${BarCharName[i]}
			  },
			  scales: {
				yAxes: [{
				  ticks: {
					beginAtZero: true,
          max: ${Math.round(data_arr["max_avg_value"] * 1.1)}
				  }
				}]
        
			  }
			}`;

    html_script2 += `  
		 var ctx${i} = document.getElementById("canvas${i}").getContext("2d");\n`;
    html_script3 += `
      window.myBar${i} = new Chart(ctx${i}, {
			type: "bar",
			data: barChartData${i},
			options: chartOptions${i}
		  });`;
  }

  var html = `<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"></script>`;

  html += html_content + `<script>` + html_script;
  html +=
    `
  window.onload = function() {` + html_script2;
  html += html_script3 + `};`;
  html += `</script>;`;

  return html;
};

import "./style.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useParams } from "react-router-dom";
import "chartjs-adapter-moment";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

const topColumns = [
  {
    id: "devEUI",
    label: "DEV EUI",
    minWidth: 150,
    align: "center",
    key: "mac",
  },
  {
    id: "subtype",
    label: "Subtype and Sensor ID",
    minWidth: 150,
    align: "center",
    key: "Desc",
  },
  {
    id: "locDesc",
    label: "Subtype",
    minWidth: 150,
    align: "center",
    key: "locDesc",
  },
  {
    id: "voltage",
    label: "Current Voltage",
    minWidth: 150,
    align: "center",
    key: "voltage",
  },
  {
    id: "timestamp",
    label: "Last Update Time",
    minWidth: 150,
    align: "center",
    key: "timestamp",
  },
];

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    // title: {
    //   display: true,
    //   text: "Chart.js Line Chart",
    // },
  },
  scales: {
    x: {
      type: "time",
      min: Date.now() - 8 * 60 * 60 * 1000,
      max: Date.now(),
    },
  },
};

const Dashboard = ({ locationList, rows, installedLocations }) => {
  //NOTE: 待修正 Humidity 和 Temperature 的 Line Chart x-axis
  const [pm25Rows, setPm25Rows] = useState([]);
  const [tvocRows, setTvocRows] = useState([]);
  const [humidityRows, setHumidityRows] = useState([]);
  const [temperatureRows, setTemperatureRows] = useState([]);
  // const [filterRows, setFilterRows] = useState([]);

  const [latestDataPM25, setLatestDataPM25] = useState(null);
  const [latestDataTVOC, setLatestDataTVOC] = useState(null);
  let { location = installedLocations[0] } = useParams();
  // locationList.map((loc)=> {return {}} )

  // const locId = locationList.find((loc) => loc.locDesc == location)?.locid;
  const filterRows = rows.filter((row) => row.locid == location);
  useEffect(() => {
    setPm25Rows(() => {
      const newPm25Rows = filterRows.filter((row) => row.Desc == "PM2.5");
      setLatestDataPM25(newPm25Rows[0]);
      return newPm25Rows;
    });
    setTvocRows(() => {
      const newTvocRows = filterRows.filter((row) => row.Desc == "TVOC");
      setLatestDataTVOC(newTvocRows[0]);

      return newTvocRows;
    });
    setHumidityRows(
      filterRows.filter((row) => row.Desc == "Relative Humidity")
    );
    setTemperatureRows(filterRows.filter((row) => row.Desc == "Temperature"));
  }, [location, rows]);

  // const data = {
  //   labels: pm25Rows
  //     .slice(0, 7)
  //     .reverse()
  //     .map((row) => row.timestamp),
  //   datasets: [
  //     {
  //       label: "Dataset 1",
  //       data: pm25Rows
  //         .slice(0, 7)
  //         .reverse()
  //         .map((row) => {
  //           return row.value;
  //         }),
  //       borderColor: "rgb(255, 99, 132)",
  //       backgroundColor: "rgba(255, 99, 132, 0.5)",
  //     },
  //     {
  //       label: "Dataset 2",
  //       data: pm25Rows
  //         .slice(0, 7)
  //         .reverse()
  //         .map((row) => row.value),
  //       borderColor: "rgb(53, 162, 235)",
  //       backgroundColor: "rgba(53, 162, 235, 0.5)",
  //     },
  //   ],
  // };

  return (
    <section className="dashboard">
      <TableContainer
        sx={{
          marginTop: 5,
          marginTrim: 10,
          borderRadius: 5,
          boxShadow: 5,
          paddingBottom: 2,
          maxHeight: 170,
        }}
        component={Paper}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {topColumns.map((col) => {
                return (
                  <TableCell align="center" key={col.id}>
                    {col.id}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                  paddingBottom: 1,
                },
              }}
            >
              {topColumns.map((row) => {
                return (
                  <TableCell align="center" key={row.id}>
                    {latestDataTVOC ? latestDataTVOC[row.key] : "尚無資料"}
                  </TableCell>
                );
              })}
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {topColumns.map((row) => {
                return (
                  <TableCell width={row.minWidth} align="center" key={row.id}>
                    {latestDataPM25 ? latestDataPM25[row.key] : "尚無資料"}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <div className="chart-container">
        <div className="chart">
          <Line
            options={options}
            data={{
              datasets: [
                {
                  label: "TVOC",
                  data: tvocRows
                    .slice(0, 10)
                    .reverse()
                    .map((row) => {
                      return { x: row.timestamp, y: row.value };
                    }),
                  borderColor: "rgb(33, 192, 166)",
                  backgroundColor: "rgba(33, 192, 166,.5)",
                },
              ],
            }}
          />
        </div>
        <div className="chart">
          <Line
            options={options}
            data={{
              datasets: [
                {
                  label: "PM2.5",
                  data: pm25Rows
                    .slice(0, 12)
                    .reverse()
                    .map((row) => {
                      return { x: row.timestamp, y: row.value };
                    }),
                  borderColor: "rgb(255, 180, 99)",
                  backgroundColor: "rgba(255, 180, 99, 0.5)",
                },
              ],
            }}
          />
        </div>
        <div className="chart">
          <Line
            options={options}
            data={{
              datasets: [
                {
                  label: "Humidity from pm2.5",
                  data: humidityRows
                    .filter((row) => row.mac == latestDataPM25.mac)
                    .slice(0, 12)
                    .reverse()
                    .map((row) => {
                      return { x: row.timestamp, y: row.value };
                    }),
                  borderColor: "rgb(53, 162, 235)",
                  backgroundColor: "rgba(53, 162, 235, 0.5)",
                },
                {
                  label: "Humidity from TVOC",
                  data: humidityRows
                    .filter((row) => row.mac == latestDataTVOC.mac)
                    .slice(0, 12)
                    .reverse()
                    .map((row) => {
                      return { x: row.timestamp, y: row.value };
                    }),
                  borderColor: "rgb(8, 74, 118)",
                  backgroundColor: "rgba(8, 74, 118, 0.5)",
                },
              ],
            }}
          />
        </div>
        <div className="chart">
          <Line
            options={options}
            data={{
              datasets: [
                {
                  label: "Temperature from pm2.5",
                  data: temperatureRows
                    .filter((row) => row.mac == latestDataPM25.mac)
                    .slice(0, 12)
                    .reverse()
                    .map((row) => {
                      return { x: row.timestamp, y: row.value };
                    }),
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
                {
                  label: "Temperature from TVOC",
                  data: temperatureRows
                    .filter((row) => row.mac == latestDataTVOC.mac)
                    .slice(0, 12)
                    .reverse()
                    .map((row) => {
                      return { x: row.timestamp, y: row.value };
                    }),
                  borderColor: "rgb(177, 14, 49)",
                  backgroundColor: "rgba(177, 14, 49, 0.5)",
                },
              ],
            }}
          />
        </div>
      </div>

      <div className="analyze-container">
        <div className="table">
          <h3>TVOC</h3>
          <TableContainer
            sx={{ maxHeight: "80%", borderRadius: 5, boxShadow: 5 }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Value</TableCell>
                  <TableCell align="center">Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tvocRows?.map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row["timestamp"] + row["sensorid"]}
                    >
                      <TableCell align={"center"}>
                        {row.value + " " + row.unit}
                      </TableCell>
                      <TableCell align={"center"}>{row.timestamp}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="table">
          <h3>PM2.5</h3>
          <TableContainer
            sx={{ maxHeight: "80%", borderRadius: 5, boxShadow: 5 }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Value</TableCell>
                  <TableCell align="center">Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pm25Rows?.map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row["timestamp"] + row["sensorid"]}
                    >
                      <TableCell align={"center"}>
                        {row.value + " " + row.unit}
                      </TableCell>
                      <TableCell align={"center"}>{row.timestamp}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="table">
          <h3>Relative Humidity</h3>
          <TableContainer
            sx={{ maxHeight: "80%", borderRadius: 5, boxShadow: 5 }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Value</TableCell>
                  <TableCell align="center">Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {humidityRows?.map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row["timestamp"] + row["sensorid"]}
                    >
                      <TableCell align={"center"}>
                        {row.value + " " + row.unit}
                      </TableCell>
                      <TableCell align={"center"}>{row.timestamp}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="table">
          <h3>Temperature</h3>
          <TableContainer
            sx={{ maxHeight: "80%", borderRadius: 5, boxShadow: 5 }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Value</TableCell>
                  <TableCell align="center">Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {temperatureRows?.map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row["timestamp"] + row["sensorid"]}
                    >
                      <TableCell align={"center"}>
                        {row.value + " " + row.unit}
                      </TableCell>
                      <TableCell align={"center"}>{row.timestamp}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </section>
  );
};
export default Dashboard;

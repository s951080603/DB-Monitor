import "./style.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const fakeData = [100, 200, 300, 200, 400, 500, 100];
const fakeData2 = [300, 200, 500, 100, 300, 200, 100];
const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: fakeData,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: fakeData2,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const Dashboard = ({ locationList, rows }) => {
  let { location } = useParams();
  if (!location) {
    location = "70734R";
  }
  console.log(location);

  const filterRows = rows.filter((row) => {
    return row.locDesc == location;
  });

  const latestDataMac1 = filterRows.find((row) => row.Desc == "PM2.5") || [];
  const latestDataMac2 = filterRows.find((row) => row.Desc == "TVOC") || [];
  console.log(latestDataMac1);
  console.log(latestDataMac2);
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
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {topColumns.map((row) => {
                return (
                  <TableCell width={row.minWidth} align="center" key={row.id}>
                    {latestDataMac1[row.key] || "尚無資料"}
                  </TableCell>
                );
              })}
            </TableRow>
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
                    {latestDataMac2[row.key] || null}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div className="chart-container">
        <div className="chart">
          <Line options={options} data={data} />
        </div>
        <div className="chart">
          <Line options={options} data={data} />
        </div>
      </div>
    </section>
  );
};
export default Dashboard;

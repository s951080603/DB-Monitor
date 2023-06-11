import "./style.css";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-moment";
import moment from "moment";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  BarElement,
  Title,
  SubTitle,
  Tooltip,
  Legend,
  LineElement,
  BarController,
  LineController,
} from "chart.js";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

import { tvocSensorList, pm25SensorList } from "../../data";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

ChartJS.register(
  TimeScale,
  LinearScale,
  BarElement,
  LineElement,
  BarController,
  LineController,
  Title,
  SubTitle,
  Tooltip,
  Legend
);

const colorList = [
  "#ff6384",
  "#1391c7a6",
  "#50e990b9",
  "#f1e428c5",
  "#9919f59d",
  "#ffa300",
  "#ffb4b4",
  "#b3d4ff",
  "#00bfa0",
];

const colorLineList = [
  ["rgb(240, 0, 52)", "rgb(240, 0, 52)"],
  ["rgb(20, 83, 110)", "rgba(20, 83, 110,.5)"],
  ["rgb(80, 233, 144)", "rgba(80, 233, 144,.5)"],
  ["rgb(255, 238, 0)", "rgba(255, 238, 0,.5)"],
  ["rgb(148, 0, 253)", "rgba(148, 0, 253,.5)"],
  ["rgb(255, 136, 0)", "rgba(255, 136, 0,.5)"],
  ["rgb(247, 122, 122)", "rgba(247, 122, 122,.5)"],
  ["rgb(50, 133, 241)", "rgba(50, 133, 241,.5)"],
  ["rgb(0, 255, 213)", "rgba(0, 255, 213,.5)"],
];

const order = [
  "43號 2F",
  "後港活動中心",
  "Stairwell 1F",
  "45號 2F",
  "45號 2F 側面",
  "45號 2F 背面",
  "Main Entry 1",
  "Main Entry 2",
];
const tvocSensorMap = new Map();
const pm25SensorMap = new Map();

const Home = ({ rows, locationList }) => {
  const [timeInterval, setTimeInterval] = useState(8);
  const [timeIntervalUnit, setTimeIntervalUnit] = useState(1 / 60);

  const [timeInterval2, setTimeInterval2] = useState(8);
  const [timeIntervalUnit2, setTimeIntervalUnit2] = useState(1 / 60);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
      subtitle: {
        display: true,
      },
    },
    scales: {
      x: {
        type: "time",
        max: moment(Date.now()),
        time: {
          displayFormats: {
            minute: "HH:mm",
            hour: "MMM D, HH:mm",
          },
        },
      },
      y: {
        type: "linear",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  useEffect(() => {
    order.forEach((loc) => {
      tvocSensorMap.set(
        rows
          .filter((row) => row.Desc == "TVOC")
          .find((row) => row.locDesc == loc)?.mac,
        loc
      );
      pm25SensorMap.set(
        rows
          .filter((row) => row.Desc == "PM2.5")
          .find((row) => row.locDesc == loc)?.mac,
        loc
      );
    });
  }, [rows]);

  const handleChange = (event, newTimeInterval) => {
    setTimeInterval(newTimeInterval);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let jsonForm = {};

    formData.forEach((value, key) => {
      jsonForm[key] = value;
    });

    setTimeInterval(jsonForm.timeInterval * jsonForm.timeIntervalUnit);
  };
  const handleSelect = (event, newTimeIntervalUnit) => {
    setTimeIntervalUnit(event.target.value);
  };

  const handleChange2 = (event, newTimeInterval) => {
    setTimeInterval2(newTimeInterval);
  };
  const handleSubmit2 = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let jsonForm = {};

    formData.forEach((value, key) => {
      jsonForm[key] = value;
    });

    setTimeInterval2(jsonForm.timeInterval * jsonForm.timeIntervalUnit);
  };
  const handleSelect2 = (event, newTimeIntervalUnit) => {
    setTimeIntervalUnit2(event.target.value);
  };

  return (
    <section className="home">
      <div className="chart-header">
        <h3>TVOC Data</h3>
        <div className="time-interval-selector">
          <ToggleButtonGroup
            color="primary"
            value={timeInterval}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            className="button-group"
          >
            <ToggleButton value={1}>1 h</ToggleButton>
            <ToggleButton value={4}>4 h</ToggleButton>
            <ToggleButton value={8}>8 h</ToggleButton>
            <ToggleButton value={12}>12 h</ToggleButton>
            <ToggleButton value={24}>1 d</ToggleButton>
            <ToggleButton value={72}>3 d</ToggleButton>
            <ToggleButton value={168}>1 w</ToggleButton>
          </ToggleButtonGroup>
          <form onSubmit={handleSubmit} className="form">
            <TextField
              id="outlined-number"
              type="number"
              required
              name="timeInterval"
              sx={{ width: 80 }}
              size="small"
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
            <Select
              name="timeIntervalUnit"
              value={timeIntervalUnit}
              required
              onChange={handleSelect}
              sx={{ height: 40, width: 100 }}
            >
              <MenuItem value={1 / 60}>Mins</MenuItem>
              <MenuItem value={1}>Hours</MenuItem>
              <MenuItem value={24}>Days</MenuItem>
              <MenuItem value={24 * 7}>Weeks</MenuItem>
              <MenuItem value={4 * 24 * 7}>Months</MenuItem>
            </Select>
            <Button type="submit" variant="contained" className="submit">
              apply
            </Button>
          </form>
        </div>
      </div>

      <section className="tvoc-chart-group">
        {[...tvocSensorMap.keys()]
          .filter((key) => key != undefined)
          .map((devEUI, index) => {
            const newOptions = JSON.parse(JSON.stringify(options));

            const timeIntervalData = rows.filter(
              (row) =>
                moment(new Date(row.timestamp)) >
                moment(Date.now() - timeInterval * 60 * 60 * 1000)
            );

            const tvocData = timeIntervalData.filter(
              (row) => row.Desc == "TVOC"
            );

            const temperatureData = timeIntervalData.filter(
              (row) => row.Desc == "Temperature"
            );

            newOptions.plugins.title.text = tvocData.find(
              (row) => row.mac == devEUI.toLowerCase()
            )?.locDesc;
            newOptions.plugins.subtitle.text = devEUI;

            newOptions.scales.x.min = moment(
              Date.now() - timeInterval * 60 * 60 * 1000
            );

            newOptions.scales.y1.max = Math.round(
              Math.max(
                ...temperatureData
                  .filter((row) =>
                    tvocSensorList.includes(row.mac.toUpperCase())
                  )
                  .map((row) => row.value)
              ) * 1.1
            );

            newOptions.scales.y.max = Math.round(
              Math.max(...tvocData.map((row) => row.value))
            );

            return (
              <div className="bar-chart" key={devEUI}>
                <Chart
                  type="bar"
                  options={newOptions}
                  data={{
                    datasets: [
                      {
                        label: "TVOC",
                        data: tvocData
                          .filter((row) => row.mac == devEUI.toLowerCase())
                          .map((row) => ({
                            x: moment(new Date(row.timestamp)),
                            y: row.value,
                          })),
                        backgroundColor: colorList[index],
                        maxBarThickness: 20,
                        minBarLength: 5,
                        yAxisID: "y",
                      },
                      {
                        type: "line",
                        label: "Temperature",
                        data: temperatureData
                          .filter((row) => row.mac == devEUI.toLowerCase())
                          .map((row) => ({
                            x: moment(new Date(row.timestamp)),
                            y: row.value,
                          })),
                        backgroundColor: colorLineList[index][0],
                        borderColor: colorLineList[index][1],
                        maxBarThickness: 20,
                        minBarLength: 5,
                        yAxisID: "y1",
                      },
                    ],
                  }}
                />
              </div>
            );
          })}
      </section>

      <div className="chart-header">
        <h3>PM2.5 Data</h3>

        <div className="time-interval-selector">
          <ToggleButtonGroup
            color="primary"
            value={timeInterval2}
            exclusive
            onChange={handleChange2}
            aria-label="Platform"
            className="button-group"
          >
            <ToggleButton value={1}>1 h</ToggleButton>
            <ToggleButton value={4}>4 h</ToggleButton>
            <ToggleButton value={8}>8 h</ToggleButton>
            <ToggleButton value={12}>12 h</ToggleButton>
            <ToggleButton value={24}>1 d</ToggleButton>
            <ToggleButton value={72}>3 d</ToggleButton>
            <ToggleButton value={168}>1 w</ToggleButton>
          </ToggleButtonGroup>
          <form onSubmit={handleSubmit2} className="form">
            <TextField
              id="outlined-number"
              type="number"
              required
              name="timeInterval"
              sx={{ width: 80 }}
              size="small"
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
            <Select
              name="timeIntervalUnit"
              value={timeIntervalUnit2}
              required
              onChange={handleSelect2}
              sx={{ height: 40, width: 100 }}
            >
              <MenuItem value={1 / 60}>Mins</MenuItem>

              <MenuItem value={1}>Hours</MenuItem>
              <MenuItem value={24}>Days</MenuItem>
              <MenuItem value={24 * 7}>Weeks</MenuItem>
              <MenuItem value={4 * 24 * 7}>Months</MenuItem>
            </Select>
            <Button type="submit" variant="contained" className="submit">
              apply
            </Button>
          </form>
        </div>
      </div>
      <section className="tvoc-chart-group">
        {[...pm25SensorMap.keys()]
          .filter((key) => key != undefined)
          .map((devEUI, index) => {
            const newOptions = JSON.parse(JSON.stringify(options));

            const timeIntervalData = rows.filter(
              (row) =>
                moment(new Date(row.timestamp)) >
                moment(Date.now() - timeInterval2 * 60 * 60 * 1000)
            );

            const pm25Data = timeIntervalData.filter(
              (row) => row.Desc == "PM2.5"
            );

            const temperatureData = timeIntervalData.filter(
              (row) => row.Desc == "Temperature"
            );

            newOptions.plugins.title.text = pm25Data.find(
              (row) => row.mac == devEUI.toLowerCase()
            )?.locDesc;
            newOptions.plugins.subtitle.text = devEUI;
            newOptions.scales.y.max = Math.round(
              Math.max(...pm25Data.map((row) => row.value)) * 1.1
            );
            newOptions.scales.y1.max = Math.round(
              Math.max(
                ...temperatureData
                  .filter((row) =>
                    pm25SensorList.includes(row.mac.toUpperCase())
                  )
                  .map((row) => row.value)
              ) * 1.1
            );
            newOptions.scales.x.min = moment(
              Date.now() - timeInterval2 * 60 * 60 * 1000
            );
            return (
              <div className="bar-chart" key={devEUI}>
                <Chart
                  type="bar"
                  options={newOptions}
                  data={{
                    datasets: [
                      {
                        label: "PM2.5",
                        data: pm25Data
                          .filter((row) => row.mac == devEUI.toLowerCase())
                          .map((row) => ({
                            x: moment(new Date(row.timestamp)),
                            y: row.value,
                          })),
                        backgroundColor: colorList[index],
                        minBarLength: 5,
                        maxBarThickness: 20,
                      },
                      {
                        type: "line",
                        label: "Temperature",
                        data: temperatureData
                          .filter((row) => row.mac == devEUI.toLowerCase())
                          .map((row) => ({
                            x: moment(new Date(row.timestamp)),
                            y: row.value,
                          })),
                        backgroundColor: colorLineList[index][0],
                        borderColor: colorLineList[index][1],
                        maxBarThickness: 20,
                        minBarLength: 5,
                        yAxisID: "y1",
                      },
                    ],
                  }}
                />
              </div>
            );
          })}
      </section>
    </section>
  );
};
export default Home;

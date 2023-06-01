import "./style.css";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-moment";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  BarElement,
  Title,
  SubTitle,
  Tooltip,
  Legend,
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
SubTitle,
  ChartJS.register(
    TimeScale,
    LinearScale,
    BarElement,
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
  const [timeIntervalUnit, setTimeIntervalUnit] = useState(0);

  const [timeInterval2, setTimeInterval2] = useState(8);
  const [timeIntervalUnit2, setTimeIntervalUnit2] = useState(0);
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
        min: Date.now() - timeInterval * 60 * 60 * 1000,
        max: Date.now(),
      },
      y: {},
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
              <MenuItem value={30 * 24 * 7}>Months</MenuItem>
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

            const tvocData = rows
              .filter((row) => row.Desc == "TVOC")
              .filter(
                (row) =>
                  new Date(row.timestamp) >
                  Date.now() - timeInterval * 60 * 60 * 1000
              );

            newOptions.plugins.title.text = tvocData.find(
              (row) => row.mac == devEUI.toLowerCase()
            )?.locDesc;
            newOptions.plugins.subtitle.text = devEUI;

            newOptions.scales.y.max = Math.max(
              ...tvocData.map((row) => row.value)
            );

            return (
              <div className="bar-chart" key={devEUI}>
                <Bar
                  options={newOptions}
                  data={{
                    datasets: [
                      {
                        label: "TVOC",
                        data: tvocData
                          .filter((row) => row.mac == devEUI.toLowerCase())
                          .map((row) => ({ x: row.timestamp, y: row.value })),
                        backgroundColor: colorList[index],
                        maxBarThickness: 20,
                        minBarLength: 5,
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
              <MenuItem value={30 * 24 * 7}>Months</MenuItem>
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
            const pm25Data = rows
              .filter((row) => row.Desc == "PM2.5")
              .filter(
                (row) =>
                  new Date(row.timestamp) >
                  Date.now() - timeInterval2 * 60 * 60 * 1000
              );

            newOptions.plugins.title.text = pm25Data.find(
              (row) => row.mac == devEUI.toLowerCase()
            )?.locDesc;
            newOptions.plugins.subtitle.text = devEUI;
            newOptions.scales.y.max = Math.max(
              ...pm25Data.map((row) => row.value)
            );
            newOptions.scales.x.min =
              Date.now() - timeInterval2 * 60 * 60 * 1000;
            return (
              <div className="bar-chart" key={devEUI}>
                <Bar
                  options={newOptions}
                  data={{
                    datasets: [
                      {
                        label: "PM2.5",
                        data: pm25Data
                          .filter((row) => row.mac == devEUI.toLowerCase())
                          .map((row) => ({ x: row.timestamp, y: row.value })),
                        backgroundColor: colorList[index],
                        minBarLength: 5,
                        maxBarThickness: 20,
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

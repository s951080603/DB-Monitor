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
  PointElement,
} from "chart.js";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

import { tvocSensorList, pm25SensorList } from "../../data";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

import { order, colorLineList, colorList } from "../../data";

ChartJS.register(
  PointElement,
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

const tvocSensorMap = new Map();
const pm25SensorMap = new Map();

const fetchRecordsInTimeInterval = async (timeInterval = 8) => {
  const startTime = new Date(
    Date.now() - timeInterval * 60 * 60 * 1000
  ).toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    hourCycle: "h23",
  });
  try {
    const response = await fetch(
      `http://chiu.hopto.org:8963/record?startTime=${startTime}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const Home = () => {
  const [timeIntervalPM25Data, setTimeIntervalPM25Data] = useState([]);
  const [timeIntervalTVOCData, setTimeIntervalTVOCData] = useState([]);

  const [timeIntervalTVOC, setTimeIntervalTVOC] = useState(8);
  const [timeIntervalPM25, setTimeIntervalPM25] = useState(8);

  const [timeIntervalUnitTVOC, setTimeIntervalUnitTVOC] = useState(1);
  const [timeIntervalUnitPM25, setTimeIntervalUnitPM25] = useState(1);

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
    fetchRecordsInTimeInterval(timeIntervalTVOC)
      .then((data) => {
        setTimeIntervalTVOCData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [timeIntervalTVOC]);
  useEffect(() => {
    fetchRecordsInTimeInterval(timeIntervalPM25)
      .then((data) => {
        setTimeIntervalPM25Data(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [timeIntervalPM25]);

  useEffect(() => {
    order.forEach((loc) => {
      tvocSensorMap.set(
        timeIntervalTVOCData
          .filter((row) => row.Desc == "TVOC")
          .find((row) => row.locDesc == loc)?.mac,
        loc
      );
      pm25SensorMap.set(
        timeIntervalTVOCData
          .filter((row) => row.Desc == "PM2.5")
          .find((row) => row.locDesc == loc)?.mac,
        loc
      );
    });
  }, [timeIntervalTVOCData, timeIntervalPM25Data]);

  const handleChange = (event, newTimeInterval) => {
    setTimeIntervalTVOC(newTimeInterval);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let jsonForm = {};

    formData.forEach((value, key) => {
      jsonForm[key] = value;
    });

    setTimeIntervalTVOC(
      jsonForm.timeIntervalTVOC * jsonForm.timeIntervalUnitTVOC
    );
  };

  const handleChange2 = (event, newTimeInterval) => {
    setTimeIntervalPM25(newTimeInterval);
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let jsonForm = {};

    formData.forEach((value, key) => {
      jsonForm[key] = value;
    });

    setTimeIntervalPM25(
      jsonForm.timeIntervalPM25 * jsonForm.timeIntervalUnitPM25
    );
  };

  const handleSelect = (e) => {
    setTimeIntervalUnitTVOC(e.target.value);
  };

  const handleSelect2 = (e) => {
    setTimeIntervalUnitPM25(e.target.value);
  };

  return (
    <section className="home">
      <div className="chart-header">
        <h3>TVOC Data</h3>
        <div className="time-interval-selector">
          <ToggleButtonGroup
            color="primary"
            value={timeIntervalTVOC}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            className="button-group"
          >
            {/* hour base*/}
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
              name="timeIntervalTVOC"
              sx={{ width: 80 }}
              size="small"
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
            <Select
              name="timeIntervalUnitTVOC"
              value={timeIntervalUnitTVOC}
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

            const tvocData = timeIntervalTVOCData.filter(
              (row) => row.Desc == "TVOC"
            );

            const temperatureData = timeIntervalTVOCData.filter(
              (row) => row.Desc == "Temperature"
            );

            newOptions.plugins.title.text = tvocData.find(
              (row) => row.mac == devEUI.toLowerCase()
            )?.locDesc;
            newOptions.plugins.subtitle.text = devEUI;

            newOptions.scales.x.min = moment(
              Date.now() - timeIntervalTVOC * 60 * 60 * 1000
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
              Math.max(...tvocData.map((row) => row.value)) * 1.1
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
            value={timeIntervalPM25}
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
              name="timeIntervalPM25"
              sx={{ width: 80 }}
              size="small"
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
            <Select
              name="timeIntervalUnitPM25"
              value={timeIntervalUnitPM25}
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

            const pm25Data = timeIntervalPM25Data.filter(
              (row) => row.Desc == "PM2.5"
            );

            const temperatureData = timeIntervalPM25Data.filter(
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
              Date.now() - timeIntervalPM25 * 60 * 60 * 1000
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

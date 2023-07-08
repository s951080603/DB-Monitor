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

const fetchRecordsInTimeInterval = async (
  timeInterval = 8,
  subtype = "TVOC"
) => {
  const startTime = new Date(
    Date.now() - timeInterval * 60 * 60 * 1000
  ).toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    hourCycle: "h23",
  });
  try {
    const response = await fetch(
      `http://chiu.hopto.org:8963/record?startTime=${startTime}&subtype=${subtype}`
    );
    console.log(
      `http://chiu.hopto.org:8963/record?startTime=${startTime}&subtype=${subtype}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
const fetchTempRecordsInTimeInterval = async (timeInterval = 8, sensorType) => {
  const startTime = new Date(
    Date.now() - timeInterval * 60 * 60 * 1000
  ).toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    hourCycle: "h23",
  });
  try {
    const response = await fetch(
      `http://chiu.hopto.org:8963/record?startTime=${startTime}&subtype=Temperature&sensorType=${sensorType}`
    );
    console.log(
      `http://chiu.hopto.org:8963/record?startTime=${startTime}&subtype=Temperature&sensorType=${sensorType}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const fetchRecordsMovingAverage = async (
  timeInterval = 8,
  numberOfSamples = 5,
  subtype = "TVOC"
) => {
  const startTime = new Date(
    Date.now() - timeInterval * 60 * 60 * 1000
  ).toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    hourCycle: "h23",
  });
  try {
    const response = await fetch(
      `http://chiu.hopto.org:8963/record/ma?startTime=${startTime}&numberOfSamples=${numberOfSamples}&subtype=${subtype}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const fetchMacList = async (subtype = "TVOC") => {
  try {
    const response = await fetch(
      `http://chiu.hopto.org:8963/record/mac?subtype=${subtype}`
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
  const [timeIntervalTempPM25Data, setTimeIntervalTempPM25Data] = useState([]);
  const [timeIntervalTempTVOCData, setTimeIntervalTempTVOCData] = useState([]);

  const [movingAveragePM25Data, setMovingAveragePM25Data] = useState([]);
  const [movingAverageTVOCData, setMovingAverageTVOCData] = useState([]);

  const [timeIntervalTVOC, setTimeIntervalTVOC] = useState(8);
  const [timeIntervalPM25, setTimeIntervalPM25] = useState(8);
  const [numberOfSamplesTVOC, setNumberOfSamplesTVOC] = useState(5);
  const [numberOfSamplesPM25, setNumberOfSamplesPM25] = useState(5);

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
    fetchRecordsInTimeInterval(timeIntervalTVOC, "TVOC")
      .then((data) => {
        setTimeIntervalTVOCData(data);
      })
      .catch((error) => {
        console.log(error);
      });
    fetchTempRecordsInTimeInterval(timeIntervalTVOC, "TVOC")
      .then((data) => {
        setTimeIntervalTempTVOCData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [timeIntervalTVOC]);
  useEffect(() => {
    fetchRecordsInTimeInterval(timeIntervalPM25, "PM2.5")
      .then((data) => {
        setTimeIntervalPM25Data(data);
      })
      .catch((error) => {
        console.log(error);
      });
    fetchTempRecordsInTimeInterval(timeIntervalPM25, "PM2.5")
      .then((data) => {
        setTimeIntervalTempPM25Data(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [timeIntervalPM25]);

  useEffect(() => {
    fetchRecordsMovingAverage(timeIntervalTVOC, numberOfSamplesTVOC, "TVOC")
      .then((data) => {
        setMovingAverageTVOCData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [timeIntervalTVOC, numberOfSamplesTVOC]);
  useEffect(() => {
    fetchRecordsMovingAverage(timeIntervalPM25, numberOfSamplesPM25, "PM2.5")
      .then((data) => {
        setMovingAveragePM25Data(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [timeIntervalPM25, numberOfSamplesPM25]);

  const handleChangeTVOC = (event, newTimeInterval) => {
    setTimeIntervalTVOC(newTimeInterval);
  };
  const handleChangePM25 = (event, newTimeInterval) => {
    setTimeIntervalPM25(newTimeInterval);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let jsonForm = {};

    formData.forEach((value, key) => {
      jsonForm[key] = value;
    });

    jsonForm.timeIntervalTVOC != undefined
      ? setTimeIntervalTVOC(
          jsonForm.timeIntervalTVOC * jsonForm.timeIntervalUnitTVOC
        )
      : setTimeIntervalPM25(
          jsonForm.timeIntervalPM25 * jsonForm.timeIntervalUnitPM25
        );
  };

  const handleSubmitMA = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let jsonForm = {};
    formData.forEach((value, key) => {
      jsonForm[key] = value;
    });
    jsonForm.numberOfSamplesTVOC != undefined
      ? setNumberOfSamplesTVOC(jsonForm.numberOfSamplesTVOC)
      : setNumberOfSamplesPM25(jsonForm.numberOfSamplesPM25);
  };

  const handleSelectTVOC = (e) => {
    setTimeIntervalUnitTVOC(e.target.value);
  };

  const handleSelectPM25 = (e) => {
    setTimeIntervalUnitPM25(e.target.value);
  };

  return (
    <section className="home">
      <div className="chart-header">
        <h3>TVOC Data</h3>
        <form onSubmit={handleSubmitMA} className="ma-form">
          <TextField
            id="outlined-number"
            type="number"
            required
            name="numberOfSamplesTVOC"
            sx={{ width: 170 }}
            label="MA Number Of Samples"
            size="small"
            defaultValue={5}
            InputProps={{
              inputProps: { min: 1 },
            }}
          />
          <Button type="submit" variant="contained" className="submit">
            apply
          </Button>
        </form>
        <div className="time-interval-selector">
          <ToggleButtonGroup
            color="primary"
            value={timeIntervalTVOC}
            exclusive
            onChange={handleChangeTVOC}
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
              onChange={handleSelectTVOC}
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

      <section className="chart-group">
        {order.map((locDesc, index) => {
          const newOptions = JSON.parse(JSON.stringify(options));

          newOptions.plugins.title.text = locDesc;

          newOptions.plugins.subtitle.text = `${
            timeIntervalTVOCData.find((row) => row.locDesc == locDesc)?.mac
          }  ( ${
            timeIntervalTVOCData.find((row) => row.locDesc == locDesc)?.voltage
          }V )`;

          newOptions.scales.x.min = moment(
            Date.now() - timeIntervalTVOC * 60 * 60 * 1000
          );

          newOptions.scales.y1.max = Math.round(
            timeIntervalTempTVOCData.reduce((max, row) => {
              const value = row.value;
              return value > max ? value : max;
            }, -Infinity) * 1.1
          );

          newOptions.scales.y.max = Math.round(
            timeIntervalTVOCData.reduce((max, row) => {
              const value = row.value;
              return value > max ? value : max;
            }, -Infinity) * 1.1
          );

          return (
            <div className="bar-chart" key={locDesc}>
              <Chart
                type="bar"
                options={newOptions}
                data={{
                  datasets: [
                    {
                      type: "line",
                      label: "TVOC MA",
                      data: movingAverageTVOCData
                        ?.filter((row) => row.locDesc == locDesc)
                        .map((row) => ({
                          x: moment(new Date(row.timestamp)),
                          y: row.moving_average,
                        })),
                      backgroundColor: colorLineList[index][2],
                      borderColor: colorLineList[index][2],
                      pointStyle: false,
                      z: 10,
                      yAxisID: "y",
                    },

                    {
                      type: "line",
                      label: "Temperature",
                      data: timeIntervalTempTVOCData
                        ?.filter((row) => row.locDesc == locDesc)
                        .map((row) => ({
                          x: moment(new Date(row.timestamp)),
                          y: row.value,
                        })),
                      borderColor: colorLineList[index][0],
                      backgroundColor: colorLineList[index][0],
                      pointStyle: false,
                      yAxisID: "y1",
                    },
                    {
                      label: "TVOC",
                      data: timeIntervalTVOCData
                        ?.filter((row) => row.locDesc == locDesc)
                        .map((row) => ({
                          x: moment(new Date(row.timestamp)),
                          y: row.value,
                        })),
                      backgroundColor: colorList[index],
                      maxBarThickness: 20,
                      minBarLength: 5,
                      yAxisID: "y",
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
        <form onSubmit={handleSubmitMA} className="ma-form">
          <TextField
            id="outlined-number"
            type="number"
            required
            name="numberOfSamplesPM25"
            sx={{ width: 170 }}
            label="MA Number Of Samples"
            size="small"
            defaultValue={5}
            InputProps={{
              inputProps: { min: 1 },
            }}
          />
          <Button type="submit" variant="contained" className="submit">
            apply
          </Button>
        </form>
        <div className="time-interval-selector">
          <ToggleButtonGroup
            color="primary"
            value={timeIntervalPM25}
            exclusive
            onChange={handleChangePM25}
            aria-label="Platform"
            className="button-group"
          >
            <ToggleButton sx={{ minWidth: "50px" }} value={1}>
              1 h
            </ToggleButton>
            <ToggleButton sx={{ minWidth: "50px" }} value={4}>
              4 h
            </ToggleButton>
            <ToggleButton sx={{ minWidth: "50px" }} value={8}>
              8 h
            </ToggleButton>
            <ToggleButton sx={{ minWidth: "50px" }} value={12}>
              12 h
            </ToggleButton>
            <ToggleButton sx={{ minWidth: "50px" }} value={24}>
              1 d
            </ToggleButton>
            <ToggleButton sx={{ minWidth: "50px" }} value={72}>
              3 d
            </ToggleButton>
            <ToggleButton sx={{ minWidth: "50px" }} value={168}>
              1 w
            </ToggleButton>
          </ToggleButtonGroup>
          <form onSubmit={handleSubmit} className="form">
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
              onChange={handleSelectPM25}
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
      <section className="chart-group">
        {order.map((locDesc, index) => {
          const newOptions = JSON.parse(JSON.stringify(options));

          newOptions.plugins.title.text = locDesc;

          newOptions.plugins.subtitle.text = `${
            timeIntervalPM25Data.find((row) => row.locDesc == locDesc)?.mac
          }  ( ${
            timeIntervalPM25Data.find((row) => row.locDesc == locDesc)?.voltage
          }V )`;

          newOptions.scales.y.max = Math.round(
            timeIntervalPM25Data.reduce((max, row) => {
              const value = row.value;
              return value > max ? value : max;
            }, -Infinity) * 1.1
          );

          newOptions.scales.y1.max = Math.round(
            timeIntervalTempPM25Data.reduce((max, row) => {
              const value = row.value;
              return value > max ? value : max;
            }, -Infinity) * 1.1
          );
          newOptions.scales.x.min = moment(
            Date.now() - timeIntervalPM25 * 60 * 60 * 1000
          );
          return (
            <div className="bar-chart" key={locDesc}>
              <Chart
                type="bar"
                options={newOptions}
                data={{
                  datasets: [
                    {
                      type: "line",
                      label: "PM2.5 MA",
                      data: movingAveragePM25Data
                        ?.filter((row) => row.locDesc == locDesc)
                        .map((row) => ({
                          x: moment(new Date(row.timestamp)),
                          y: row.moving_average,
                        })),
                      borderColor: colorLineList[index][2],
                      backgroundColor: colorLineList[index][2],
                      pointStyle: false,
                      yAxisID: "y",
                    },
                    {
                      type: "line",
                      label: "Temperature",
                      data: timeIntervalTempPM25Data
                        ?.filter((row) => row.locDesc == locDesc)
                        .map((row) => ({
                          x: moment(new Date(row.timestamp)),
                          y: row.value,
                        })),
                      borderColor: colorLineList[index][0],
                      backgroundColor: colorLineList[index][0],
                      pointStyle: false,
                      yAxisID: "y1",
                    },
                    {
                      label: "PM2.5",
                      data: timeIntervalPM25Data
                        ?.filter((row) => row.locDesc == locDesc)
                        .map((row) => ({
                          x: moment(new Date(row.timestamp)),
                          y: row.value,
                        })),
                      backgroundColor: colorList[index],
                      minBarLength: 5,
                      yAxisID: "y",
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

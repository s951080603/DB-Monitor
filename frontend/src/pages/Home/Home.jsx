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

import { tvocSensorList, pm25SensorList } from "../../data";
import { useEffect } from "react";

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
      min: Date.now() - 8 * 60 * 60 * 1000,
    },
    y: {},
  },
};
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

  return (
    <section className="home">
      <h3>TVOC Data</h3>
      <section className="tvoc-chart-group">
        {[...tvocSensorMap.keys()]
          .filter((key) => key != undefined)
          .map((devEUI, index) => {
            const newOptions = JSON.parse(JSON.stringify(options));
            
            const tvocData = rows
              .filter((row) => row.Desc == "TVOC")
              .filter(
                (row) =>
                  new Date(row.timestamp) > Date.now() - 8 * 60 * 60 * 1000
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


      <h3>PM2.5 Data</h3>
      <section className="tvoc-chart-group">
        {[...pm25SensorMap.keys()]
          .filter((key) => key != undefined)
          .map((devEUI, index) => {
            const newOptions = JSON.parse(JSON.stringify(options));
            const pm25Data = rows
              .filter((row) => row.Desc == "PM2.5")
              .filter(
                (row) =>
                  new Date(row.timestamp) > Date.now() - 8 * 60 * 60 * 1000
              );

            newOptions.plugins.title.text = pm25Data.find(
              (row) => row.mac == devEUI.toLowerCase()
            )?.locDesc;
            newOptions.plugins.subtitle.text = devEUI;
            newOptions.scales.y.max = Math.max(
              ...pm25Data.map((row) => row.value)
            );
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

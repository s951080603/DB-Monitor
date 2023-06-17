import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./pages/Header/Header";
import Location from "./pages/Location/Location";
import AllRecords from "./pages/AllRecords/AllRecords";
import SharedLayout from "./pages/SharedLayout";
import SingleSensorRecord from "./pages/SingleSensorRecord/SingleSensorRecord";
import io from "socket.io-client";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home/Home";

const fetchRecords = async () => {
  const response = await fetch("http://chiu.hopto.org:8963/record/all");
  const data = await response.json();
  return data;
};

const fetchLocations = async () => {
  const response = await fetch("http://chiu.hopto.org:8963/location");
  const data = await response.json();
  return data;
};

function App() {
  const [rows, setRows] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [installedLocations, setInstalledLocations] = useState([]);

  useEffect(() => {
    const socket = io("http://chiu.hopto.org:8080");
    console.log("socket connect");

    fetchLocations()
      .then((data) => {
        setLocationList(data);
      })
      .catch((error) => {
        console.error(error);
      });
    fetchRecords()
      .then((data) => {
        console.log("fetch records");
        setRows(data);
      })
      .catch((error) => {
        console.error(error);
      });
    socket.on("db-notify", (data) => {
      setRows((currentRows) => {
        const newRows = [data, ...currentRows];
        return newRows;
      });
      // console.log("new data coming");
    });

    return () => {
      socket.disconnect();
      console.log("socket disconnect");
    };
  }, []);

  useEffect(() => {
    setInstalledLocations([...new Set(rows.map((row) => row.locid))].sort());
  }, [rows]);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <SharedLayout
              rows={rows}
              locationList={locationList}
              installedLocations={installedLocations}
            />
          }
        >
          <Route index element={<Home locationList={locationList} />} />

          <Route
            path="/all"
            element={
              <AllRecords
                rows={rows}
                setRows={setRows}
                fetchRecords={fetchRecords}
              />
            }
          />

          <Route
            path="/:devEUI"
            element={
              <SingleSensorRecord
                rows={rows}
                setRows={setRows}
                fetchRecords={fetchRecords}
                locationList={locationList}
              />
            }
          />

          <Route
            path="/location"
            element={
              <Location
                locationList={locationList}
                setLocationList={setLocationList}
                fetchLocations={fetchLocations}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <Dashboard
                locationList={locationList}
                rows={rows}
                installedLocations={installedLocations}
              />
            }
          />
          <Route
            path="/dashboard/:location"
            element={<Dashboard locationList={locationList} rows={rows} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

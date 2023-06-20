import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Location from "./pages/Location/Location";
import SharedLayout from "./pages/SharedLayout";
import io from "socket.io-client";
import Home from "./pages/Home/Home";
import DayQuery from "./pages/DayQuery/DayQuery";

const fetchLocations = async () => {
  const response = await fetch("http://chiu.hopto.org:8963/location");
  const data = await response.json();
  return data;
};

function App() {
  const [rows, setRows] = useState([]);
  const [locationList, setLocationList] = useState([]);

  useEffect(() => {
    // const socket = io("http://chiu.hopto.org:8080");
    // console.log("socket connect");

    fetchLocations()
      .then((data) => {
        setLocationList(data);
      })
      .catch((error) => {
        console.error(error);
      });

    // socket.on("db-notify", (data) => {
    //   setRows((currentRows) => {
    //     const newRows = [data, ...currentRows];
    //     return newRows;
    //   });
    //   // console.log("new data coming");
    // });

    // return () => {
    //   socket.disconnect();
    //   console.log("socket disconnect");
    // };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Home locationList={locationList} />} />

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

          <Route path="7-day-query" element={<DayQuery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

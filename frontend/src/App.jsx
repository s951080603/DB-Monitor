import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./pages/Header/Header";
import AllRecords from "./pages/AllRecords/AllRecords";
import SharedLayout from "./pages/SharedLayout";
import SingleSensorRecord from "./pages/SingleSensorRecord/SingleSensorRecord";
import io from "socket.io-client";

const fetchRecords = async () => {
  const response = await fetch("http://chiu.hopto.org:8963/record/all");
  const data = await response.json();
  return data;
};

function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const socket = io("http://chiu.hopto.org:8080");

    socket.on("db-notify", (data) => {
      setRows((currentRows) => {
        const newRows = [data, ...currentRows];
        return newRows;
      });
      console.log("new data coming");
    });

    return () => {
      socket.disconnect();
      console.log("socket disconnect");
    };
  }, []);

  useEffect(() => {
    let start = new Date();
    fetchRecords()
      .then((data) => {
        setRows(data);
        let end = new Date();
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<AllRecords rows={rows} />} />
          <Route path="/all" element={<AllRecords rows={rows} />} />

          <Route path="/:devEUI" element={<SingleSensorRecord rows={rows} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

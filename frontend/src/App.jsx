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
    let start = new Date();
    fetchRecords()
      .then((data) => {
        setRows(data);
        let end = new Date();
        console.log(`fetch data spent: ${(end - start) / 1000} s`);
      })
      .catch((error) => {
        console.error(error);
      });

    const socket = io("http://chiu.hopto.org:8080");
    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });
    // 監聽來自伺服器端的訊息
    socket.on("message", (data) => {
      console.log(data);
    });
    socket.on("db-notify", (data) => {
      setRows((currentRows) => {
        const newRows = [data, ...currentRows];
        return newRows;
      });
      console.log("new data coming");
    });

    // 結束時關閉連線
    return () => {
      socket.disconnect();
      console.log("socket disconnect");
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<AllRecords rows={rows} />} />
          {/* <Route path="/:sensorMac" element={<SingleSensorRecord />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

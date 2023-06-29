import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Location from "./pages/Location/Location";
import SharedLayout from "./pages/SharedLayout";
import io from "socket.io-client";
import Home from "./pages/Home/Home";
import DayQuery from "./pages/DayQuery/DayQuery";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Home />} />

          <Route path="/location" element={<Location />} />

          <Route path="7-day-query" element={<DayQuery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

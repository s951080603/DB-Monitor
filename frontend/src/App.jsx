import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./pages/Header/Header";
import AllRecords from "./pages/AllRecords/AllRecords";
import SharedLayout from "./pages/SharedLayout";
import SingleSensorRecord from "./pages/SingleSensorRecord/SingleSensorRecord";
function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<AllRecords />} />
          <Route path="test" element={<SingleSensorRecord />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

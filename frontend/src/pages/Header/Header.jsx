import { useEffect, useState } from "react";
import { pm25SensorList, tvocSensorList } from "../../data";
import "./style.css";
import { useNavigate } from "react-router-dom";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Header = () => {
  const [devEUI, setDevEUI] = useState("ALL");
  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const devEUI = event.target.value;
    setDevEUI(devEUI);
    navigate(`/${devEUI.toLowerCase()}`);
  };

  const [currentTime, setCurrentTime] = useState(
    new Date(Date.now()).toLocaleString()
  );
  useEffect(() => {
    const timeId = setInterval(() => {
      console.log("set interval");
      setCurrentTime(new Date(Date.now()).toLocaleString());
    }, 1000);
    return () => clearInterval(timeId);
  }, []);
  return (
    <header className="header">
      <div className="logo">DB MONITOR</div>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel htmlFor="grouped-native-select">Sensor</InputLabel>
        <Select
          native
          defaultValue=""
          id="grouped-native-select"
          label="Grouping"
          onChange={handleSelectChange}
        >
          <option aria-label="All" value="All">
            <em>ALL</em>
          </option>
          <optgroup label="PM2.5">
            {pm25SensorList.map((mac) => {
              return (
                <option key={mac} value={mac}>
                  {mac}
                </option>
              );
            })}
          </optgroup>
          <optgroup label="TVOC">
            {tvocSensorList.map((mac) => {
              return (
                <option key={mac} value={mac}>
                  {mac}
                </option>
              );
            })}
          </optgroup>
        </Select>
      </FormControl>

      <div className="current-time">{currentTime}</div>
    </header>
  );
};
export default Header;

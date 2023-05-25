import { useEffect, useState } from "react";
import { pm25SensorList, tvocSensorList } from "../../data";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { AiOutlineLineChart } from "react-icons/ai";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import Newspaper from "@mui/icons-material/Newspaper";
import InsertChart from "@mui/icons-material/InsertChart";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Header = () => {
  const [devEUI, setDevEUI] = useState("ALL");
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const devEUI = event.target.value;
    setDevEUI(devEUI);
    navigate(`/${devEUI.toLowerCase()}`);
  };

  return (
    <header className="header">
      <h1 className="logo">DB MONITOR</h1>
      {value == 0 ? (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel htmlFor="grouped-native-select">Sensor</InputLabel>
          <Select
            native
            defaultValue=""
            id="grouped-native-select"
            label="Grouping"
            onChange={handleSelectChange}
            sx={{ fontSize: 24, color: "#545f66" }}
          >
            <option style={{ textAlign: "center" }} label="All" value="All">
              ALL
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
      ) : null}

      <Box sx={{ width: 400 }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Records"
            icon={<Newspaper />}
            onClick={() => {
              navigate("/");
            }}
          />
          <BottomNavigationAction
            label="Location"
            icon={<LocationOnIcon />}
            onClick={() => {
              navigate("/location");
            }}
          />
          <BottomNavigationAction
            label="Dashboards"
            icon={<InsertChart />}
            onClick={() => {
              navigate("/dashboard");
            }}
          />
        </BottomNavigation>
      </Box>
    </header>
  );
};
export default Header;

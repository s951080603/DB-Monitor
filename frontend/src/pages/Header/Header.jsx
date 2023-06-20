import { useEffect, useState } from "react";
import { pm25SensorList, tvocSensorList } from "../../data";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineHome, AiOutlineLineChart } from "react-icons/ai";

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
import DateRangeIcon from "@mui/icons-material/DateRange";
import HomeIcon from "@mui/icons-material/Home";
import DayQuery from "../DayQuery/DayQuery";
const Header = ({ rows, locationList, installedLocations }) => {
  // const [devEUI, setDevEUI] = useState("ALL");
  // const [location, setLocation] = useState("70734R");

  const [value, setValue] = useState(0);
  const [devEUI, setDevEUI] = useState("00137a1000020342");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSensorSelectChange = (event) => {
    setDevEUI((currentDevEUI) => {
      const newDevEUI = event.target.value;
      navigate(`/${newDevEUI.toLowerCase()}`);

      return newDevEUI;
    });
  };

  const handleLocationSelectChange = (event) => {
    setLocation((currentLocation) => {
      const newLocation = event.target.value;
      navigate(`/dashboard/${newLocation}`);
      return newLocation;
    });
  };

  return (
    <header className="header">
      <h1 className="logo">EPA MONITOR</h1>
      {value == 1 ? (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel htmlFor="grouped-native-select">Sensor</InputLabel>
          <Select
            native
            defaultValue="00137A1000020342"
            id="grouped-native-select"
            label="Grouping"
            onChange={handleSensorSelectChange}
            sx={{ fontSize: 20, color: "#545f66" }}
          >
            <option style={{ textAlign: "center" }} label="All" value="All">
              ALL
            </option>
            <optgroup label="PM2.5">
              {pm25SensorList.map((mac) => {
                return (
                  <option style={{ textAlign: "center" }} key={mac} value={mac}>
                    {mac}
                  </option>
                );
              })}
            </optgroup>
            <optgroup label="TVOC">
              {tvocSensorList.map((mac) => {
                return (
                  <option style={{ textAlign: "center" }} key={mac} value={mac}>
                    {mac}
                  </option>
                );
              })}
            </optgroup>
          </Select>
        </FormControl>
      ) : null}

      {value == 3 ? (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel htmlFor="grouped-native-select">Location</InputLabel>
          <Select
            native
            defaultValue={location}
            id="grouped-native-select"
            label="Grouping"
            onChange={handleLocationSelectChange}
            sx={{ fontSize: 20, color: "#545f66" }}
          >
            <optgroup label="Location">
              {locationList
                .filter((location) =>
                  installedLocations.includes(location.locid)
                )
                .map((location) => {
                  return (
                    <option
                      style={{ textAlign: "center" }}
                      key={location.locid}
                      value={location.locid}
                    >
                      {location.locDesc}
                    </option>
                  );
                })}
            </optgroup>
          </Select>
        </FormControl>
      ) : null}

      <Box sx={{ width: 500 }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
            onClick={() => {
              navigate("/");
            }}
          />

          <BottomNavigationAction
            label="Records"
            icon={<Newspaper />}
            onClick={() => {
              navigate("/00137a1000020342");
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
          <BottomNavigationAction
            label="7-Day Query"
            icon={<DateRangeIcon />}
            onClick={() => {
              navigate("/7-day-query");
            }}
          />
        </BottomNavigation>
      </Box>
    </header>
  );
};
export default Header;

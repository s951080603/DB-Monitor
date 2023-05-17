import { useEffect, useState } from "react";
import { pm25SensorList, tvocSensorList } from "../../data";
import "./style.css";
import { useNavigate } from "react-router-dom";

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
      <form className="sensor-form">
        <label htmlFor="sensor"></label>
        <select
          className="sensor-list"
          name="sensor"
          value={devEUI}
          id="sensor"
          onChange={handleSelectChange}
        >
          <option>ALL</option>
          <option disabled>------ PM2.5 ------</option>
          {pm25SensorList.map((mac) => {
            return (
              <option key={mac} value={mac}>
                {mac}
              </option>
            );
          })}
          <option disabled>------- TVOC -------</option>
          {tvocSensorList.map((mac) => {
            return (
              <option key={mac} value={mac}>
                {mac}
              </option>
            );
          })}
        </select>
      </form>
      <div className="current-time">{currentTime}</div>
    </header>
  );
};
export default Header;

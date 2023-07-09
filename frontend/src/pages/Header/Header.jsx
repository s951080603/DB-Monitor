import { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import HomeIcon from '@mui/icons-material/Home';
const Header = () => {
  // const [devEUI, setDevEUI] = useState("ALL");
  // const [location, setLocation] = useState("70734R");

  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  return (
    <header className='header'>
      <h1 className='logo'>EPA MONITOR</h1>

      <Box sx={{ width: 320 }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label='Home'
            icon={<HomeIcon />}
            onClick={() => {
              navigate('/');
            }}
          />

          <BottomNavigationAction
            label='Location'
            icon={<LocationOnIcon />}
            onClick={() => {
              navigate('/location');
            }}
          />

          <BottomNavigationAction
            label='7-Day Query'
            icon={<DateRangeIcon />}
            onClick={() => {
              navigate('/7-day-query');
            }}
          />
        </BottomNavigation>
      </Box>
    </header>
  );
};
export default Header;

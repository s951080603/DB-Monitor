import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

const SharedLayout = ({ rows, locationList, installedLocations }) => {
  return (
    <>
      <Header
        rows={rows}
        locationList={locationList}
        installedLocations={installedLocations}
      />
      <Outlet />
    </>
  );
};
export default SharedLayout;

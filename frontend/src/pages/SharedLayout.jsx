import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

const SharedLayout = ({ locationList }) => {
  return (
    <>
      <Header locationList={locationList} />
      <Outlet />
    </>
  );
};
export default SharedLayout;

import "./style.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

const ariaLabel = { "aria-label": "description" };

const Location = ({ locationList, setLocationList, fetchLocations }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let jsonForm = {};

    formData.forEach((value, key) => {
      jsonForm[key] = value;
    });

    fetch("http://chiu.hopto.org:8963/location", {
      method: "POST",
      body: JSON.stringify(jsonForm),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        fetchLocations()
          .then((data) => {
            setLocationList(data);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    // update locationList
  };
  const locationListKey = Object.keys(locationList[0]);
  return (
    <section className="location-page-container">
      <div className="logo">Location</div>
      <div className="location-data">
        <TableContainer
          component={Paper}
          sx={{
            width: "50%",
            padding: 2,
            borderRadius: 5,
            boxShadow: 5,
            marginTop: 3,
            maxHeight: 700,
          }}
        >
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {locationListKey.map((key) => {
                  return (
                    <TableCell align="center" key={key}>
                      {key}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {locationList.map((row) => (
                <TableRow
                  key={row.locid}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {locationListKey.map((key) => {
                    return (
                      <TableCell
                        align="center"
                        component="th"
                        scope="row"
                        key={key}
                      >
                        {row[key]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <form className="location-form" onSubmit={handleSubmit}>
          <div className="location-form-title">Add New Location</div>
          <div className="data-container">
            <label htmlFor="locid">locid: </label>
            <Input
              required
              label="locid"
              name="locid"
              value={locationList.length + 1}
            />
          </div>
          <div className="data-container">
            <label htmlFor="custid">custid: </label>
            <Input required name="custid" label="custid" />
          </div>
          <div className="data-container">
            <label htmlFor="bldno">bldno: </label>
            <Input required name="bldno" label="bldno" />
          </div>
          <div className="data-container">
            <label htmlFor="floor">floor: </label>
            <Input required name="floor" label="floor" />
          </div>
          <div className="data-container">
            <label htmlFor="locDesc">locDesc: </label>
            <Input required name="locDesc" label="locDesc" />
          </div>

          <Button
            sx={{ width: "50%" }}
            variant="contained"
            color="success"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Location;

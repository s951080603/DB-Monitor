import "./style.css";
import { useParams } from "react-router-dom";
import { createContext, useEffect, useRef, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { AiOutlineEdit } from "react-icons/ai";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

let locationList;

(async function loadLocation() {
  locationList = await fetch("http://chiu.hopto.org:8963/location")
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch((err) => console.error(err));
})();

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const topColumns = [
  { id: "devEUI", label: "DEV EUI", minWidth: 150, align: "center" },
  {
    id: "subtype",
    label: "Subtype and Sensor ID",
    minWidth: 150,
    align: "center",
  },
  { id: "locDesc", label: "Subtype", minWidth: 150, align: "center" },
  { id: "voltage", label: "Current Voltage", minWidth: 150, align: "center" },
  {
    id: "timestamp",
    label: "Last Update Time",
    minWidth: 150,
    align: "center",
  },
];

const recordsColumns = [
  { id: "sensorid", label: "Sensor ID", align: "center", minWidth: 150 },
  { id: "value", label: "Value", align: "center", minWidth: 150 },
  { id: "timestamp", label: "Timestamp", align: "center", minWidth: 200 },
];

const catRecordsColumns = [
  { id: "value", label: "Value", align: "center" },
  { id: "timestamp", label: "Timestamp", align: "center" },
];

const SingleSensorRecord = ({ rows }) => {
  const singleSensorContext = createContext();
  const { devEUI } = useParams();

  const tempDevEUI = devEUI;
  const devMac = tempDevEUI.toLowerCase();

  // filter the data matching mac
  const filterRows = rows.filter((row) => {
    return row.mac == devMac;
  });

  const row =
    filterRows.length == 0
      ? []
      : {
          ...filterRows[0],
          devEUI: devEUI,
          subtype: `${
            filterRows[0].Desc +
            ", " +
            filterRows[1].Desc +
            ", " +
            filterRows[2].Desc
          }`,
        };
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = async (e) => {
    setLocation(e.target.value);
  };
  const handleSubmit = () => {
    const newLocationId = locationList.find(
      (loc) => loc.locDesc === location
    )?.locid;
    const data = {
      locid: newLocationId,
    };
    fetch(`http://chiu.hopto.org:8963/sensor/${devEUI}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    setOpen(false);
  };
  return (
    <section className="sensor-records">
      <TableContainer sx={{ marginTrim: 10, boxShadow: 5 }} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {topColumns.map((col) => {
                return (
                  <TableCell align="center" key={col.id}>
                    {col.id}

                    {col.id == "locDesc" ? (
                      <IconButton
                        className="edit-btn"
                        aria-label="edit"
                        onClick={handleOpen}
                      >
                        <AiOutlineEdit />
                      </IconButton>
                    ) : null}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {topColumns.map((col) => {
                return (
                  <TableCell
                    align="center"
                    component="td"
                    scope="row"
                    key={col.id}
                  >
                    {row[col.id] || "尚無資料"}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <div className="records-container">
        <div className="all-records">
          <h3>All Records</h3>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {recordsColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filterRows.map((row, i) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row["timestamp"] + row["sensorid"]}
                    >
                      {recordsColumns.map((column) => {
                        return (
                          <TableCell key={column.id + i} align={column.align}>
                            {row[column.id] || "尚無資料"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="category-records">
          <div className="records">
            <h3>
              {
                filterRows
                  ?.slice(0, 3)
                  ?.find((row) => row.Desc == "PM2.5" || row.Desc == "TVOC")
                  ?.Desc
              }
            </h3>
            <TableContainer component={Paper}>
              <Table sx={{}} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {catRecordsColumns.map((col) => {
                      return (
                        <TableCell align="center" key={col.id}>
                          {col.id}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterRows
                    .filter((row) => {
                      return row.Desc == "TVOC" || row.Desc == "PM2.5";
                    })
                    .slice(0, 3)
                    .map((row, index) => {
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          key={row.Desc + index}
                        >
                          {catRecordsColumns.map((col) => {
                            return (
                              <TableCell
                                align="center"
                                component="td"
                                scope="row"
                                key={col.id}
                              >
                                {row[col.id] || "尚無資料"}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="records">
            <h3>Temperature</h3>
            <TableContainer component={Paper}>
              <Table sx={{}} aria-label="simple table">
                <TableBody>
                  {filterRows
                    .filter((row) => {
                      return row.Desc == "Temperature";
                    })
                    .slice(0, 3)
                    .map((row, index) => {
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          key={row.Desc + index}
                        >
                          {catRecordsColumns.map((col) => {
                            return (
                              <TableCell
                                align="center"
                                component="td"
                                scope="row"
                                key={col.id}
                              >
                                {row[col.id] || "尚無資料"}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="records">
            <h3>Relative Humidity</h3>
            <TableContainer component={Paper}>
              <Table sx={{}} aria-label="simple table">
                <TableBody>
                  {filterRows
                    .filter((row) => {
                      return row.Desc == "Relative Humidity";
                    })
                    .slice(0, 3)
                    .map((row, index) => {
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          key={row.Desc + index}
                        >
                          {catRecordsColumns.map((col) => {
                            return (
                              <TableCell
                                align="center"
                                component="td"
                                scope="row"
                                key={col.id}
                              >
                                {row[col.id] || "尚無資料"}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <h3>{devEUI}</h3>

          <div className="location-container">
            <p>Location:</p>

            {/* <Input
              value={location || row.locDesc}
              onChange={(e) => setLocation(e.target.value)}
            /> */}
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={location || row.locDesc}
                label="location"
                onChange={handleChange}
              >
                {locationList.map((location) => {
                  return (
                    <MenuItem value={location.locDesc} key={location.locDesc}>
                      {location.locDesc}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className="btn-container">
            <Button
              sx={{ width: "100px" }}
              variant="outlined"
              color="error"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              sx={{ width: "100px" }}
              variant="contained"
              color="success"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </section>
  );
};
export default SingleSensorRecord;

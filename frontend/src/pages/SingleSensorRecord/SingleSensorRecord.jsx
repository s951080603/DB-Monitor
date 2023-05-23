import "./style.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
  const { devEUI } = useParams();

  const tempDevEUI = devEUI;
  const devMac = tempDevEUI.toLowerCase();

  // filter the data matching mac
  const filterRows = rows
    .filter((row) => {
      return row.mac == devMac;
    })
    .sort();

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
          <h2>All Records</h2>
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
            <h3>{filterRows[0]?.Desc}</h3>
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
                      return row.Desc == filterRows[0]?.Desc;
                    })
                    .slice(0, 3)
                    .map((row) => {
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          // NOTE:
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
            <h3>{filterRows[1]?.Desc}</h3>
            <TableContainer component={Paper}>
              <Table sx={{}} aria-label="simple table">
                <TableBody>
                  {filterRows
                    .filter((row) => {
                      return row.Desc == filterRows[1]?.Desc;
                    })
                    .slice(0, 3)
                    .map((row) => {
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
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
            <h3>{filterRows[2]?.Desc}</h3>
            <TableContainer component={Paper}>
              <Table sx={{}} aria-label="simple table">
                <TableBody>
                  {filterRows
                    .filter((row) => {
                      return row.Desc == filterRows[2]?.Desc;
                    })
                    .slice(0, 3)
                    .map((row) => {
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
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
    </section>
  );
};
export default SingleSensorRecord;

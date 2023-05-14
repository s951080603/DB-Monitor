import "./style.css";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import io from "socket.io-client";
const columns = [
  { id: "sensorid", label: "Sensor ID", minWidth: 200, align: "center" },
  { id: "sensormac", label: "Mac Address", minWidth: 150, align: "center" },
  { id: "subtype", label: "Subtype", minWidth: 150, align: "center" },
  { id: "value", label: "Value", minWidth: 150, align: "center" },
  { id: "voltage", label: "Voltage", minWidth: 150, align: "center" },
  { id: "location", label: "Location", minWidth: 150, align: "center" },
  { id: "timestamp", label: "Timestamp", minWidth: 250, align: "center" },
];

const fetchRecords = async () => {
  const response = await fetch("http://chiu.hopto.org:8963/record/all");
  const data = await response.json();
  return data;
};

const AllRecords = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    let start = new Date();
    fetchRecords()
      .then((data) => {
        setRows(data);
        let end = new Date();
        console.log(`fetch data spent: ${(end - start) / 1000} s`);
      })
      .catch((error) => {
        console.error(error);
      });

    const socket = io("http://chiu.hopto.org:8080");
    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });
    // 監聽來自伺服器端的訊息
    socket.on("message", (data) => {
      console.log(data);
    });
    socket.on("db-notify", (data) => {
      setRows((currentRows) => {
        const newRows = [data, ...currentRows];
        return newRows;
      });
      console.log("new data coming");
    });

    // 結束時關閉連線
    return () => {
      socket.disconnect();
      console.log("socket disconnect");
    };
  }, []);
  return (
    <section className="all-records">
      <div className="title">Records</div>
      {/* <table className="records-table">
        <thead className="records-table-head">
          <tr className="records-table-row">
            <th>Sensor ID</th>
            <th>Mac Address</th>
            <th>Subtype</th>
            <th>Value</th>
            <th>Voltage</th>
            <th>Location</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody className="records-table-body">
          <tr className="records-table-row">
            <td>{}</td>
            <td>{}</td>
            <td>{}</td>
            <td>{}</td>
            <td>{}</td>
            <td>{}</td>
            <td>{}</td>
          </tr>
        </tbody>
      </table> */}
      <TableContainer sx={{ maxHeight: 780 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
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
            {rows.map((row, i) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row["timestamp"] + row["sensorid"]}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id + i} align={column.align}>
                        {row[column.id] || "null"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
};
export default AllRecords;

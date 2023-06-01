import "./style.css";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "sensorid", label: "Sensor ID", minWidth: 160, align: "center" },
  { id: "mac", label: "Mac Address", minWidth: 140, align: "center" },
  { id: "Desc", label: "Subtype", minWidth: 140, align: "center" },
  { id: "value", label: "Value", minWidth: 160, align: "center" },
  { id: "voltage", label: "Voltage", minWidth: 120, align: "center" },
  { id: "locDesc", label: "Location", minWidth: 120, align: "center" },
  { id: "timestamp", label: "Timestamp", minWidth: 230, align: "center" },
];

const AllRecords = ({ rows }) => {
  return (
    <section className="all-records">
      <div className="title">Records</div>

      <TableContainer
        sx={{
          borderRadius: 5,
          boxShadow: 5,
          maxHeight: 780,
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead sx={{ height: 70 }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  sx={{
                    fontSize: 24,
                    color: "#545f66",
                  }}
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
                    return (
                      <TableCell
                        sx={{
                          fontSize: 18,
                        }}
                        key={column.id + i}
                        align={column.align}
                      >
                        {column.id == "value"
                          ? row[column.id] + " " + row.unit
                          : row[column.id] || "尚無資料"}
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

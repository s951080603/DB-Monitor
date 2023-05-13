import "./style.css";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "sensorId", label: "Sensor ID", minWidth: 200 },
  { id: "sensorMac", label: "Mac Address", minWidth: 200 },
  { id: "subtype", label: "Subtype", minWidth: 200 },
  { id: "value", label: "Value", minWidth: 200 },
  { id: "voltage", label: "Voltage", minWidth: 200 },
  { id: "location", label: "Location", minWidth: 200 },
  { id: "timestamp", label: "Timestamp", minWidth: 200 },
];




const AllRecords = () => {
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
      <TableContainer sx={{ maxHeight: 440 }}>
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
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

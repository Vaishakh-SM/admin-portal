import { Heading, Header, Button } from "grommet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

export default function VNProfile() {
  const [username, setUserName] = useState("");
  const [vendorID, setVendorID] = useState("");
  const [field, setField] = useState("");
  const [dues, setDues] = useState();
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUser").then((response) => {
      setUserName(response.data.username);
    });

  
    axios.get("http://localhost:3001/api/getVendor").then((response) => {
      setVendorID(response.data.vendorID);
      setField(response.data.field);
      setDues(response.data.dues);
    });
  }, []);

  return (
    <div>
      <Header pad="none" justify="center" border={{ side: "bottom" }}>
        <Heading alignSelf="center" level="2">
          Welcome {username}{" "}
        </Heading>
      </Header>
      <div style={{ padding: "1%", width: "48%", float: "left" }}>
        <Heading level="3">
          <u>Profile Details</u>
        </Heading>
        <table style={{ width: "70%" }}>
          <tr>
            <th style={{ textalign: "left" }}>Username:</th>
            <td style={{ textalign: "left" }}>{username}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Vendor ID:</th>
            <td style={{ textalign: "left" }}>{vendorID}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Field:</th>
            <td style={{ textalign: "left" }}>{field}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Remaining Dues:</th>
            <td style={{ textalign: "left" }}>{dues}</td>
          </tr>
        </table>
      </div>
      <div
        style={{ padding: "1%", width: "48%", float: "right" }}
      >
        <br />
        <Button
          label="Update Details"
          onClick={() => {
            navigate("/landscaping/vendor_update");
          }}
        />
        <br />
        <br />
        <Button 
          label="Add Payment Request"
          onClick={() => {
            navigate("/landscaping/vendor_pay");
          }} />
        <br />
        <br />
        <Button 
          label="Add Repair Notes"
          onClick={() => {
            navigate("/landscaping/repair_notes");
          }} />
        <br />
        <br />
        <Button
          label="Sign Out"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
    </div>
  );
}

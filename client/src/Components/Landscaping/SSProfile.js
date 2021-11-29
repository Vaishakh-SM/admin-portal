import { Heading, Header, Button } from "grommet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

export default function SSProfile() {
  const [username, setUserName] = useState("");
  const [name, setName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUser").then((response) => {
      setUserName(response.data.username);
    });

  
    axios.get("http://localhost:3001/api/getSupervisor").then((response) => {
      setEmployeeID(response.data.employeeID);
      setName(response.data.name);
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
            <th style={{ textalign: "left" }}>Employee ID:</th>
            <td style={{ textalign: "left" }}>{employeeID}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Name:</th>
            <td style={{ textalign: "left" }}>{name}</td>
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
            navigate("/landscaping/supervisor_update");
          }}
        />
        <br />
        <br />
        <Button 
          label="Check Vendor Payment Requests"
          onClick={() => {
            navigate("/landscaping/super_vendor_pay");
          }} />
        <br />
        <br />
        <Button 
          label="Check Landscaping Requests"
          onClick={() => {
            navigate("/landscaping/super_cut_recs");
          }} />
        <br />
        <br />
        <Button 
          label="Scheduler"
          onClick={() => {
            navigate("/landscaping/scheduler");
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
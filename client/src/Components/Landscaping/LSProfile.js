import { Heading, Header, Button } from "grommet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

export default function LSProfile() {
  const [username, setUserName] = useState("");
  const [name, setName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [phno, setPhno] = useState();
  const [monthHours, setMH] = useState();
  const [leaveDay, setLD] = useState();
  const [garden, setGD] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUser").then((response) => {
      setUserName(response.data.username);
    });

  
    axios.get("http://localhost:3001/api/getGardener").then((response) => {
      setName(response.data.name);
      setEmployeeID(response.data.employeeID);
      setPhno(response.data.phonenumber);
      setMH(response.data.monthHours);
      setLD(response.data.leaveDay);
      setGD(response.data.garden);
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
            <th style={{ textalign: "left" }}>Full Name:</th>
            <td style={{ textalign: "left" }}>{name}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Employee ID:</th>
            <td style={{ textalign: "left" }}>{employeeID}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Monthly Hours:</th>
            <td style={{ textalign: "left" }}>{monthHours}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Phone number:</th>
            <td style={{ textalign: "left" }}>{phno}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Leave Day:</th>
            <td style={{ textalign: "left" }}>{leaveDay}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Currently Gardening:</th>
            <td style={{ textalign: "left" }}>{garden}</td>
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
            navigate("/landscaping/add_details");
          }}
        />
        <br />
        <br />
        <Button 
          label="Change Garden"
          onClick={() => {
            navigate("/landscaping/update_loc");
          }} />
        <br />
        <br />
        <Button 
          label="Schedule" 
          onClick={()=>{
            navigate("/landscaping/schedule");
          }}/>
        <br />
        <br />
        <Button 
          label="Add Garden Notes"
          onClick={() => {
            navigate("/landscaping/garden_note_add");
          }} />
        <br />
        <br />
        <Button 
          label="Check Garden Notes"
          onClick={() => {
            navigate("/landscaping/garden_note");
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

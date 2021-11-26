import { Heading, Header, Button } from "grommet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

export default function MSProfile() {
  const [username, setUserName] = useState("");
  const [name, setName] = useState("");
  const [storeID, setStoreID] = useState();
  const [storeName, setStoreName] = useState("");
  const [phno, setPhno] = useState();
  const [securitypassID, setID] = useState("");
  const [passexpiry, setExpiry] = useState();
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/api/getShopkeeper").then((response) => {
      setUserName(response.data.username);
      setName(response.data.name);
      setStoreID(response.data.storeID);
      setStoreName(response.data.storeName);
      setPhno(response.data.phonenumber);
      setID(response.data.securitypassID);
      setExpiry(response.data.passexpiry);
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
            <th style={{ textalign: "left" }}>Store ID:</th>
            <td style={{ textalign: "left" }}>{storeID}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Store Name:</th>
            <td style={{ textalign: "left" }}>{storeName}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Phone number:</th>
            <td style={{ textalign: "left" }}>{phno}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Security Pass ID:</th>
            <td style={{ textalign: "left" }}>{securitypassID}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Pass Expiry:</th>
            <td style={{ textalign: "left" }}>{passexpiry}</td>
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
            navigate("/market/personal_details");
          }}
        />
        <br />
        <br />
        <Button label="Submit bills" />
        <br />
        <br />
        <Button label="Request License Extension" />
        <br />
        <br />
        <Button label="Store Details" />
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

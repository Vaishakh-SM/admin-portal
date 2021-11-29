import { Button, Header, Heading } from "grommet";
import { CaretPrevious } from "grommet-icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

const Head = () => {
  let navigate = useNavigate();
  return (
    <Header alignContent="center" border={{ side: "bottom" }}>
      <Button
        icon={<CaretPrevious />}
        hoverIndicator
        onClick={() => {
          navigate("/market/profile");
        }}
      />
    </Header>
  );
};

export default function StoreProfile() {
  const [username, setUserName] = useState("");
  const [storeID, setStoreID] = useState();
  const [storeName, setStoreName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [licenseID, setID] = useState("");
  const [licenseExpiry, setExpiry] = useState();
  const [rating, setRating] = useState();
  const [pendingbills, setPendingBills] = useState([]);
  const [statRequests, setStatRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUser").then((response) => {
      setUserName(response.data.username);
    });
    axios.get("http://localhost:3001/api/getStoreDetails").then((response) => {
      const row = response.data.info;
      setStoreID(row.StoreID);
      setStoreName(row.StoreName);
      setLocation(row.Location);
      setCategory(row.Category);
      setAvailability(row.Availability);
      setID(row.LicenseID);
      setExpiry(row.LicenseExpiry);
      setRating(row.rating);
    });
    axios.get("http://localhost:3001/api/getPendingBills").then((response) => {
      setPendingBills(response.data.info);
    });
    axios.get("http://localhost:3001/api/getRequestStatus").then((response) => {
      setStatRequests(response.data.info);
    });
    axios.get("http://localhost:3001/api/getFeedback").then((response) => {
      setMessages(response.data.info);
    });
  }, []);

  return (
    <div>
      <Head />
      <div style={{ padding: "2%", width: "46%", float: "left" }}>
        <Heading level="3">
          <u>Store Details</u>
        </Heading>
        <table style={{ width: "70%" }}>
          <tr>
            <th style={{ textalign: "left" }}>Shopkeeper username:</th>
            <td style={{ textalign: "left" }}>{username}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Store Name:</th>
            <td style={{ textalign: "left" }}>{storeName}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Store ID:</th>
            <td style={{ textalign: "left" }}>{storeID}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Category:</th>
            <td style={{ textalign: "left" }}>{category}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Location:</th>
            <td style={{ textalign: "left" }}>{location}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Availability:</th>
            <td style={{ textalign: "left" }}>{availability}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>License ID:</th>
            <td style={{ textalign: "left" }}>{licenseID}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>License Expiry:</th>
            <td style={{ textalign: "left" }}>{licenseExpiry}</td>
          </tr>
          <tr>
            <th style={{ textalign: "left" }}>Feedback:</th>
            <td style={{ textalign: "left" }}>{rating}/5</td>
          </tr>
        </table>
        <br />
        <Button
          label="Submit bills"
          onClick={() => {
            navigate("/market/submit_bills");
          }}
        />
        <br />
        <br />
        <Button
          label="Request License Extension"
          onClick={() => {
            navigate("/market/license_extension");
          }}
        />
        <br />
      </div>
      <div style={{ padding: "2%", width: "46%", float: "right" }}>
        <Heading level="3">
          <u>Feedback Messages</u>
        </Heading>
        <table>
          <tbody>
            {messages.map((fd) => {
              return (
                <tr align="center">
                  <td align="center">{fd.message}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Heading level="3">
          <u>Pending Bills</u>
        </Heading>
        <table border="1">
          <thead>
            <tr align="center">
              <th align="center" width="10%">
                PB_ID
              </th>
              <th align="center" width="20%">
                Type
              </th>
              <th align="center" width="20%">
                Month
              </th>
              <th align="center" width="40%">
                Due Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {pendingbills.map((bill) => {
              var dt = new Date(bill.month).toLocaleString("en-us", {
                month: "short",
                year: "numeric",
              });
              return (
                <tr align="center">
                  <td align="center" width="10%">
                    {bill.pb_id}
                  </td>
                  <td align="center" width="20%">
                    {bill.type}
                  </td>
                  <td align="center" width="20%">
                    {dt}
                  </td>
                  <td align="center" width="40%">
                    {bill.due_amount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Heading level="3">
          <u>Request Status</u>
        </Heading>
        <table border="1">
          <thead>
            <tr align="center">
              <th align="center" width="30%">
                ID
              </th>
              <th align="center" width="20%">
                Type
              </th>
              <th align="center" width="40%">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {statRequests.map((req) => {
              return (
                <tr align="center">
                  <td align="center" width="30%">
                    {req.id}
                  </td>
                  <td align="center" width="20%">
                    {req.type}
                  </td>
                  <td align="center" width="40%">
                    {req.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

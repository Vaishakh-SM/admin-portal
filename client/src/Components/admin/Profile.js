import { Button, Form, FormField, Header, Heading, Select } from "grommet";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const axios = require("axios");
axios.defaults.withCredentials = true;
const statusOptions = ["In review", "Accepted", "Denied", "On hold"];

export default function Profile() {
  const [bills, setBills] = useState([]);
  const [license, setLicense] = useState([]);
  const [bvalue, setbValue] = useState({});
  const [lvalue, setlValue] = useState({});
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/api/getBillRequests").then((response) => {
      setBills(response.data.info);
    });
    axios
      .get("http://localhost:3001/api/getLicenseRequests")
      .then((response) => {
        setLicense(response.data.info);
      });
  }, []);

  return (
    <div>
      <Header pad="none" justify="center" border={{ side: "bottom" }}>
        <Heading alignSelf="center" level="2">
          Administrator Privileges
        </Heading>
      </Header>
      <div>
        <br />
        &nbsp;&nbsp;
        <Button label="Add store" />
        &nbsp;&nbsp;
        <Button
          label="Sign Out"
          onClick={() => {
            axios.get("http://localhost:3001/api/logout");
            navigate("/");
          }}
        />
        <Heading level="3">
          &nbsp;&nbsp;
          <u>Bill Requests</u>
        </Heading>
        <div style={{ paddingLeft: "1%", paddingRight: "2%" }}>
          <Form
            value={bvalue}
            onChange={(nextValue) => setbValue(nextValue)}
            onReset={() => setbValue({})}
            onSubmit={({ value }) => {
              var lst = [];
              for (const [key, val] of Object.entries(value)) {
                console.log(key, val);
                var single = {};
                single.status = val;
                single.id = Number(key.split("_")[1]);
                lst.push(single);
              }
              axios
                .post("http://localhost:3001/api/updateBillRequest", lst)
                .then((response) => {
                  if (response.data.success) {
                    Swal.fire(response.data.message);
                  } else {
                    Swal.fire(response.data.message);
                  }
                });
            }}
          >
            <table border="1">
              <thead>
                <tr align="center">
                  <th align="center" width="5%">
                    PB_ID
                  </th>
                  <th align="center" width="5%">
                    StoreID
                  </th>
                  <th align="center" width="10%">
                    Type
                  </th>
                  <th align="center" width="10%">
                    Month
                  </th>
                  <th align="center" width="10%">
                    Paid Amount
                  </th>
                  <th align="center" width="10%">
                    Transaction ID
                  </th>
                  <th align="center" width="10%">
                    Mode of Payment
                  </th>
                  <th align="center" width="10%">
                    Due Amount
                  </th>
                  <th align="center" width="20%">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => {
                  var dt = new Date(bill.month).toLocaleString("en-us", {
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <tr align="center">
                      <td align="center" width="5%">
                        {bill.pb_id}
                      </td>
                      <td align="center" width="5%">
                        {bill.storeID}
                      </td>
                      <td align="center" width="10%">
                        {bill.type}
                      </td>
                      <td align="center" width="10%">
                        {dt}
                      </td>
                      <td align="center" width="10%">
                        {bill.amount}
                      </td>
                      <td align="center" width="10%">
                        {bill.transactionID}
                      </td>
                      <td align="center" width="10%">
                        {bill.modeofpayment}
                      </td>
                      <td align="center" width="10%">
                        {bill.due_amount}
                      </td>
                      <td align="center" width="20%">
                        <FormField name={"status_" + bill.breqID}>
                          <Select
                            options={statusOptions}
                            name={"status_" + bill.breqID}
                            placeholder={bill.status}
                            required
                          />
                        </FormField>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <br />
            <Button type="submit" size="medium" primary label="Update" />
          </Form>
        </div>
        <Heading level="3">
          &nbsp;&nbsp;
          <u>License Extension Requests</u>
        </Heading>
        <div style={{ paddingLeft: "1%", paddingRight: "2%" }}>
          <Form
            value={lvalue}
            onChange={(nextValue) => setlValue(nextValue)}
            onSubmit={({ value }) => {
              var lst = [];
              for (const [key, val] of Object.entries(value)) {
                console.log(key, val);
                var single = {};
                single.status = val;
                single.id = Number(key.split("_")[1]);
                lst.push(single);
              }
              axios
                .post("http://localhost:3001/api/updateLicenseRequest", lst)
                .then((response) => {
                  if (response.data.success) {
                    Swal.fire(response.data.message);
                  } else {
                    Swal.fire(response.data.message);
                  }
                });
            }}
          >
            <table border="1">
              <thead>
                <tr align="center">
                  <th align="center" width="10%">
                    LicenseID
                  </th>
                  <th align="center" width="5%">
                    StoreID
                  </th>
                  <th align="center" width="10%">
                    Time Period (in years)
                  </th>
                  <th align="center" width="10%">
                    Expiry Date
                  </th>
                  <th align="center" width="10%">
                    Fee Paid
                  </th>
                  <th align="center" width="10%">
                    Transaction ID
                  </th>
                  <th align="center" width="10%">
                    Mode of Payment
                  </th>
                  <th align="center" width="20%">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {license.map((lic) => {
                  var dt = new Date(lic.licenseExpiry).toLocaleString("en-us", {
                    month: "short",
                    year: "numeric",
                    day: "2-digit",
                  });
                  return (
                    <tr align="center">
                      <td align="center" width="10%">
                        {lic.licenseID}
                      </td>
                      <td align="center" width="5%">
                        {lic.storeID}
                      </td>
                      <td align="center" width="5%">
                        {lic.period}
                      </td>
                      <td align="center" width="10%">
                        {dt}
                      </td>
                      <td align="center" width="10%">
                        {lic.fee_paid}
                      </td>
                      <td align="center" width="10%">
                        {lic.transactionID}
                      </td>
                      <td align="center" width="10%">
                        {lic.modeofpayment}
                      </td>
                      <td align="center" width="20%">
                        <FormField name={"status_" + lic.er_id}>
                          <Select
                            options={statusOptions}
                            name={"status_" + lic.er_id}
                            placeholder={lic.status}
                            required
                          />
                        </FormField>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <br />
            <Button type="submit" size="medium" primary label="Update" />
          </Form>
        </div>
        <br />
      </div>
    </div>
  );
}

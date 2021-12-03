import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  ResponsiveContext,
  TextInput,
  Select,
  DateInput,
  Layer,
  DataTable,
} from "grommet";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

export default function GHEmpBills() {
  const [show, setShow] = useState();
  const [bill, setBill] = useState([]);
  const [roomBill, setRoomBill] = useState([]);
  const [showRoom, setShowRoom] = useState();
  const [UID, setUID] = useState();
  const [FoodBookingID, setFoodBookingID] = useState();
  const [RoomBookingID, setRoomBookingID] = useState();
  let navigate = useNavigate();
  return (
    <Box>
      <Header justify="center" border={{ side: "bottom" }}>
        <Heading alignSelf="center">Bill generation</Heading>
        <Box flex="grow"></Box>
        <Button
          onClick={() => {
            navigate("/guesthouse/employee/profile");
          }}
          label="Profile"
        />
        <Button
          onClick={() => {
            navigate("/");
          }}
          label="Home"
        />
      </Header>

      <Box direction="row" pad="medium" justify="around">
        <Box gap="medium">
          <TextInput
            value={UID}
            onChange={(event) => setUID(event.target.value)}
            placeholder="Enter User ID here"
          />

          <Button
            onClick={() => {
              window.open(
                "http://localhost:3001/api/guesthouse/employee/bill/" + UID,
                "_blank"
              );
            }}
            label="Generate bill"
          />

          <Button
            onClick={() => {
              axios
                .get(
                  "http://localhost:3001/api/guesthouse/employee/getPendingFoodForID/" +
                    UID
                )
                .then((response) => {
                  setBill(response.data.bill);
                  setShow(true);
                });
            }}
            label="View pending food bills"
          />

          <Button
            onClick={() => {
              axios
                .get(
                  "http://localhost:3001/api/guesthouse/employee/getPendingRoomForID/" +
                    UID
                )
                .then((response) => {
                  setRoomBill(response.data.bill);
                  setShowRoom(true);
                });
            }}
            label="View pending room bills"
          />

          <Button
            onClick={() => {
              Swal.fire({
                title: "Proceed to clear all bills for " + UID + "?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, proceed!",
              }).then((result) => {
                if (result.isConfirmed) {
                  axios
                    .post(
                      "http://localhost:3001/api/guesthouse/employee/clearBillsForID/",
                      { UID: UID }
                    )
                    .then((response) => {
                      if (response.data.success === true) {
                        Swal.fire(
                          "Cleared all bills for User ID: " + UID,
                          "",
                          "success"
                        );
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: "Internal Error",
                          text: "Something went wrong!",
                        });
                      }
                    });
                }
              });
            }}
            label="Clear Bills"
          />
        </Box>
        <Box gap="medium">
          <TextInput
            value={FoodBookingID}
            onChange={(event) => setFoodBookingID(event.target.value)}
            placeholder="Enter Food booking ID here"
          />
          <Button
            label="Clear Food bill"
            onClick={() => {
              axios
                .post(
                  "http://localhost:3001/api/guesthouse/employee/clearFoodBillsByID/",
                  { FoodBookingID: FoodBookingID }
                )
                .then((response) => {
                  if (response.data.success === true) {
                    Swal.fire(
                      "Cleared Food bill of ID: " + FoodBookingID,
                      "",
                      "success"
                    );
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Internal Error",
                      text: "Something went wrong!",
                    });
                  }
                });
            }}
          />
        </Box>

        <Box gap="medium">
          <TextInput
            value={RoomBookingID}
            onChange={(event) => setFoodBookingID(event.target.value)}
            placeholder="Enter Food booking ID here"
          />
          <Button
            label="Clear Room bill"
            onClick={() => {
              Swal.fire({
                title: "Proceed to clear room billing?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, proceed!",
              }).then((result) => {
                if (result.isConfirmed) {
                  axios
                    .post(
                      "http://localhost:3001/api/guesthouse/employee/clearFoodBillsByID/",
                      { RoomBookingID: RoomBookingID }
                    )
                    .then((response) => {
                      if (response.data.success === true) {
                        Swal.fire(
                          "Cleared Food bill of ID: " + RoomBookingID,
                          "",
                          "success"
                        );
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: "Internal Error",
                          text: "Something went wrong!",
                        });
                      }
                    });
                }
              });
            }}
          />
        </Box>
      </Box>

      {show && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <Box pad="medium">
            <DataTable
              columns={[
                {
                  property: "FoodBookingID",
                  header: <Heading level="4">Food Booking ID</Heading>,
                  primary: false,
                },
                {
                  property: "FoodName",
                  header: <Heading level="4">Food Name</Heading>,
                  primary: false,
                },
                {
                  property: "Rate",
                  header: <Heading level="4">Rate</Heading>,
                  primary: false,
                },
                {
                  property: "BookedDate",
                  header: <Heading level="4">Date of booking</Heading>,
                  primary: false,
                },
              ]}
              data={bill}
            />
          </Box>
        </Layer>
      )}

      {showRoom && (
        <Layer
          onEsc={() => setShowRoom(false)}
          onClickOutside={() => setShowRoom(false)}
        >
          <Box pad="medium">
            <DataTable
              columns={[
                {
                  property: "UID",
                  header: <Heading level="4">User ID</Heading>,
                  primary: false,
                },
                {
                  property: "RoomBookingID",
                  header: <Heading level="4">Room Booking ID</Heading>,
                  primary: false,
                },

                {
                  property: "RoomID",
                  header: <Heading level="4">Room number</Heading>,
                  primary: false,
                },
                {
                  property: "EndDate",
                  header: <Heading level="4">Last date of stay</Heading>,
                  primary: false,
                },
                {
                  property: "Cost",
                  header: <Heading level="4">Cost</Heading>,
                  primary: false,
                },
              ]}
              data={roomBill}
            />
          </Box>
        </Layer>
      )}
    </Box>
  );
}

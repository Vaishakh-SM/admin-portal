import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  ResponsiveContext,
  Select,
  DateInput,
  Image,
  Text,
  DataTable,
  TextInput,
  Layer,
} from "grommet";
import React, { useState, useEffect } from "react";
import { resolvePath } from "react-router";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

export default function GHUserProfile() {
  const [show, setShow] = useState();
  const [bill, setBill] = useState([]);
  const [roomBill, setRoomBill] = useState([]);
  const [showRoom, setShowRoom] = useState();
  const [UID, setUID] = useState();
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUserID").then((response) => {
      console.log("Data is ", response.data);
      setUID(response.data.UID);
    });
  }, []);

  return (
    <Box>
      <Header justify="center" border={{ side: "bottom" }}>
        <Heading alignSelf="center">User profile</Heading>
      </Header>

      <Box direction="row" pad="medium" justify="around">
        <Box gap="medium">
          <Button
            onClick={() => {
              navigate("/guesthouse/booking");
            }}
            label="Book Room"
          />
          <Button
            onClick={() => {
              navigate("/guesthouse/food");
            }}
            label="Order food"
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
              navigate("/");
            }}
            label="Home"
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

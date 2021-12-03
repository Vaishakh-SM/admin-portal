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
} from "grommet";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

const Head = () => {
  let navigate = useNavigate();
  return (
    <Header justify="center" border={{ side: "bottom" }}>
      <Heading alignSelf="center">Booking</Heading>
      <Box flex="grow"></Box>
      <Button
        onClick={() => {
          navigate("/guesthouse/user/profile");
        }}
        label="Profile"
      />
    </Header>
  );
};

function ArrayToList({ props }) {
  let listItems = props.map((item) => {
    return (
      <Box direction="row">
        <Box
          pad="small"
          border="true"
          flex="shrink"
          focusIndicator="true"
          onClick={() => {
            Swal.fire({
              title: "Proceed to book Room " + item.RoomID + "?",
              text: "Total cost: " + totalDays * item.Rate,
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, proceed!",
            }).then((result) => {
              if (result.isConfirmed) {
                axios
                  .post("http://localhost:3001/api/guesthouse/bookRoom", {
                    roomID: item.RoomID,
                    startDate: startDate,
                    endDate: endDate,
                  })
                  .then((response) => {
                    if (response.data.success === true) {
                      Swal.fire(
                        "Booked!",
                        "Room number " +
                          item.RoomID +
                          " has been booked in the given dates",
                        "success"
                      );
                    } else {
                      Swal.fire({
                        icon: "error",
                        title: response.data.message,
                        text: "Something went wrong!",
                      });
                    }
                  });
              }
            });
          }}
        >
          <Box direction="column">
            <Box>
              <Box direction="row">
                <Heading level="4">Room ID: {item.RoomID}</Heading>
              </Box>
            </Box>
            <Box>Rate per day (in rupees): {item.Rate}</Box>
          </Box>
        </Box>
        <Box flex="grow"></Box>
      </Box>
    );
  });

  return (
    <Box>
      <Box direction="column" pad="small" gap="medium">
        {listItems}
      </Box>
    </Box>
  );
}

let startDate, endDate, totalDays;
export default function GHBooking() {
  const [value, setValue] = useState({});

  const [roomResult, setRoomResult] = useState({
    message: "Please search for a room",
    rooms: [],
  });
  const size = React.useContext(ResponsiveContext);

  return (
    <Box>
      <Head />
      <Box
        fill="true"
        direction={size === "small" ? "column" : "row"}
        justify="around"
        align="stretch"
        pad="medium"
      >
        <Box
          flex={{ shrink: 0 }}
          width={size === "small" ? null : "large"}
          pad={
            size === "small"
              ? { horizontal: "small" }
              : { bottom: "xlarge", horizontal: "medium" }
          }
        >
          <Form
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            onReset={() => setValue({})}
            onSubmit={({ value }) => {
              let val = new Date(value.startDate);

              startDate =
                val.getFullYear() +
                "-" +
                String(Number(val.getMonth() + 1)) +
                "-" +
                val.getDate();

              val = new Date(value.endDate);

              endDate =
                val.getFullYear() +
                "-" +
                String(Number(val.getMonth() + 1)) +
                "-" +
                val.getDate();

              totalDays = Math.ceil(
                Math.abs(new Date(value.endDate) - new Date(value.startDate)) /
                  (1000 * 60 * 60 * 24)
              );

              axios
                .post("http://localhost:3001/api/guesthouse/searchRoom", value)
                .then((response) => {
                  if (response.data.success === true) {
                    setRoomResult({
                      message: response.data.message,
                      rooms: response.data.rooms,
                    });
                  } else {
                    Swal.fire(response.data.message);
                  }
                });
            }}
          >
            <FormField
              name="capacity"
              htmlFor="text-input-id"
              label="Capacity"
              required
            >
              <Select options={["1", "2", "3", "4"]} name="capacity" />
            </FormField>

            <FormField
              name="beds"
              htmlFor="text-input-id"
              label="Number of beds"
              required
            >
              <Select options={["1", "2", "3", "4"]} name="beds" />
            </FormField>
            <FormField
              name="type"
              htmlFor="text-input-id"
              label="Type of Room"
              required
            >
              <Select options={["AC", "NON AC"]} name="type" />
            </FormField>
            <FormField>
              <Box pad="small">Start date</Box>
              <DateInput format="dd/mm/yyyy" name="startDate" />
            </FormField>

            <FormField
              validate={(fieldData, formData) => {
                console.log("field", formData);
                if (formData.endDate < formData.startDate) {
                  return "End date should be greater than start date";
                }
              }}
            >
              <Box pad="small">End date</Box>
              <DateInput format="dd/mm/yyyy" name="endDate" />
            </FormField>
            <Box
              direction={size === "small" ? "column" : "row"}
              gap="medium"
              margin={{ top: "large" }}
              fill={"horizontal"}
            >
              <Button type="Submit" size="large" primary label="Search" />
              <Button type="reset" size="large" label="Reset" />
            </Box>
          </Form>
        </Box>

        <Box flex="grow">
          {roomResult.message}
          <ArrayToList props={roomResult.rooms} />
        </Box>
      </Box>
    </Box>
  );
}

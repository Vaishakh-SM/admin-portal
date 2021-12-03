import {
  Box,
  Button,
  DataTable,
  DateInput,
  Form,
  FormField,
  Header,
  Heading,
  Layer,
  Paragraph,
  TextInput,
} from "grommet";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const axios = require("axios");
axios.defaults.withCredentials = true;

function stringToDate(dateString) {
  if (dateString == undefined) {
    return "2021-11-30";
  }

  let val = new Date(String(dateString));

  let ret =
    val.getFullYear() +
    "-" +
    String(Number(val.getMonth()) + 1) +
    "-" +
    val.getDate();
  return ret;
}

export default function GHProfile() {
  const [username, setUserName] = useState("");
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUser").then((response) => {
      setUserName(response.data.username);
    });
  }, []);

  let navigate = useNavigate();
  return (
    <Box>
      <Header justify="center" border={{ side: "bottom" }}>
        <Box direction="column">
          <Heading alignSelf="center">Cook Profile: {username}</Heading>
        </Box>
        <Box flex="grow"></Box>
        <Button
          onClick={() => {
            navigate("/");
          }}
          label="Home"
        />
        <Button
          onClick={() => {
            navigate("/guesthouse/cook/orders");
          }}
          label="See Orders"
        />

        <Button
          onClick={() => {
            navigate("/guesthouse/cook/food");
          }}
          label="Add food items"
        />
      </Header>

      <Box direction="column" justify="around" pad="medium">
        <Box pad="medium" direction="row">
          <Form
            onSubmit={({ value }) => {
              value.startDate = stringToDate(value.startDate);
              value.endDate = stringToDate(value.endDate);

              axios
                .post(
                  "http://localhost:3001/api/guesthouse/supervisor/getSchedule",
                  value
                )
                .then((response) => {
                  console.log("Resp is ", response.data.schedule);
                  let val = response.data.schedule;
                  for (let i in val) {
                    val[i].ShiftDate = stringToDate(val[i].ShiftDate);
                  }
                  setSchedule(val);
                });
            }}
          >
            <FormField
              name="startDate"
              htmlFor="text-input-id"
              label="Start date"
            >
              <DateInput format="dd/mm/yyyy" name="startDate" />
            </FormField>

            <FormField name="endDate" htmlFor="text-input-id" label="End date">
              <DateInput format="dd/mm/yyyy" name="endDate" />
            </FormField>
            <Box direction="row" gap="medium">
              <Button type="submit" primary label="View Schedule" />
              <Button type="reset" label="Reset" />
            </Box>
          </Form>
          <Box flex="grow"></Box>
        </Box>

        <Box>
          <DataTable
            columns={[
              {
                property: "Name",
                header: <Heading level="4">Employee Name</Heading>,
                primary: false,
              },
              {
                property: "ShiftDate",
                header: <Heading level="4">Date</Heading>,
                primary: false,
              },
              {
                property: "ShiftTime",
                header: <Heading level="4">Shift</Heading>,
                primary: false,
              },
            ]}
            data={schedule}
            size="small"
            fill="horizontal"
          />
        </Box>
      </Box>
    </Box>
  );
}

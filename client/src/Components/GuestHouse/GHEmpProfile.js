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
  const [show, setShow] = useState();
  const [expenditure, setExpenditure] = useState();

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUser").then((response) => {
      setUserName(response.data.username);
    });
  }, []);

  let navigate = useNavigate();
  return (
    <Box>
      <Header justify="center" border={{ side: "bottom" }}>
        <Heading alignSelf="center">Guesthouse staff profile</Heading>
        <Box flex="grow"></Box>
        <Button
          onClick={() => {
            navigate("/guesthouse/employee/bill");
          }}
          label="Manage bills"
        />
        <Button
          onClick={() => {
            navigate("/");
          }}
          label="Home"
        />
      </Header>

      <Box direction="row" pad="medium" justify="around">
        <Form
          onSubmit={({ value }) => {
            value.ExpDate = stringToDate(value.ExpDate);
            console.log("Value is ", value);
            Swal.fire({
              title: "Are you sure you want to record the Expenditure?",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, proceed!",
            }).then((result) => {
              if (result.isConfirmed) {
                axios
                  .post(
                    "http://localhost:3001/api/guesthouse/employee/addExpenditure",
                    value
                  )
                  .then((response) => {
                    if (response.data.success === true) {
                      Swal.fire("Recorded Expenditure!", "", "success");
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
        >
          <FormField name="ExpDesc" label="Description of Expenditure" required>
            <TextInput name="ExpDesc" placeholder="Enter description" />
          </FormField>

          <FormField name="ExpDate" label="Date of Expenditure" required>
            <DateInput format="mm/dd/yyyy" name="ExpDate" />
          </FormField>

          <FormField name="TotalExp" label="Total cost incurred" required>
            <TextInput name="TotalExp" placeholder="Enter cost incurred" />
          </FormField>

          <Box direction="row" gap="medium">
            <Button type="submit" primary label="Add Expenditure" />
            <Button type="reset" label="Reset" />
          </Box>
        </Form>
        <Box>
          <Form
            onSubmit={({ value }) => {
              value.startDate = stringToDate(value.startDate);
              value.endDate = stringToDate(value.endDate);

              axios
                .post(
                  "http://localhost:3001/api/guesthouse/employee/getExpenditure",
                  value
                )
                .then((response) => {
                  setExpenditure(response.data.expenditure);
                  setShow(true);
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
              <Button type="submit" primary label="View Expenditures" />
              <Button type="reset" label="Reset" />
            </Box>
          </Form>
        </Box>

        <Box>
          <Form
            onSubmit={({ value }) => {
              axios
                .post(
                  "http://localhost:3001/api/guesthouse/employee/deleteExpenditure",
                  value
                )
                .then((response) => {
                  if (response.data.success == true) {
                    Swal.fire(
                      "Expenditure successfully removed",
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
          >
            <FormField
              name="ExpID"
              htmlFor="text-input-id"
              label="Expenditure ID"
            >
              <TextInput name="ExpID" />
            </FormField>
            <Box direction="row" gap="medium">
              <Button type="submit" primary label="Clear Expenditure" />
              <Button type="reset" label="Reset" />
            </Box>
          </Form>
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
                  property: "ExpID",
                  header: <Heading level="4">Expenditure ID</Heading>,
                  primary: false,
                },
                {
                  property: "ExpDesc",
                  header: <Heading level="4">Expenditure Description</Heading>,
                  primary: false,
                },
                {
                  property: "ExpDate",
                  header: <Heading level="4">Incurred date</Heading>,
                  primary: false,
                },
                {
                  property: "TotalExp",
                  header: <Heading level="4">Total Expenditure</Heading>,
                  primary: false,
                },
              ]}
              data={expenditure}
              size="small"
              fill="horizontal"
            />
          </Box>
        </Layer>
      )}
    </Box>
  );
}

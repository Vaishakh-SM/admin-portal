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
  Calendar,
  DataTable,
  Layer,
} from "grommet";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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

export default function GHEmpDuty() {
  const [regularCook, setRegularCook] = useState([]);
  const [contractualCook, setContractualCook] = useState([]);
  const [cleaner, setCleaner] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [show, setShow] = useState();
  const [cooks, setCooks] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/guesthouse/supervisor/getCooks")
      .then((response) => {
        setRegularCook(response.data.regular);
        setContractualCook(response.data.contractual);
        setCleaner(response.data.cleaner);
        let allCooks = [];
        for (let i of response.data.regular) {
          allCooks.push(i);
        }

        for (let i of response.data.contractual) {
          allCooks.push(i);
        }
        setCooks(allCooks);
      });
  }, []);

  return (
    <Box>
      <Header justify="center" border={{ side: "bottom" }}>
        <Box direction="column">
          <Heading alignSelf="center">Staff scheduling</Heading>
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

      <Box direction="row" pad="medium" justify="around">
        <Form
          onSubmit={({ value }) => {
            value.startDate = stringToDate(value.startDate);

            Swal.fire({
              title: "Proceed to Schedule?",
              text: "This will overwrite any existing schedule for 7 days from start date!",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, proceed!",
            }).then((result) => {
              if (result.isConfirmed) {
                axios
                  .post(
                    "http://localhost:3001/api/guesthouse/supervisor/setSchedule",
                    value
                  )
                  .then((response) => {
                    if (response.data.success === true) {
                      Swal.fire(
                        "Scheduling done!",
                        "Scheduled for 7 days starting from " + value.startDate,
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
        >
          <FormField name="regular" label="Regular cooks" required>
            <Select
              options={regularCook}
              labelKey="Name"
              valueKey="StaffID"
              name="regular"
            />
          </FormField>

          <FormField name="contractual1" label="Contractual cook 1" required>
            <Select
              options={contractualCook}
              labelKey="Name"
              valueKey="StaffID"
              name="contractual1"
            />
          </FormField>

          <FormField
            name="contractual2"
            label="Contractual cook 2"
            validate={(fieldData, formData) => {
              if (fieldData.StaffID === formData.contractual1.StaffID) {
                return "You must choose different cooks as Contractual 1 and contractual 2";
              }
            }}
            required
          >
            <Select
              options={contractualCook}
              labelKey="Name"
              valueKey="StaffID"
              name="contractual2"
            />
          </FormField>

          <FormField name="cleaner1" label="Cleaner 1" required>
            <Select
              options={cleaner}
              labelKey="Name"
              valueKey="StaffID"
              name="cleaner1"
            />
          </FormField>

          <FormField
            name="cleaner2"
            label="Cleaner 2"
            validate={(fieldData, formData) => {
              if (fieldData.StaffID === formData.cleaner1.StaffID) {
                return "You must choose different people as Helper 1 and Helper 2";
              }
            }}
            required
          >
            <Select
              options={cleaner}
              labelKey="Name"
              valueKey="StaffID"
              name="cleaner2"
            />
          </FormField>
          <FormField name="startDate" label="Date to start scheduling from">
            <DateInput format="dd/mm/yyyy" name="startDate" />
          </FormField>
          <Box direction="row" gap="medium">
            <Button type="submit" primary label="Auto Schedule" />
            <Button type="reset" label="Reset" />
          </Box>
        </Form>

        <Box pad="medium">
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
              <Button type="submit" primary label="View Schedule" />
              <Button type="reset" label="Reset" />
            </Box>
          </Form>
        </Box>

        <Box>
          <Form
            onSubmit={({ value }) => {
              value.startDate = stringToDate(value.startDate);
              console.log("Value is ", value);
              Swal.fire({
                title: "Proceed to Schedule?",
                text:
                  "This will overwrite any existing schedule on " +
                  value.startDate,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, proceed!",
              }).then((result) => {
                if (result.isConfirmed) {
                  axios
                    .post(
                      "http://localhost:3001/api/guesthouse/supervisor/setScheduleOnDate",
                      value
                    )
                    .then((response) => {
                      if (response.data.success === true) {
                        Swal.fire(
                          "Scheduling done!",
                          "Scheduled for the date: " + value.startDate,
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
          >
            <FormField name="cook1" label="Cook 1" required>
              <Select
                options={cooks}
                labelKey="Name"
                valueKey="StaffID"
                name="cook1"
              />
            </FormField>

            <FormField
              name="cook2"
              label="Cook 2"
              validate={(fieldData, formData) => {
                if (fieldData.StaffID === formData.cook1.StaffID) {
                  return "You must choose different cooks as Cook 1 and Cook 2";
                }
              }}
              required
            >
              <Select
                options={cooks}
                labelKey="Name"
                valueKey="StaffID"
                name="cook2"
              />
            </FormField>

            <FormField name="cleaner" label="Cleaner" required>
              <Select
                options={cleaner}
                labelKey="Name"
                valueKey="StaffID"
                name="cleaner"
              />
            </FormField>

            <FormField name="shift" label="Shift" required>
              <Select options={["Morning", "Night", "Both"]} name="shift" />
            </FormField>

            <FormField name="startDate" label="Date to manually schedule">
              <DateInput format="dd/mm/yyyy" name="startDate" />
            </FormField>

            <Box direction="row" gap="medium">
              <Button type="submit" primary label="Manually Schedule" />
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
        </Layer>
      )}
    </Box>
  );
}

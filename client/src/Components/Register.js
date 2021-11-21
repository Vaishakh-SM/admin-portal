import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  ResponsiveContext,
  Select,
  TextInput,
} from "grommet";
import { Home } from "grommet-icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const axios = require("axios");

const Head = () => {
  let navigate = useNavigate();
  return (
    <Header alignContent="center" border={{ side: "bottom" }}>
      <Button
        icon={<Home />}
        hoverIndicator
        onClick={() => {
          navigate("/");
        }}
      />
    </Header>
  );
};

export default function Register() {
  let navigate = useNavigate();
  const [value, setValue] = useState({});
  const size = React.useContext(ResponsiveContext);

  return (
    <Box fill="true">
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
          <Heading size="small">Register</Heading>
          <Form
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            onReset={() => setValue({})}
            onSubmit={({ value }) => {
              axios
                .post("http://localhost:3001/api/register", value)
                .then((response) => {
                  if (response.data.success) {
                    Swal.fire(response.data.message);
                    navigate("/");
                  } else {
                    Swal.fire(response.data.message);
                  }
                });
            }}
          >
            <FormField
              name="emp"
              htmlFor="text-input-id"
              label="Employment"
              required
            >
              <Select
                options={[
                  "Guest House Services",
                  "Market Shop Services",
                  "Landscaping Services",
                  "Administration",
                ]}
                name="emp"
              />
            </FormField>
            <FormField
              name="username"
              htmlFor="text-input-id"
              label="Username"
              required
            >
              <TextInput id="username" name="username" />
            </FormField>

            <FormField
              name="password"
              htmlFor="text-input-id"
              label="Password"
              required
            >
              <TextInput type="password" id="password" name="password" />
            </FormField>

            <FormField
              name="confirm_password"
              htmlFor="text-input-id"
              label="Confirm Password"
              required
              validate={(fieldData, formData) => {
                if (fieldData !== formData.password) {
                  return "Confirm password does not match with above password";
                }
              }}
            >
              <TextInput
                type="password"
                id="confirm_password"
                name="confirm_password"
              />
            </FormField>

            <Box
              direction={size === "small" ? "column" : "row"}
              gap="medium"
              margin={{ top: "large" }}
              fill={"horizontal"}
            >
              <Button type="submit" size="xlarge" primary label="Register" />

              <Button type="reset" size="xlarge" label="Reset" />
            </Box>
          </Form>
        </Box>
      </Box>
    </Box>
  );
}

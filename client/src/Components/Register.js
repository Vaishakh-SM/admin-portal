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

const axios = require("axios");

const Head = () => {
  let navigate = useNavigate();
  return (
    <Header alignContent="center" border={{ side: "bottom" }}>
      <Heading alignSelf="center" size="small">
        Register
      </Heading>
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
  const [value, setValue] = useState({});
  const size = React.useContext(ResponsiveContext);
  const [emp, setEmp] = React.useState("medium");

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
          
          <Form
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            onReset={() => setValue({})}
            onSubmit={({ value }) => {
              axios.post("http://localhost:3001/api/register", value);
            }}
          >
            <FormField
              name="emp"
              htmlFor="text-input-id"
              label="Employment"
              required
            >
              <Select
                options={["Guest House Services", "Market Shop Services", "Landscaping Services"]}
                value={emp}
                onChange={({ option }) => setEmp(option)}
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
              name="confirm-password"
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
                id="confirm-password"
                name="confirm-password"
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

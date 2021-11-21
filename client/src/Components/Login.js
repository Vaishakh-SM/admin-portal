import {
  Anchor,
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  ResponsiveContext,
  TextInput,
} from "grommet";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const axios = require("axios");
axios.defaults.withCredentials = true;

const Head = () => {
  return (
    <Header justify="center" border={{ side: "bottom" }}>
      <Heading alignSelf="center">CS355 Mini Project</Heading>
    </Header>
  );
};

export default function Login() {
  const [value, setValue] = useState({});
  const size = React.useContext(ResponsiveContext);
  const navigate = useNavigate();

  return (
    <Box fill="true">
      <Head />
      <Box
        fill="true"
        direction={size === "small" ? "column" : "row"}
        justify="around"
        align={size === "small" ? "stretch" : "center"}
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
          <Heading size="small">Login</Heading>

          <Form
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            onReset={() => setValue({})}
            onSubmit={({ value }) => {
              axios
                .post("http://localhost:3001/api/login", value)
                .then((response) => {
                  if (response.data.success === true) {
                    switch (response.data.employment) {
                      case "Guest House Services":
                        navigate("/guesthouse/profile");
                        break;
                      case "Market Shop Services":
                        navigate("/marketshop/profile");
                        break;
                      case "Landscaping Services":
                        navigate("/landscaping/profile");
                        break;
                      default:
                        navigate("/profile");
                    }
                  } else {
                    Swal.fire("Wrong credentials");
                  }
                });
            }}
          >
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

            <Box
              direction={size === "small" ? "column" : "row"}
              gap="medium"
              margin={{ top: "large" }}
              fill={"horizontal"}
            >
              <Button type="submit" size="xlarge" primary label="Login" />

              <Button type="reset" size="xlarge" label="Reset" />
              <Box alignContent="center">
                {"No credentials yet? "}
                <Anchor href="/register" alignSelf="center">
                  Register
                </Anchor>
              </Box>
            </Box>
          </Form>
        </Box>
      </Box>
    </Box>
  );
}

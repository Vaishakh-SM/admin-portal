import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  ResponsiveContext,
  TextInput,
} from "grommet";
import { CaretPrevious } from "grommet-icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const axios = require("axios");
axios.defaults.withCredentials = true;

const Head = () => {
  let navigate = useNavigate();
  return (
    <Header alignContent="center" border={{ side: "bottom" }}>
      <Button
        icon={<CaretPrevious />}
        hoverIndicator
        onClick={() => {
          navigate("/profile");
        }}
      />
    </Header>
  );
};

export default function AddStore() {
  const [value, setValue] = useState({});
  let navigate = useNavigate();
  const size = React.useContext(ResponsiveContext);

  return (
    <div>
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
          {" "}
          <Heading level="3" alignSelf="center">
            Add new store
          </Heading>
          <Form
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            onReset={() => setValue({})}
            onSubmit={({ value }) => {
              axios
                .post("http://localhost:3001/api/addStore", value)
                .then((response) => {
                  if (response.data.success) {
                    Swal.fire(response.data.message);
                    navigate("/profile");
                  } else {
                    Swal.fire(response.data.message);
                  }
                });
            }}
          >
            <FormField name="storename" label="Store Name">
              <TextInput type="text" name="storename" required />
            </FormField>
            <FormField name="location" label="Location within campus">
              <TextInput type="text" name="location" required />
            </FormField>
            <FormField
              name="category"
              label="Category (eg. Restaurant, Stationery, Cycle Repair,etc)"
            >
              <TextInput type="text" name="category" required />
            </FormField>
            <FormField
              name="availability"
              label="Availability (Format: Mon-Fri 8AM-12PM)"
            >
              <TextInput type="text" name="availability" required />
            </FormField>
            <br />
            <Button type="submit" size="medium" primary label="Add" />
            &nbsp;&nbsp;
            <Button type="reset" size="medium" label="Reset" />
          </Form>
        </Box>
      </Box>
    </div>
  );
}

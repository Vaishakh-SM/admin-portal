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
import { CaretPrevious } from "grommet-icons";
import React, { useEffect, useState } from "react";
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
          navigate("/market/profile");
        }}
      />
    </Header>
  );
};

export default function LicenseExt() {
  const [username, setUserName] = useState("");
  const [store, setStore] = useState([]);
  const [value, setValue] = useState({});
  let navigate = useNavigate();
  const size = React.useContext(ResponsiveContext);

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUser").then((response) => {
      setUserName(response.data.username);
    });
    axios.get("http://localhost:3001/api/extractStore").then((response) => {
      let optionArray = [];
      const rows = response.data.info;
      const n = rows.length;
      for (let i = 0; i < n; i++) {
        let id = rows[i].StoreID;
        let name = rows[i].StoreName;
        optionArray.push(id + "-" + name);
      }
      setStore(optionArray);
    });
  }, []);

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
            Profile Details: {username}
          </Heading>
          <Form
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            onReset={() => setValue({})}
            onSubmit={({ value }) => {
              axios
                .post("http://localhost:3001/api/addShopkeeperDetails", value)
                .then((response) => {
                  if (response.data.success) {
                    Swal.fire(response.data.message);
                    navigate("/market/profile");
                  } else {
                    Swal.fire(response.data.message);
                  }
                });
            }}
          >
            <FormField name="name" htmlFor="name" label="Full Name">
              <TextInput type="text" id="name" name="name" required />
            </FormField>
            <FormField name="store" label="Store">
              <Select options={store} name="store" required />
            </FormField>
            <FormField name="phonenumber" label="Phone Number">
              <TextInput type="tel" name="phonenumber" required />
            </FormField>
            <FormField name="securitypass" label="Security Pass ID">
              <TextInput type="text" name="securitypass" required />
            </FormField>
            <FormField name="expiry" label="Security Pass Expiry">
              <TextInput type="date" name="expiry" required />
            </FormField>
            <br />
            <Button type="submit" size="medium" primary label="Update" />
            &nbsp;&nbsp;
            <Button type="reset" size="medium" label="Reset" />
          </Form>
        </Box>
      </Box>
    </div>
  );
}

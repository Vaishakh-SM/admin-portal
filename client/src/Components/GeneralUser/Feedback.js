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
          navigate("/general/profile");
        }}
      />
    </Header>
  );
};

export default function Feedback() {
  const [store, setStore] = useState([]);
  const [value, setValue] = useState({});
  let navigate = useNavigate();
  const size = React.useContext(ResponsiveContext);

  useEffect(() => {
    axios.get("http://localhost:3001/api/extractStores").then((response) => {
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
            Feedback Form
          </Heading>
          <Form
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            onReset={() => setValue({})}
            onSubmit={({ value }) => {
              axios
                .post("http://localhost:3001/api/addFeedback", value)
                .then((response) => {
                  if (response.data.success) {
                    Swal.fire(response.data.message);
                    navigate("/general/profile");
                  } else {
                    Swal.fire(response.data.message);
                  }
                });
            }}
          >
            <FormField name="store" label="Store">
              <Select options={store} name="store" required />
            </FormField>
            <FormField name="service" label="Service (1-Terrible, 5-Excellent)">
              <Select
                name="service"
                options={[1, 2, 3, 4, 5]}
                defaultValue="3"
                required
              />
            </FormField>
            <FormField
              name="availability"
              label="Availability (1-Very inconsistent, 5-Always available)"
            >
              <Select
                name="availability"
                options={[1, 2, 3, 4, 5]}
                defaultValue="3"
                required
              />
            </FormField>
            <FormField name="quality" label="Quality (1-Terrible, 5-Excellent)">
              <Select
                name="quality"
                options={[1, 2, 3, 4, 5]}
                defaultValue="3"
                required
              />
            </FormField>
            <FormField
              name="price"
              label="Price levels (1-Unsatisfactory, 5-Reasonable)"
            >
              <Select
                name="price"
                options={[1, 2, 3, 4, 5]}
                defaultValue="3"
                required
              />
            </FormField>
            <FormField
              name="conduct"
              label="Conduct/Behavior (1-Terrible, 5-Excellent)"
            >
              <Select
                name="conduct"
                options={[1, 2, 3, 4, 5]}
                defaultValue="3"
                required
              />
            </FormField>
            <FormField name="message" label="Message">
              <TextInput placeholder="Type here" name="message" />
            </FormField>
            <br />
            <Button type="submit" size="medium" primary label="Submit" />
            &nbsp;&nbsp;
            <Button type="reset" size="medium" label="Reset" />
          </Form>
        </Box>
      </Box>
    </div>
  );
}

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
            navigate("/landscaping/supervisor_profile");
          }}
        />
      </Header>
    );
  };
  
  export default function SSUpdate() {
    const [username, setUserName] = useState("");
    const [value, setValue] = useState({});
    let navigate = useNavigate();
    const size = React.useContext(ResponsiveContext);
  
    useEffect(() => {
      axios.get("http://localhost:3001/api/getUser").then((response) => {
        setUserName(response.data.username);
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
                  .post("http://localhost:3001/api/updateSupervisor", value)
                  .then((response) => {
                    if (response.data.success) {
                      Swal.fire(response.data.message);
                      navigate("/landscaping/supervisor_profile");
                    } else {
                      Swal.fire(response.data.message);
                    }
                  });
              }}
            >
              <FormField name="employeeID" label="Employee ID">
                <TextInput type="text" name="employeeID" required/>
              </FormField>
              <FormField name="name" label="Full Name">
                <TextInput type="text" name="name" required/>
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
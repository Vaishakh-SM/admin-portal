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
            navigate("/landscaping/super_vendor_pay");
          }}
        />
      </Header>
    );
  };
  
  export default function SSPayClear() {
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
              Details of Request to be Cleared:
            </Heading>
            <Form
              value={value}
              onChange={(nextValue) => setValue(nextValue)}
              onReset={() => setValue({})}
              onSubmit={({ value }) => {
                axios
                  .post("http://localhost:3001/api/clearPay", value)
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
              <FormField name="vendorID" label="Vendor ID">
                <TextInput type="text" name="vendorID" required/>
              </FormField>
              <FormField name="equipmentID" label="Equipment ID">
                <TextInput type="text" name="equipmentID" required/>
              </FormField>
              <FormField name="dues" label="Due to be added">
                <TextInput type="int" name="dues" required/>
              </FormField>
              <br />
              <Button type="submit" size="medium" primary label="Clear Request" />
              &nbsp;&nbsp;
              <Button type="reset" size="medium" label="Reset" />
            </Form>
          </Box>
        </Box>
      </div>
    );
  }
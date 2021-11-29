import {
    Box,
    Button,
    DateInput,
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
            navigate("/landscaping/vendor_profile");
          }}
        />
      </Header>
    );
  };

  export default function VNPays() {
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
              Payment Request by: {username}
            </Heading>
            <Heading level="3">
                <u>Enter Details</u>
            </Heading>
       
            <Form
              value={value}
              onChange={(nextValue) => setValue(nextValue)}
              onReset={() => setValue({})}
              onSubmit={({value}) => { value.date = value.date.slice(0,10);
                axios
                  .post("http://localhost:3001/api/addDues", value)
                  .then((response) => {
                    if (response.data.success) {
                      Swal.fire(response.data.message);
                      navigate("/landscaping/vendor_profile");
                    } else {
                      Swal.fire(response.data.message);
                    }
                  });
              }}
            >
              <FormField name="vendorID" label="VendorID">
                <TextInput type="text" name="vendorID" required/>
              </FormField>
              <br />
              <br />
              <FormField name="date" label="Date">
                <DateInput type="date" name="date" required/>
              </FormField>
              <br />
              <br />
              <FormField name="equipID" label="Equipment ID">
                <TextInput type="text" name="equipID" required/>
              </FormField>
              <br />
              <br />
              <FormField name="reason" label="Reason for Payment">
                <TextInput type="text" name="reason" required/>
              </FormField>
              <br />
              <br />
              <FormField name="dues" label="Payment Needed">
                <TextInput type="int" name="dues" required/>
              </FormField>
              <br />
              <Button type="submit" size="medium" primary label="Note" />
              &nbsp;&nbsp;
              <Button type="reset" size="medium" label="Reset" />
            </Form>
          </Box>
        </Box>
      </div>
    );
  }
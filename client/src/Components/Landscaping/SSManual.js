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
            navigate("/landscaping/scheduler");
          }}
        />
      </Header>
    );
  };
  
  export default function SSManual() {
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
                  .post("http://localhost:3001/api/manualSchedule", value)
                  .then((response) => {
                    if (response.data.success) {
                      Swal.fire(response.data.message);
                      navigate("/landscaping/scheduler");
                    } else {
                      Swal.fire(response.data.message);
                    }
                  });
              }}
            >
              <FormField name="day" label="Which Day">
                <TextInput type="text" name="day" required/>
              </FormField>
              <FormField name="garden" label="Enter Gardens">
                <TextInput type="text" name="garden" required/>
              </FormField>
              <FormField name="number" label="Day(Number)">
                <TextInput type="int" name="number" required/>
              </FormField>
              <br />
              <Button type="submit" size="medium" primary label="Schedule" />
              &nbsp;&nbsp;
              <Button type="reset" size="medium" label="Reset" />
            </Form>
          </Box>
        </Box>
      </div>
    );
  }
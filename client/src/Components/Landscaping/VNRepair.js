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
    DataTable,
    Text,
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

  export default function VNRepair() {
    const [username, setUserName] = useState("");
    const [value, setValue] = useState({});
    const [equips, setEquips] = useState([]);
    let navigate = useNavigate();
    const size = React.useContext(ResponsiveContext);
  
    useEffect(() => {
      axios.get("http://localhost:3001/api/getUser").then((response) => {
        setUserName(response.data.username);
      });
      axios.get("http://localhost:3001/api/getEquips").then((response) => {
        setEquips(response.data.info);
      });
      
    }, []);
    console.log(equips);
  
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
              Equipment Repair Notes by: {username}
            </Heading>
            <Heading level="3">
                <u>Your Current Repairs</u>
            </Heading>
            <DataTable onSort={((property, direction) => {})}
                columns={[
                    {
                        property: 'equipID',
                        header: <Text>Equipment ID</Text>,
                        primary: true,
                    },
                    {
                        property: 'type',
                        header: <Text>Type</Text>,
                        primary: true,
                    },
                    {
                        property: 'equipcondition',
                        header: <Text>Condition</Text>,
                        primary: true,
                    },
                    {
                        property: 'gardener',
                        header: <Text>Assigned Gardener</Text>,
                        primary: true,
                    },
                    {
                        property: 'vendor',
                        header: <Text>Assigned Vendor</Text>,
                        primary: true,
                    },
                    {
                        property: 'repairStatus',
                        header: <Text>Repair Status</Text>,
                        primary: true,
                    },
  
                    ]}
  
                    data={equips}  
  
                        />
            
            <Form
              value={value}
              onChange={(nextValue) => setValue(nextValue)}
              onReset={() => setValue({})}
              onSubmit={({value}) => {
                axios
                  .post("http://localhost:3001/api/updateRepair", value)
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
              <FormField name="equipID" label="Equipment ID">
                <TextInput type="text" name="equipID" required/>
              </FormField>
              <br />
              <br />
              <FormField name="reapirStatus" label="Updated Repair Status">
                <DateInput type="etxt" name="repairStatus" required/>
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
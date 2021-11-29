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
            navigate("/landscaping/supervisor_profile");
          }}
        />
      </Header>
    );
  };

  export default function SSPayView() {
    const [username, setUserName] = useState("");
    const [bills, setBills] = useState({});
    let navigate = useNavigate();
    const size = React.useContext(ResponsiveContext);
  
    useEffect(() => {
      axios.get("http://localhost:3001/api/getUser").then((response) => {
        setUserName(response.data.username);
      });
      axios.get("http://localhost:3001/api/getBills").then((response) =>{
          console.log(response.data.info);
        setBills(response.data.info);
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
              Vendor Pay Requests
            </Heading>
            <Heading level="3">
                <u>Requests</u>
            </Heading>
            <DataTable onSort={((property, direction) => {})}
                columns={[
                    {
                        property: 'billDate',
                        header: <Text>Bill Date</Text>,
                        primary: true,
                    },
                    {
                        property: 'username',
                        header: <Text>Vendor</Text>,
                        primary: true,
                    },
                    {
                        property: 'vendorID',
                        header: <Text>VendorID</Text>,
                        primary: true,
                    },
                    {
                        property: 'equipID',
                        header: <Text>Equipment ID</Text>,
                        primary: true,
                    },
                    {
                        property: 'reason',
                        header: <Text>Reason</Text>,
                        primary: true,
                    },
                    {
                        property: 'dues',
                        header: <Text>Additional Dues</Text>,
                        primary: true,
                    },
  
                    ]}
  
                    data={bills}  
  
                        />
                    <br />
                    <br />
                    <Button 
                        label="Clear Requests"
                        onClick={() => {
                        navigate("/landscaping/vendor_clear");
                    }} />
          </Box>
        </Box>
      </div>
    );
  }
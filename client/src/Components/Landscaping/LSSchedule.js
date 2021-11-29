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
            navigate("/landscaping/profile");
          }}
        />
      </Header>
    );
  };

  export default function LSSchedule() {
    const [username, setUserName] = useState("");
    const [schedule, setSchedule] = useState({});
    let navigate = useNavigate();
    const size = React.useContext(ResponsiveContext);
  
    useEffect(() => {
      axios.get("http://localhost:3001/api/getUser").then((response) => {
        setUserName(response.data.username);
      });
      axios.get("http://localhost:3001/api/getSchedule").then((response) =>{
        console.log(response.data.info);
        setSchedule(response.data.info);
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
              Scheduler
            </Heading>
            <Heading level="3">
                <u>Current Schedule</u>
            </Heading>
            <DataTable onSort={((property, direction) => {})}
                columns={[
                    {
                        property: 'day',
                        header: <Text>Day</Text>,
                        primary: true,
                    },
                    {
                        property: 'number',
                        header: <Text>Day(Number)</Text>,
                        primary: true,
                    },
                    {
                        property: 'garden',
                        header: <Text>Gardens</Text>,
                        primary: true,
                    },
  
                    ]}
  
                    data={schedule}  
  
                        />
                    <br />
                    <br />

          </Box>
        </Box>
      </div>
    );
  }
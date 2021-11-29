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

  export default function LSRead() {
    const [username, setUserName] = useState("");
    const [value, setValue] = useState({});
    const [notes, setNotes] = useState([]);
    let navigate = useNavigate();
    const size = React.useContext(ResponsiveContext);
  
    useEffect(() => {
      axios.get("http://localhost:3001/api/getUser").then((response) => {
        setUserName(response.data.username);
      });
      axios.get("http://localhost:3001/api/getNotes").then((response) =>{
          console.log(response.data.info);
        setNotes(response.data.info);
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
              Gardeners Notes
            </Heading>
            <Heading level="3">
                <u>Gardens</u>
            </Heading>
            <DataTable onSort={((property, direction) => {})}
                columns={[
                    {
                        property: 'noteDate',
                        header: <Text>Date</Text>,
                        primary: true,
                    },
                    {
                        property: 'gardener',
                        header: <Text>Gardener</Text>,
                        primary: true,
                    },
                    {
                        property: 'garden',
                        header: <Text>Garden</Text>,
                        primary: true,
                    },
                    {
                        property: 'notes',
                        header: <Text>Notes</Text>,
                        primary: true,
                    },
  
                    ]}
  
                    data={notes}  
  
                        />
          </Box>
        </Box>
      </div>
    );
  }
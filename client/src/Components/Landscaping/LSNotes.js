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
            navigate("/landscaping/profile");
          }}
        />
      </Header>
    );
  };

  export default function LSNotes() {
    const [username, setUserName] = useState("");
    const [value, setValue] = useState({});
    const [gardens, setGardens] = useState([])
    let navigate = useNavigate();
    const size = React.useContext(ResponsiveContext);
  
    useEffect(() => {
      axios.get("http://localhost:3001/api/getUser").then((response) => {
        setUserName(response.data.username);
      });
      axios.get("http://localhost:3001/api/getGardens").then((response) =>{
        setGardens(response.data.info);
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
              Garden Notes by: {username}
            </Heading>
            <Heading level="3">
                <u>Gardens</u>
            </Heading>
            <table border="1">
                <thead>
                    <tr align="center">
                        <th align="center" width="40%">
                            Name
                        </th>
                        <th align="center" width="20%">
                            Priority
                        </th>
                        <th align="center" width="20%">
                            People Hours
                        </th>
                        <th align="center" width="20%">
                            Cropped
                        </th>
                    </tr>
                </thead>
            <tbody>
            {gardens.map((garden) => {
              
              return (
                <tr align="center">
                  <td align="center" width="40%">
                    {garden.name}
                  </td>
                  <td align="center" width="20%">
                    {garden.priority}
                  </td>
                  <td align="center" width="20%">
                    {garden.peopleHours}
                  </td>
                  <td align="center" width="20%">
                    {garden.cropped}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
            
            <Form
              value={value}
              onChange={(nextValue) => setValue(nextValue)}
              onReset={() => setValue({})}
              onSubmit={({value}) => { value.date = value.date.slice(0,10);
                axios
                  .post("http://localhost:3001/api/gardenNote", value)
                  .then((response) => {
                    if (response.data.success) {
                      Swal.fire(response.data.message);
                      navigate("/landscaping/profile");
                    } else {
                      Swal.fire(response.data.message);
                    }
                  });
              }}
            >
              <FormField name="garden" label="Garden">
                <TextInput type="text" name="garden" required/>
              </FormField>
              <br />
              <br />
              <FormField name="date" label="Date">
                <DateInput type="date" name="date" required/>
              </FormField>
              <br />
              <br />
              <FormField name="notes" label="Enter Notes">
                <TextInput type="text" name="notes" required/>
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
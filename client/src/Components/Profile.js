import { useEffect, useState } from "react";
import { Heading } from "grommet";
import { useNavigate } from "react-router-dom";
const axios = require("axios");
axios.defaults.withCredentials = true;

export default function Profile() {
  const [username, setUserName] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUserID").then((response) => {
      if (response.data.RoleID == "5") {
        navigate("/guesthouse/user/profile");
      } else if (
        response.data.RoleID == "201" ||
        response.data.RoleID == "202" ||
        response.data.RoleID == "203"
      ) {
        navigate("/guesthouse/cook/profile");
      } else if (response.data.RoleID == "204") {
        navigate("/guesthouse/employee/duty");
      } else if (response.data.RoleID == "205") {
        navigate("/guesthouse/employee/profile");
      }
    });
  }, []);

  return <Heading>Welcome {username}</Heading>;
}

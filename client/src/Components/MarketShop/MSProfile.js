import { useEffect, useState } from "react";
import { Heading } from "grommet";
import { Navigate } from "react-router";

const axios = require("axios");
axios.defaults.withCredentials = true;

export default function Profile() {
  const [username, setUserName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUser").then((response) => {
      setUserName(response.data.username);
    });
  }, []);

  return <Heading>Welcome {username}</Heading>;
}

import { useEffect, useState } from "react";
import { Heading } from "grommet";

const axios = require("axios");
axios.defaults.withCredentials = true;

export default function GUProfile() {
  const [username, setUserName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUser").then((response) => {
      setUserName(response.data.username);
    });
  }, []);

  return <Heading>Welcome {username}</Heading>;
}

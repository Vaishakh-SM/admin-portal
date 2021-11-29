import { Button, Header, Heading } from "grommet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const axios = require("axios");
axios.defaults.withCredentials = true;

export default function GUProfile() {
  const [username, setUserName] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUser").then((response) => {
      setUserName(response.data.username);
    });
  }, []);

  return (
    <div>
      <Header pad="none" justify="center" border={{ side: "bottom" }}>
        <Heading alignSelf="center" level="2">
          Welcome {username}
        </Heading>
      </Header>
      <div style={{ margin: "2%" }}>
        <Button
          label="Give store feedback"
          onClick={() => {
            navigate("/general/feedback");
          }}
        />
        <br />
        <br />
        <Button
          label="Sign Out"
          onClick={() => {
            axios.get("http://localhost:3001/api/logout");
            navigate("/");
          }}
        />
      </div>
    </div>
  );
}

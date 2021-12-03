import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  ResponsiveContext,
  Select,
  DateInput,
  Image,
  Text,
  DataTable,
} from "grommet";
import React, { useState, useEffect } from "react";
import { resolvePath } from "react-router";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

export default function GHCookOrders() {
  const [foodItems, setFoodItems] = useState([]);
  let navigate = useNavigate();
  useEffect(() => {
    setInterval(() => {
      axios
        .get("http://localhost:3001/api/guesthouse/cook/getOrders")
        .then((response) => {
          setFoodItems(response.data.foodItems);
        });
    }, 10000);
  }, []);

  return (
    <Box>
      <Header justify="center" border={{ side: "bottom" }}>
        <Heading alignSelf="center">Pending orders</Heading>
        <Box flex="grow"></Box>
        <Button
          onClick={() => {
            navigate("/guesthouse/cook/profile");
          }}
          label="Profile"
        />
      </Header>
      <Box direction="row" pad="medium">
        <Box flex={{ grow: 1 }}></Box>
        <Box flex={{ grow: 4 }}>
          <DataTable
            columns={[
              {
                property: "FoodID",
                header: <Heading level="4">Food ID</Heading>,
                primary: true,
              },
              {
                property: "FoodName",
                header: <Heading level="4">Food Name</Heading>,
                primary: true,
              },
              {
                property: "UID",
                header: <Heading level="4">User ID</Heading>,
                primary: false,
              },
            ]}
            data={foodItems}
            onClickRow={({ datum }) => {
              Swal.fire({
                title: "Deliver this order?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  axios
                    .post("http://localhost:3001/api/guesthouse/cook/deliver", {
                      FoodBookingID: datum.FoodBookingID,
                    })
                    .then((response) => {
                      if (response.data.success === true) {
                        Swal.fire("Done!");
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: response.data.message,
                          text: "Something went wrong!",
                        });
                      }
                    });
                }
              });
            }}
          />
        </Box>
        <Box flex={{ grow: 1 }}></Box>
      </Box>
    </Box>
  );
}

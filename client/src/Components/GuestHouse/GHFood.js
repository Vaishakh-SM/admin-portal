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
} from "grommet";
import React, { useState, useEffect } from "react";
import { resolvePath } from "react-router";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

function ArrayToList({ props }) {
  let listItems = props.map((item) => {
    return (
      <Box
        pad=" medium"
        direction="column"
        data={item.FoodID}
        border={{
          size: "medium",
          style: "ridge",
          side: "all",
        }}
        onClick={(e) => {
          const FoodID = item.FoodID;

          Swal.fire({
            title: "Proceed to order?",
            text: item.FoodName,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, proceed!",
          }).then((result) => {
            if (result.isConfirmed) {
              axios
                .post("http://localhost:3001/api/guesthouse/orderFood", {
                  FoodID: FoodID,
                })
                .then((response) => {
                  if (response.data.success === true) {
                    Swal.fire(
                      "Ordered!",
                      "One serving of " + item.FoodName,
                      "success"
                    );
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
      >
        <Box width="medium">
          <Image
            fit="cover"
            src={"http://localhost:3001/api/assets/uploads/" + item.ImageLink}
          ></Image>
        </Box>
        <Box direction="column" pad="small" flex="grow">
          <Heading level="3">{item.FoodName}</Heading>
          <Text alignSelf="center">Rs: {item.Rate}</Text>
        </Box>
      </Box>
    );
  });

  while (listItems.length % 3 != 0) {
    listItems.push(<Box width="medium"></Box>);
  }

  let displayItems = [];

  for (let i = 0; i < listItems.length; i = i + 3) {
    displayItems.push(
      <Box justify="around" direction="row" gap="medium" height="medium">
        {listItems.slice(i, i + 3)}
      </Box>
    );
  }

  return (
    <Box direction="column" gap="medium">
      {displayItems}
    </Box>
  );
}

export default function GHFood() {
  const [foodItems, setFoodItems] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/guesthouse/getFood")
      .then((response) => {
        setFoodItems(response.data.foodItems);
      });
  }, []);

  return (
    <Box>
      <Header justify="center" border={{ side: "bottom" }}>
        <Heading alignSelf="center">Food Booking</Heading>
        <Box flex="grow"></Box>
        <Button
          onClick={() => {
            navigate("/guesthouse/user/profile");
          }}
          label="Profile"
        />
      </Header>
      <Box pad="medium" margin="medium">
        <ArrayToList props={foodItems} />
      </Box>
    </Box>
  );
}

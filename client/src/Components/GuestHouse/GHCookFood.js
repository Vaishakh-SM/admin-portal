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
  FileInput,
  TextInput,
} from "grommet";
import React, { useState, useEffect } from "react";
import { resolvePath } from "react-router";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

export default function GHCookFood() {
  const [value, setValue] = useState({});
  const size = React.useContext(ResponsiveContext);
  let navigate = useNavigate();
  return (
    <Box>
      <Header justify="center" border={{ side: "bottom" }}>
        <Heading alignSelf="center">Cook station</Heading>
        <Box flex="grow"></Box>
        <Button
          onClick={() => {
            navigate("/guesthouse/cook/profile");
          }}
          label="Profile"
        />
      </Header>
      <Box direction="row" pad="medium">
        <Box flex={{ grow: 2 }}></Box>
        <Box flex={{ grow: 4 }}>
          <Form
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            onReset={() => setValue({})}
            onSubmit={({ value }) => {
              console.log("Val is ", value);
              const form = new FormData();
              form.append("file", value.FoodImage[0]);
              form.append("FoodName", value.FoodName);
              form.append("FoodDesc", value.FoodDesc);
              form.append("Rate", value.Rate);
              axios
                .post("http://localhost:3001/api/guesthouse/addFood", form)
                .then((response) => {
                  Swal.fire("Added Food item");
                });
            }}
          >
            <FormField
              name="FoodName"
              htmlFor="text-input-id"
              label="FoodName"
              required
            >
              <TextInput id="FoodName" name="FoodName" />
            </FormField>

            <FormField
              name="FoodDesc"
              htmlFor="text-input-id"
              label="FoodDesc"
              required
            >
              <TextInput id="FoodDesc" name="FoodDesc" />
            </FormField>

            <FormField
              name="Rate"
              htmlFor="text-input-id"
              label="Rate"
              required
            >
              <TextInput id="Rate" name="Rate" />
            </FormField>

            <FormField name="FoodImage" htmlFor="file">
              <FileInput
                name="FoodImage"
                onChange={(event) => {
                  const fileList = event.target.files;
                  for (let i = 0; i < fileList.length; i += 1) {
                    const file = fileList[i];
                  }
                }}
              />
            </FormField>

            <Box
              direction={size === "small" ? "column" : "row"}
              gap="medium"
              margin={{ top: "large" }}
              fill={"horizontal"}
            >
              <Button type="submit" size="xlarge" primary label="Add Food" />

              <Button type="reset" size="xlarge" label="Reset" />
            </Box>
          </Form>
        </Box>
        <Box flex={{ grow: 2 }}></Box>
      </Box>
    </Box>
  );
}

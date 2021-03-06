import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  ResponsiveContext,
  Select,
  TextInput,
} from "grommet";
import { CaretPrevious } from "grommet-icons";
import React, { useState } from "react";
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
          navigate("/market/store_profile");
        }}
      />
    </Header>
  );
};

export default function SubmitBill() {
  const [value, setValue] = useState({});
  let navigate = useNavigate();
  const size = React.useContext(ResponsiveContext);

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
            Submit Bill
          </Heading>
          <Form
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            onReset={() => setValue({})}
            onSubmit={({ value }) => {
              axios
                .post("http://localhost:3001/api/addBillRequest", value)
                .then((response) => {
                  if (response.data.success) {
                    Swal.fire(response.data.message);
                    navigate("/market/store_profile");
                  } else {
                    Swal.fire(response.data.message);
                  }
                });
            }}
          >
            <FormField
              name="month"
              htmlFor="month"
              label="Bill for Month (select any day)"
            >
              <TextInput type="date" id="month" name="month" required />
            </FormField>
            <FormField name="amount" label="Amount Paid">
              <TextInput type="number" name="amount" required />
            </FormField>
            <FormField name="type" label="Type">
              <Select
                options={["Rent", "Electricity", "Others"]}
                name="type"
                required
              />
            </FormField>
            <FormField name="transactionID" label="Transaction ID">
              <TextInput type="text" name="transactionID" required />
            </FormField>
            <FormField name="modeofpayment" label="Mode of Payment">
              <TextInput type="text" name="modeofpayment" required />
            </FormField>
            <br />
            <Button type="submit" size="medium" primary label="Request" />
            &nbsp;&nbsp;
            <Button type="reset" size="medium" label="Reset" />
          </Form>
        </Box>
      </Box>
    </div>
  );
}

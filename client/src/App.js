import { Grommet, grommet } from "grommet";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import AddStore from "./Components/admin/AddStore";
import Profile from "./Components/admin/Profile";
import GUProfile from "./Components/GeneralUser/GUProfile";
import GHProfile from "./Components/GuestHouse/GHProfile";
import LSProfile from "./Components/Landscaping/LSProfile";
import Login from "./Components/Login";
import LicenseExt from "./Components/MarketShop/LicenseExt";
import MProfile from "./Components/MarketShop/MProfile";
import MUpdate from "./Components/MarketShop/MUpdate";
import StoreProfile from "./Components/MarketShop/StoreProfile";
import SubmitBill from "./Components/MarketShop/SubmitBill";
import Register from "./Components/Register";
import Feedback from "./Components/GeneralUser/Feedback";

const axios = require("axios");
axios.defaults.withCredentials = true;

function App() {
  const [username, setUserName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/getUser").then((response) => {
      setUserName(response.data.username);
    });
  }, []);

  return (
    <Grommet full theme={grommet}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {username === "admin" ? (
          <Route path="/profile" element={<Profile />} />
        ) : null}
        {username === "admin" ? (
          <Route path="/admin/addstore" element={<AddStore />} />
        ) : null}
        <Route path="/guesthouse/profile" element={<GHProfile />} />
        <Route path="/market/profile" element={<MProfile />} />
        <Route path="/landscaping/profile" element={<LSProfile />} />
        <Route path="/market/personal_details" element={<MUpdate />} />
        <Route path="/market/submit_bills" element={<SubmitBill />} />
        <Route path="/market/store_profile" element={<StoreProfile />} />
        <Route path="/market/license_extension" element={<LicenseExt />} />
        <Route path="/general/profile" element={<GUProfile />} />
        <Route path="/general/feedback" element={<Feedback />} />
      </Routes>
    </Grommet>
  );
}

export default App;

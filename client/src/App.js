import { Grommet, grommet } from "grommet";
import { Route, Routes } from "react-router";
import GHProfile from "./Components/GuestHouse/GHProfile";
import LSProfile from "./Components/Landscaping/LSProfile";
import Login from "./Components/Login";
import MProfile from "./Components/MarketShop/MProfile";
import MUpdate from "./Components/MarketShop/MUpdate";
import Profile from "./Components/admin/Profile";
import Register from "./Components/Register";
import SubmitBill from "./Components/MarketShop/SubmitBill";
import StoreProfile from "./Components/MarketShop/StoreProfile";
import LicenseExt from "./Components/MarketShop/LicenseExt";
import GUProfile from "./Components/GeneralUser/GUProfile";

function App() {
  return (
    <Grommet full theme={grommet}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/guesthouse/profile" element={<GHProfile />} />
        <Route path="/market/profile" element={<MProfile />} />
        <Route path="/landscaping/profile" element={<LSProfile />} />
        <Route path="/market/personal_details" element={<MUpdate />} />
        <Route path="/market/submit_bills" element={<SubmitBill />} />
        <Route path="/market/store_profile" element={<StoreProfile />} />
        <Route path="/market/license_extension" element={<LicenseExt />} />
        <Route path="/general/profile" element={<GUProfile />} />
      </Routes>
    </Grommet>
  );
}

export default App;

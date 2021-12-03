import { Grommet, grommet } from "grommet";
import { Route, Routes } from "react-router";
import LSProfile from "./Components/Landscaping/LSProfile";
import Login from "./Components/Login";
import MSProfile from "./Components/MarketShop/MSProfile";
import MSUpdate from "./Components/MarketShop/MSUpdate";
import Profile from "./Components/Profile";
import Register from "./Components/Register";
import GHBooking from "./Components/GuestHouse/GHBooking";
import GHFood from "./Components/GuestHouse/GHFood";
import GHCookFood from "./Components/GuestHouse/GHCookFood";
import GHCookOrders from "./Components/GuestHouse/GHCookOrders";
import GHEmpBill from "./Components/GuestHouse/GHEmpBill";
import GHEmpDuty from "./Components/GuestHouse/GHEmpDuty";
import GHCookProfile from "./Components/GuestHouse/GHCookProfile";
import GHEmpProfile from "./Components/GuestHouse/GHEmpProfile";
import GHUserProfile from "./Components/GuestHouse/GHUserProfile";

function App() {
  return (
    <Grommet full theme={grommet}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/guesthouse/employee/profile" element={<GHEmpProfile />} />
        <Route path="/guesthouse/booking" element={<GHBooking />} />
        <Route path="/guesthouse/food" element={<GHFood />} />
        <Route path="/guesthouse/cook/food" element={<GHCookFood />} />
        <Route path="/guesthouse/cook/profile" element={<GHCookProfile />} />
        <Route path="/guesthouse/cook/orders" element={<GHCookOrders />} />
        <Route path="/guesthouse/employee/bill" element={<GHEmpBill />} />
        <Route path="/guesthouse/employee/duty" element={<GHEmpDuty />} />
        <Route path="/guesthouse/user/profile" element={<GHUserProfile />} />
        <Route path="/marketshop/profile" element={<MSProfile />} />
        <Route path="/landscaping/profile" element={<LSProfile />} />
        <Route path="/marketshop/personal_details" element={<MSUpdate />} />
      </Routes>
    </Grommet>
  );
}

export default App;

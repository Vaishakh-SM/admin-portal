import { Grommet, grommet } from "grommet";
import { Route, Routes } from "react-router";
import GHProfile from "./Components/GuestHouse/GHProfile";
import LSProfile from "./Components/Landscaping/LSProfile";
import Login from "./Components/Login";
import MProfile from "./Components/MarketShop/MProfile";
import MUpdate from "./Components/MarketShop/MUpdate";
import Profile from "./Components/Profile";
import Register from "./Components/Register";

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
      </Routes>
    </Grommet>
  );
}

export default App;

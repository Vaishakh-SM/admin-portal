import { Grommet, grommet } from "grommet";
import { Route, Routes } from "react-router";
import GHProfile from "./Components/GuestHouse/GHProfile";
import LSProfile from "./Components/Landscaping/LSProfile";
import Login from "./Components/Login";
import MSProfile from "./Components/MarketShop/MSProfile";
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
        <Route path="/marketshop/profile" element={<MSProfile />} />
        <Route path="/landscaping/profile" element={<LSProfile />} />
      </Routes>
    </Grommet>
  );
}

export default App;

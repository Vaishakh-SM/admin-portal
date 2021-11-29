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
import LSAdd from "./Components/Landscaping/LSAdd";
import LSLocation from "./Components/Landscaping/LSLocation";
import LSCut from "./Components/Landscaping/LSCutRequest";
import LSNotes from "./Components/Landscaping/LSNotes";
import LSRead from "./Components/Landscaping/LSRead";
import VNProfile from "./Components/Landscaping/VNProfile";
import VNUpdate from "./Components/Landscaping/VNUpdate";
import VNPays from "./Components/Landscaping/VNPays";
import VNRepair from "./Components/Landscaping/VNRepair";
import SSProfile from "./Components/Landscaping/SSProfile";
import SSUpdate from "./Components/Landscaping/SSUpdate";
import SSPayView from "./Components/Landscaping/SSPayView";
import SSPayClear from "./Components/Landscaping/SSPayClear";
import SSViewRecs from "./Components/Landscaping/SSViewRecs";
import LSSchedule from "./Components/Landscaping/LSSchedule";
import SSScheduler from "./Components/Landscaping/SSScheduler";
import SSManual from "./Components/Landscaping/SSManual";

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
        <Route path="/landscaping/add_details" element={<LSAdd />}/>
        <Route path="/landscaping/update_loc" element={<LSLocation />}/>
        <Route path="/landscaping/request_cut" element={<LSCut />}/>
        <Route path="/landscaping/garden_note_add" element={<LSNotes />}/>
        <Route path="/landscaping/garden_note" element={<LSRead />}/>
        <Route path="/landscaping/vendor_profile" element={<VNProfile />}/>
        <Route path="/landscaping/vendor_update" element={<VNUpdate />}/>
        <Route path="/landscaping/vendor_pay" element={<VNPays />}/>
        <Route path="/landscaping/repair_notes" element={<VNRepair />}/>
        <Route path="/landscaping/supervisor_profile" element={<SSProfile />}/>
        <Route path="/landscaping/supervisor_update" element={<SSUpdate />}/>
        <Route path="/landscaping/super_vendor_pay" element={<SSPayView />}/>
        <Route path="/landscaping/vendor_clear" element={<SSPayClear />}/>
        <Route path="/landscaping/super_cut_recs" element={<SSViewRecs />}/>
        <Route path="/landscaping/schedule" element={<LSSchedule />}/>
        <Route path="/landscaping/scheduler" element={<SSScheduler />}/>
        <Route path="/landscaping/manual_schedule" element={<SSManual />}/>
      </Routes>
    </Grommet>
  );
}

export default App;

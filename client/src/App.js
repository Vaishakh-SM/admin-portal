import { Grommet, grommet} from 'grommet';
import { Routes, Route } from "react-router";
import  Login  from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile";


function App() {
  return (
    <Grommet 
    full 
    theme = {grommet} 
    >
      <Routes>
        <Route path = "/" element = {<Login/>}/>
        <Route path = "/register" element = {<Register/>}/>
        <Route path = "/profile" element = {<Profile/>}/>
      </Routes>
    </Grommet>
  );
}


export default App;

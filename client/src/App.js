import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./Components/Welcome";
import Intro from "./Components/Intro";
import User from "./Components/User";
import Company from "./Components/Company";
import CompanyHome from "./Components/CompanyHome";
import UserHome from "./Components/UserHome";
import night2 from "./night2.png";
<style>
  @import url('https://fonts.googleapis.com/css2?family=Gruppo&display=swap');
</style>;

function App() {
  return (
    <div
      style={{
        position: "sticky",
        backgroundColor: "#212121",
        border: "8px solid #fe2d8c",
        borderRadius: "66px",
        padding: "10px",
        height: "834px",
      }}
    >
      <div style={{ height: "65px" }}>
        <img
          style={{
            width: "20%",
            position: "absolute",
            top: "20px",
          }}
          src={night2}
        ></img>
      </div>
      <Router>
        <hr style={{ borderColor: "#fe2d8c" }}></hr>
        <Routes>
          <Route path="/intro" element={<Intro />}></Route>
          <Route path="/home" element={<Welcome />}></Route>
          <Route path="/userform" element={<User />}></Route>
          <Route path="/companyform" element={<Company />}></Route>
          <Route path="/companyhome/:id" element={<CompanyHome />}></Route>
          <Route path="/main/:context" element={<UserHome />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

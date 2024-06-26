import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import ChooseStyle from "./components/Create/ChooseStyle";
import Footer from "./components/Footer";
import Story from "./components/Create/Story";
import Library from "./components/Library/Library";
import MyStory from "./components/MyStory/MyStory";
import Login from "./components/Login/Login";
import SignUp from "./components/Login/SignUp";
import ViewStory from "./components/ViewStory/ViewStory";
import EditStory from "./components/Create/EditStory";
import ReadStory from "./components/Create/ReadStory";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
// import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);
  return (
    <Router>
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <header>
          <Navbar />
        </header>
        
        <ScrollToTop />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ChooseStyle" element={<ChooseStyle />} />
            {<Route path="/Library" element={<Library />} />}
            {<Route path="/ReadStory/:postId" element={<ReadStory />} />}
            {<Route path="/mystory" element={<MyStory />} />}
            {<Route path="/login" element={<Login />} />}
            {<Route path="/signup" element={<SignUp />} />}
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/story" element={<Story />} />
            <Route path="/EditStory/:postId" element={<EditStory />} />
            <Route path="/ViewStory/:postId" element={<ViewStory />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;

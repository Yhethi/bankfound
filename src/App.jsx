import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import "./styles/main.scss";
import Banking from "./pages/Banking";
import Sidebar from "./components/Sidebar";
import { BackgroundAnimated } from "./components/BackgroundAnimated";
import Loader from "./components/tools/Loader";
import { useSelector } from "react-redux";

function App() {
  return (
    <div>
      <Loader />
      <BackgroundAnimated />
      <Header />
      <Banking />
    </div>
  );
}

export default App;

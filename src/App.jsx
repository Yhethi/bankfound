import "./App.css";
import Header from "./components/Header";
import "./styles/main.scss";
import Banking from "./pages/Banking";
import { BackgroundAnimated } from "./components/BackgroundAnimated";
import Loader from "./components/tools/Loader";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div>
      <Loader />
      <BackgroundAnimated />
      <Header />
      <Banking />
      <Footer />
    </div>
  );
}

export default App;

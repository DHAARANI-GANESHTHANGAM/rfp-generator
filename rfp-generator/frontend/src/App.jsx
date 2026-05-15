import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Generate from "./pages/Generate";
import Response from "./pages/Response";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/generate"  element={<Generate />} />
        <Route path="/response"  element={<Response />} />
      </Routes>
    </Router>
  );
}

export default App;

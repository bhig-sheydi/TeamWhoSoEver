import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./Pages/Home";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import LoginCallback from "./components/LoginCallBack";
import DashboardPage from "./Pages/DashboardPage";
import CheckoutPageM from "./Pages/CheckoutPageM";

function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/cart" element={<CheckoutPageM/>} />

            {/* OAuth redirect callback */}
            <Route path="/login-callback" element={<LoginCallback />} />

            {/* Dashboard route */}
            <Route path="/dashboard" element={<DashboardPage/>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

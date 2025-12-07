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
import SuccessPage from "./components/SucessPage";
import OrderPage from "./Pages/OrderPage";
import TeamWhosoeverSVG from "./components/svg";
import ClothingCustomizerLayout from "./components/ClothingLayout";
import Hoodie from "./components/Hoodie";
import Tshirt from "./components/Tshirt";
import OrderDesignPreview from "./components/OrderPrview";
import CrossLogo from "./components/CrossLogo1";
import CrossLogo2 from "./components/CrossLogo2";
import CrossLogo3 from "./components/CrossLogo3";
import CrossLogo4 from "./components/CrossLogo4";

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
            <Route path="/success" element={<SuccessPage/>} />
            <Route path="/orders" element={<OrderPage/>} />
            <Route path="/custom" element={<ClothingCustomizerLayout/>} />
            <Route path="/custom" element={<ClothingCustomizerLayout/>} />
            <Route path="/custom2" element={<OrderDesignPreview/>} />
            <Route path="/cross" element={<CrossLogo4/>} />
            

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

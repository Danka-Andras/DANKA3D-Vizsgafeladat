import { Routes, Route } from "react-router-dom";
import Login from './Components/LoginRegister/Login';
import Register from './Components/LoginRegister/Register';
import Home from './Components/Home/Home';
import NotFound from './Components/NotFound/NotFound';
import ForgotPassword from './Components/LoginRegister/ForgotPassword';
import Basket from './Components/Basket/Basket';
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import ProtectedRoute from "./Components/Auth/ProtectedAuth";
import Orders from "./Components/Orders/Orders";
import AboutUs from "./Components/AboutUs/AboutUs"
import Terms from "./Components/Terms/Terms";
import Privacy from "./Components/Privacy/Privacy";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route 
        path="/basket" 
        element={
          <ProtectedRoute>
            <Basket />
          </ProtectedRoute>
        } 
      />
      <Route path="/product-details/:productId" element={<ProductDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

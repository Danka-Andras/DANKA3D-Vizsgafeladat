import { Routes, Route } from "react-router-dom";
import Login from './Components/LoginRegister/Login';
import Register from './Components/LoginRegister/Register';
import Home from './Components/Home/Home'
import NotFound from './Components/NotFound/NotFound'
import ForgotPassword from './Components/LoginRegister/ForgotPassword'
import Basket from './Components/Basket/Basket'
import ProductInBasket from "./Components/ProductInBasket/ProductInBasket";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/basket" element={<Basket />} />
      <Route path="/productinbasket" element={<ProductInBasket />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

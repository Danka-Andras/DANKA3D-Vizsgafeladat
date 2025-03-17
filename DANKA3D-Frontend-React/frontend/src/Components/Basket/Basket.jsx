import React from 'react';
import Navbar from '../Navbar/Navbar';
import './Basket.css';
import ProductInBasket from '../ProductInBasket/ProductInBasket';

import { LuTruck } from "react-icons/lu";

const Basket = () => {
  return (
    <div>
      <Navbar />
      <div className="basket-container">
        <div className="basket-wrapper">
          <div className="purchase-container">
            <span className="total-price">Teljes ár: 123456Ft</span>
            <button className="purchase-button">
              Rendelés <LuTruck className="truck-icon" />
            </button>
          </div>
          <div className="basket-list">
            <ProductInBasket /> 
            <ProductInBasket />
            <ProductInBasket />
            <ProductInBasket />
            <ProductInBasket />
            <ProductInBasket />
            <ProductInBasket />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basket;

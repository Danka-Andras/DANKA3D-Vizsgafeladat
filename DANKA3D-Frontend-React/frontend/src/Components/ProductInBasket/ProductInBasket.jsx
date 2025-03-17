import React from "react";
import "./ProductInBasket.css";
import { LuTrash } from "react-icons/lu";
import { Link } from 'react-router-dom';

const ProductInBasket = ({ product, onRemove }) => {
  return (
    <div className="product-in-basket">
      <div className="product-info">
        <div className="product-image">
            <Link to="/product">
                <img 
                    src="https://th.bing.com/th/id/OIP.UE3uOiLaxie3OUSl2C5u2AHaEK?rs=1&pid=ImgDetMain" 
                    alt="Termék képe" 
                />
            </Link>
        </div>
        <div className="product-details">
          <span className="product-name">Nagyon hosszú tárgy név</span>
          <div className="product-meta">
            <span className="product-price">300000 FT</span>
            <span className="product-color">VILÁGOS RÓZSASZÍN</span>
            <span className="product-quantity">10 DB</span>
          </div>
        </div>
      </div>
      <button className="remove-button">
        <LuTrash />
      </button>
    </div>
  );
};

export default ProductInBasket;

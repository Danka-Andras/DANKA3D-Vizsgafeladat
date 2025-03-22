import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const handleCardClick = () => {
    window.open(`/product-details/${product.id}`, '_blank');
  };

  return (
    <div className="product-container" onClick={handleCardClick}>
      <div className="product-card">
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
          </div>
        <div>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{product.price}Ft</p>
          <p className="product-stock">Készlet: {product.stock}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

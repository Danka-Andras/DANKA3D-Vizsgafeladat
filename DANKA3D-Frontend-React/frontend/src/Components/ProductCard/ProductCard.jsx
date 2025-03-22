import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const handleCardClick = () => {
    window.open(`/product-details/${product.id}`, '_blank');
  };

  return (
    <div className="product-container" onClick={handleCardClick}>
      <div className="product-card">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}Ft</p>
        <p className="product-stock">Készlet: {product.stock}</p>
      </div>
    </div>
  );
};

export default ProductCard;

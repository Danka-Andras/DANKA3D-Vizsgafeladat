import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './ProductDetails.css';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null); // Holds product details
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message state

  // Fetch product details by productId
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5277/api/Product/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }

        const data = await response.json();
        setProduct(data); // Store product details in state
      } catch (err) {
        setError('Nem sikerült lekérni a termék adatait.');
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle "Add to Cart" button click
  const handleAddToCart = async () => {
    // Először lekérjük a bejelentkezett felhasználó adatait
    const userResponse = await fetch('http://localhost:5277/api/User/me', {
      method: 'GET',
      credentials: 'include', // Biztosítjuk, hogy a session cookie-k is küldésre kerüljenek
    });

    if (!userResponse.ok) {
      setError('A felhasználó nincs bejelentkezve.');
      return;
    }

    const userData = await userResponse.json();
    const userId = userData.userId;

    if (!userId) {
      setError('Nem található a felhasználó ID-ja.');
      return;
    }

    // Most, hogy van userId, hozzáadjuk a terméket a kosárhoz
    try {
      const response = await fetch('http://localhost:5277/api/Cart/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, // Dinamikusan passzoljuk a userId-t
          productId: product.id, // A kiválasztott termék ID-ja
          quantity: quantity, // A kiválasztott mennyiség
        }),
      });

      if (!response.ok) {
        throw new Error('Nem sikerült hozzáadni a terméket a kosárhoz.');
      }

      alert("Hozzáadva a kosárhoz");;
    } catch (err) {
      setError('Hiba történt a kosárhoz adás során.');
    }
  };

  if (isLoading) {
    return <div><h1>Betöltés...</h1></div>;
  }

  if (error) {
    return <div><h1>Hiba:</h1> <p>{error}</p></div>;
  }

  return (
    <div className="product-details-container">
      <Navbar />
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <p>{product.description}</p>
      <p><strong>Ár/db:</strong> {product.price}Ft</p>
      {/* <p><strong>Készlet:</strong> {product.stock}</p> */}
      <p><strong>Szín:</strong> {product.color}</p>
      
      <div className="quantity-container">
        <label htmlFor="quantity">Mennyiség:</label>
        <input
          type="number"
          id="quantity"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <button onClick={handleAddToCart} className="add-to-cart-button">Kosárhoz adás</button>
    </div>
  );
};

export default ProductDetails;

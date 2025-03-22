import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import './Basket.css';

const Basket = () => {
  const [cart, setCart] = useState([]); // Kosár állapot
  const [loading, setLoading] = useState(true); // Betöltési állapot
  const [error, setError] = useState(null); // Hiba állapot
  const [userId, setUserId] = useState(null); // Bejelentkezett felhasználó ID-ja

  // Kosár lekérése az API-ból
  const fetchCart = async () => {
    try {
      const userResponse = await fetch('http://localhost:5277/api/user/me', {
        credentials: 'include',
      });

      if (!userResponse.ok) {
        throw new Error('Nem vagy bejelentkezve.');
      }

      const userData = await userResponse.json();
      setUserId(userData.userId);

      const response = await fetch(`http://localhost:5277/api/cart/${userData.userId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Hiba történt a kosár lekérésekor');
      }

      const cartData = await response.json();

      if (cartData.CartItems && Array.isArray(cartData.CartItems.$values)) {
        setCart(cartData.CartItems.$values);
      } else {
        throw new Error('A válasz nem tartalmaz érvényes kosarat.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Kosár tételek mennyiségének frissítése
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart(prevCart =>
      prevCart.map(item =>
        item.Id === itemId ? { ...item, Quantity: newQuantity } : item
      )
    );

    fetch(`http://localhost:5277/api/cart/update-item/${itemId}?quantity=${newQuantity}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }).catch((error) => setError(error.message));
  };

  // Tárgy eltávolítása a kosárból
  const removeItem = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.Id !== itemId));

    fetch(`http://localhost:5277/api/cart/remove-item/${itemId}`, {
      method: 'DELETE',
    }).catch((error) => setError(error.message));
  };

  // Összeg kiszámítása
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.Product.Price * item.Quantity, 0).toFixed(2);
  };

  // Rendelés gomb
  const handleOrder = () => {
    alert('A rendelés sikeresen megtörtént!');
  };

  return (
    <div>
      <Navbar /> {/* A Navbar mindig megjelenik */}

      <div className="basket-container">
        <h1>Kosár</h1>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && userId && cart.length === 0 && <p>A kosár üres.</p>}

        {!loading && !error && userId && cart.length > 0 && (
          <>
            <div className="cart-summary">
              <h2>Végösszeg: {calculateTotal()} Ft</h2>
            </div>
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.Id} className="cart-item">
                  <div className="item-image">
                    <img src={item.Product.ImageUrl} alt={item.Product.Name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.Product.Name}</h3>
                    <div className="item-quantity">
                      <button onClick={() => updateQuantity(item.Id, item.Quantity - 1)}>-</button>
                      <span>{item.Quantity} db</span>
                      <button onClick={() => updateQuantity(item.Id, item.Quantity + 1)}>+</button>
                    </div>
                    <span>{item.Product.Price} Ft/db</span>
                  </div>
                  <div className="remove-item">
                    <button onClick={() => removeItem(item.Id)}>Eltávolítás</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="order-button">
              <button onClick={handleOrder}>Rendelés</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Basket;

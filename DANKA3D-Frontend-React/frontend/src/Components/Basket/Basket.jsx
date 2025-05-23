import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { useNavigate, Link } from "react-router-dom";
import './Basket.css';

const Basket = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const navigate = useNavigate();
  

  // Fetch user data and cart items
  const fetchCart = async () => {
    try {
      const userResponse = await fetch('http://localhost:5277/api/user/me', { credentials: 'include' });
      if (!userResponse.ok) throw new Error('Nem vagy bejelentkezve.');

      const userData = await userResponse.json();
      setUserId(userData.userId);

      const cartResponse = await fetch(`http://localhost:5277/api/cart/${userData.userId}`, { credentials: 'include' });
      if (!cartResponse.ok) throw new Error('Hiba történt a kosár lekérésekor.');

      const cartData = await cartResponse.json();
      setCart(cartData.CartItems?.$values || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity for a cart item
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setCart((prevCart) =>
        prevCart.map((item) => (item.Id === itemId ? { ...item, Quantity: newQuantity } : item))
      );

      const response = await fetch(`http://localhost:5277/api/cart/update-item/${itemId}?quantity=${newQuantity}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Nem sikerült frissíteni a mennyiséget.');
      }
    } catch (err) {
      console.error(err);
      setError('Nem sikerült frissíteni a mennyiséget.');
    }
  };

  // Remove an item from the cart
  const removeItem = async (itemId) => {
    try {
      setCart((prevCart) => prevCart.filter((item) => item.Id !== itemId));

      const response = await fetch(`http://localhost:5277/api/cart/remove-item/${itemId}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Nem sikerült eltávolítani a terméket.');
      }
    } catch (err) {
      console.error(err);
      setError('Nem sikerült eltávolítani a terméket.');
    }
  };

  // Calculate total price for all items in the cart
  const calculateTotal = () =>
    Math.round(
      cart.reduce((total, item) => total + (item?.Product?.Price || 0) * (item?.Quantity || 1), 0)
    );

    const handleOrder = async () => {
      if (!userId) {
        setError("Nem vagy bejelentkezve, kérlek jelentkezz be a rendeléshez.");
        return;
      }
    
      try {
        if (!cart || cart.length === 0) {
          throw new Error("A kosár üres. Kérlek, adj hozzá termékeket a rendelés leadásához.");
        }
    
        const orderPayload = {
          id: 0,
          userId: userId || 0,
          totalPrice: calculateTotal() || 0,
          status: "Feldolgozás alatt",
          createdAt: new Date().toISOString(),
          orderProducts: cart.map((item) => ({
            id: 0,
            orderId: 0,
            productId: item.Product.Id,
            quantity: item.Quantity,
            price: item.Product.Price,
            imageUrl: item.Product.ImageUrl || "string",
          })),
        };
    
        const response = await fetch("http://localhost:5277/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(orderPayload),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Hiba történt a rendelés leadása során.");
        }
    
        const responseData = await response.json();
        alert("A rendelés sikeresen leadva!");
    
        const clearCartResponse = await fetch(`http://localhost:5277/api/cart/clear-cart/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
    
        if (!clearCartResponse.ok) {
          const clearCartErrorData = await clearCartResponse.json();
          throw new Error(clearCartErrorData.message || "Hiba történt a kosár kiürítése során.");
        }
    
        setCart([]);
        navigate("/orders");
      } catch (error) {
        console.error("Rendelési hiba:", error);
        setError(error.message || "Ismeretlen hiba történt.");
      }
    };
    
    

  return (
    <div>
      <Navbar />
      <div className="basket-container">
        <h1>Kosár</h1>

        {loading && <p>Betöltés...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && cart.length === 0 && <p>A kosár üres.</p>}

        {!loading && !error && cart.length > 0 && (
          <>
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.Id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.Product.ImageUrl || 'https://via.placeholder.com/150'}
                      alt={item.Product.Name}
                      onClick={() => window.open(`/product-details/${item.Product.Id}`, '_blank')}
                      style={{ cursor: 'pointer' }}
                    />
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
            <div className="cart-summary">
              <h2>Végösszeg: {calculateTotal()} Ft</h2>
            </div>
            <div className="order-button">
              <button onClick={handleOrder} disabled={orderLoading || cart.length === 0}>
                {orderLoading ? 'Rendelés folyamatban...' : 'Rendelés'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Basket;

import React, { useState, useEffect } from 'react';
import './Basket.css';

const Basket = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = 2; // A felhasználó ID-ja (valós esetben dinamikus lenne)

  // Kosár lekérése az API-ból
  const fetchCart = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:5277/api/cart/${userId}`, {
        credentials: 'include', // Biztosítja, hogy a session cookie elérhető legyen
      });

      if (!response.ok) {
        throw new Error('Hiba történt a kosár lekérésekor');
      }

      const cartData = await response.json();
      console.log('Cart data:', cartData);

      // Ellenőrizzük, hogy a CartItems létezik, és ha van, akkor az $values tömböt használjuk
      if (cartData.CartItems && Array.isArray(cartData.CartItems.$values)) {
        setCart(cartData.CartItems.$values);
      } else {
        setError('A válasz nem tartalmaz érvényes kosarat.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart(); // Lekéri a kosarat, amikor a komponens betöltődik
  }, [userId]); // Csak akkor újra hívódik, ha a userId változik

  // Kosár tételek mennyiségének frissítése
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Ne engedjünk 0 alatti mennyiséget

    // Frissítjük a kosarat az új mennyiséggel
    setCart(prevCart =>
      prevCart.map(item =>
        item.Id === itemId ? { ...item, Quantity: newQuantity } : item
      )
    );

    // Szerver oldali frissítés (PUT kérés)
    fetch(`http://localhost:5277/api/cart/update-item/${itemId}?quantity=${newQuantity}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Hiba történt a mennyiség frissítésekor');
        }
      })
      .catch((error) => setError(error.message));
  };

  // Tárgy eltávolítása a kosárból
  const removeItem = (itemId) => {
    // Frissítjük a kosarat úgy, hogy eltávolítjuk a kiválasztott elemet
    setCart((prevCart) => prevCart.filter((item) => item.Id !== itemId));

    // Szerver oldali törlés (DELETE kérés)
    fetch(`http://localhost:5277/api/cart/remove-item/${itemId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Hiba történt a tárgy eltávolításakor');
        }
      })
      .catch((error) => setError(error.message));
  };

  // Összeg kiszámítása
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.Product.Price * item.Quantity, 0).toFixed(2);
  };

  // Rendelés gomb
  const handleOrder = () => {
    alert('A rendelés sikeresen megtörtént!');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (cart.length === 0) {
    return <p>A kosár üres.</p>;
  }

  return (
    <div className="basket-container">
      <h1>Kosár</h1>
      <div className="cart-summary">
        <h2>Végösszeg: {calculateTotal()} Ft</h2>
      </div>
      <ul className="cart-list">
        {cart.map((item, index) => (
          <li key={index} className="cart-item">
            <div className="item-image">
              <img src={item.Product.ImageUrl} alt={item.Product.Name} />
            </div>
            <div className="item-details">
              <h3>{item.Product.Name}</h3>
              <p>{item.Product.Description}</p>
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
    </div>
  );
};

export default Basket;

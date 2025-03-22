import React, { useState, useEffect } from 'react';
import './Basket.css';

const Basket = () => {
  const [cart, setCart] = useState([]); // Kosár állapot
  const [loading, setLoading] = useState(true); // Betöltési állapot
  const [error, setError] = useState(null); // Hiba állapot
  const [userId, setUserId] = useState(null); // Bejelentkezett felhasználó ID-ja

  // Kosár lekérése az API-ból
  const fetchCart = async () => {
    // Először le kell kérdezni a bejelentkezett felhasználó ID-ját
    const userResponse = await fetch('http://localhost:5277/api/user/me', {
      credentials: 'include', // Biztosítja, hogy a session cookie elérhető legyen
    });

    if (!userResponse.ok) {
      setError('Nem vagy bejelentkezve.');
      console.log('User not logged in or session expired');
      return;
    }

    const userData = await userResponse.json();
    setUserId(userData.userId); // Mentjük a felhasználó ID-ját
    console.log('Logged in user:', userData);

    try {
      const response = await fetch(`http://localhost:5277/api/cart/${userData.userId}`, {
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
        console.log('Invalid cart data:', cartData);
      }
    } catch (error) {
      setError(error.message);
      console.log('Error fetching cart:', error);
    } finally {
      setLoading(false);
      console.log('Cart data loading complete');
    }
  };

  // Kosár betöltése, ha a felhasználó be van jelentkezve
  useEffect(() => {
    console.log('Fetching cart data...');
    fetchCart(); // Betöltjük a kosarat
  }, []); // A [] biztosítja, hogy csak egyszer fusson le

  // Kosár tételek mennyiségének frissítése
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Ne engedjünk 0 alatti mennyiséget

    console.log(`Updating quantity for itemId: ${itemId} to ${newQuantity}`);

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
        console.log(`Item ${itemId} quantity updated to ${newQuantity}`);
      })
      .catch((error) => {
        setError(error.message);
        console.log('Error updating quantity:', error);
      });
  };

  // Tárgy eltávolítása a kosárból
  const removeItem = (itemId) => {
    console.log(`Removing item with ID: ${itemId}`);

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
        console.log(`Item ${itemId} removed from cart`);
      })
      .catch((error) => {
        setError(error.message);
        console.log('Error removing item:', error);
      });
  };

  // Összeg kiszámítása
  const calculateTotal = () => {
    const total = cart.reduce((total, item) => total + item.Product.Price * item.Quantity, 0);
    console.log(`Total cost calculated: ${total}`);
    return total.toFixed(2);
  };

  // Rendelés gomb
  const handleOrder = () => {
    console.log('Order placed');
    alert('A rendelés sikeresen megtörtént!');
  };

  // Betöltés állapot
  if (loading) {
    console.log('Loading cart...');
    return <p>Loading...</p>;
  }

  // Hiba esetén
  if (error) {
    console.log('Error occurred:', error);
    return <p>{error}</p>;
  }

  // Ha nincs bejelentkezve a felhasználó
  if (!userId) {
    console.log('User not logged in');
    return <p>Nem vagy bejelentkezve.</p>;
  }

  // Ha a kosár üres
  if (cart.length === 0) {
    console.log('Cart is empty');
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

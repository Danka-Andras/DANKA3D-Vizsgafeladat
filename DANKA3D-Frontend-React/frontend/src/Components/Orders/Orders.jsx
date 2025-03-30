import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user orders
  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get logged-in user information
      const userResponse = await fetch('http://localhost:5277/api/user/me', {
        credentials: 'include',
      });

      if (!userResponse.ok) {
        throw new Error('Nem található bejelentkezett felhasználó.');
      }

      const userData = await userResponse.json();
      if (!userData?.userId) {
        throw new Error('Hibás felhasználói adatok.');
      }

      const userId = userData.userId;

      // Fetch orders for the user
      const ordersResponse = await fetch(`http://localhost:5277/api/orders/user/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!ordersResponse.ok) {
        throw new Error(`Hiba történt a rendelések lekérésekor: ${ordersResponse.status}`);
      }

      const ordersData = await ordersResponse.json();
      setOrders(ordersData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  // Render individual order products
  const renderOrderProducts = (products) => {
    if (!products || !products.length) {
      return <p>Nincsenek termékek.</p>;
    }

    return products.map((product) => (
      <div key={product.id} className="order-product">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/150'}
          alt={`Termék ID: ${product.productId}`}
          className="product-image"
        />
        <div className="order-product-details">
          <p>Ár: {product.price ? `${product.price.toFixed(2)} Ft` : 'N/A'}</p>
          <p>Mennyiség: {product.quantity || 1}</p>
          
        </div>
      </div>
    ));
  };

  // Render individual orders
  const renderOrders = () => {
    if (orders.length === 0) {
      return <p>Ez a felhasználó még nem rendelt semmit.</p>;
    }

    return orders.map((order) => (
      <div key={order.id} className="order-block">
        <h2>Rendelés #{order.id}</h2>
        <p>Státusz: {order.status || 'Nincs megadva'}</p>
        <p>Összeg: {order.totalPrice ? `${order.totalPrice.toFixed(2)} Ft` : 'N/A'}</p>
        <p>Rendelés ideje: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('hu-HU') : 'N/A'}</p>

        <div className="order-products">
          <h3>Termékek:</h3>
          {renderOrderProducts(order.products)}
        </div>
      </div>
    ));
  };

  return (
    <div className="orders-container">
        <Navbar />
      <h1>Rendeléseim</h1>

      {loading && <p>Rendelések betöltése...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && renderOrders()}
    </div>
  );
};

export default Orders;

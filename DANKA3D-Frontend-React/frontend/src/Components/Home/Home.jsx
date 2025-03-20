import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import ProductCard from '../ProductCard/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Hiba kezelése

  useEffect(() => {
    axios.get('http://localhost:5277/api/product')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        // Pontosabb hibakezelés: Hiba üzenet beállítása a válasz alapján
        const errorMessage = err.response ? err.response.data.message : 'Nem sikerült betölteni a termékeket';
        setError(errorMessage);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="home">
        {loading ? (
          <h1>Betöltés...</h1>
        ) : error ? (
          <p>{error}</p>  // Ha van hiba, akkor azt jelenítjük meg
        ) : (
          <div className="product-cards">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>Nincsenek elérhető termékek.</p>  // Ha nincs termék
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

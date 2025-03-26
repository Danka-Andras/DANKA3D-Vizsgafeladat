import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import ProductCard from '../ProductCard/ProductCard';
import './Home.css';
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

const Home = () => {
  const [products, setProducts] = useState([]); // All products from API
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products based on search
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [pageSize, setPageSize] = useState(24); // Dynamic page size

  const fetchProducts = async (currentPage) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5277/api/product?page=${currentPage}&pageSize=${pageSize}`);
      const data = response.data; // Backend response
      setProducts(data.products); // Update products state
      setFilteredProducts(data.products); // Initially, filtered products are the same as products
      setTotalPages(data.totalPages); // Set total pages
      setLoading(false);
    } catch (err) {
      console.error('Error loading products:', err);
      const errorMessage = err.response ? err.response.data.message : 'Failed to load products.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page); // Fetch products for the current page
  }, [page, pageSize]); // Refetch when page or pageSize changes

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query) {
      // Adjust pageSize to 200 when searching
      setPageSize(200);

      // Filter products based on the search query
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      // Reset to original pageSize and products when query is cleared
      setPageSize(24);
      setFilteredProducts(products);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prevPage) => prevPage + 1); // Go to next page
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1); // Go to previous page
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber); // Jump to specific page
  };

  const generatePageNumbers = () => {
    if (totalPages <= 1) return []; // No pagination needed

    const pages = [];
    const startPage = Math.max(1, page - 2); // Start from two pages before the current page
    const endPage = Math.min(totalPages, page + 2); // End on two pages after the current page

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <div className="home">
        {loading ? (
          <h1>Betöltés...</h1>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div>
            <div className="product-cards">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>
            {/* Conditionally render pagination buttons */}
            {searchQuery === "" && (
              <div className="pagination-buttons">
                <button 
                  onClick={handlePrevPage} 
                  disabled={page === 1}
                >
                  <LuArrowLeft />
                </button>
                {generatePageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageClick(pageNumber)}
                    className={pageNumber === page ? 'active' : ''} // Highlight the current page
                  >
                    {pageNumber}
                  </button>
                ))}
                <button 
                  onClick={handleNextPage} 
                  disabled={page === totalPages} // Disable "Next" button on the last page
                >
                  <LuArrowRight />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

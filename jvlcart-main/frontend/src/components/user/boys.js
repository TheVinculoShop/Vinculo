import React, { useEffect, useState } from 'react';

const BoysProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBoysProducts = async () => {
      try {
        const response = await fetch('/api/products/boys');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching boys products:', error);
      }
    };

    fetchBoysProducts();
  }, []);

  return (
    <div>
      <h1>Boys Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product._id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default BoysProductsPage;

import React, { useState, useEffect, useRef } from "react";

const InfiniteScrollComponent = () => {
  const [stores, setStores] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [page, setPage] = useState(1); 
  const observer = useRef(null); 
  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/stores?_page=${page}&_limit=10`);
      const data = await response.json();
      setStores((prev) => [...prev, ...data]); 
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const lastStoreElementRef = (node) => {
    if (loading) return; 
    if (observer.current) observer.current.disconnect(); 

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node); 
  };

  
  useEffect(() => {
    fetchStores();
  }, [page]); 
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">Stores</h1>
      <div className="mt-8 text-center">
        <p className="text-lg font-semibold text-gray-800">
          Shop today and earn Cash Back at over 2,500 stores online. Find everything you need from men’s, children’s and women’s clothing, accessories and shoes to home décor, electronics, toys, and more. Shop the best sales and deals from your favorite online stores – plus save with thousands of coupons and promo codes. Check back daily for new sales and hot deals to help you save with Cash Back at RewardsBunny.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store, index) => (
          <div
            key={store.id}
            ref={stores.length === index + 1 ? lastStoreElementRef : null}
            className="bg-white p-6 border rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
          >
            <img
              src={store.logo}
              alt={store.name}
              className="w-full h-40 object-contain mb-4 rounded-md"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">{store.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{store.slug}</p>
            <p className="text-sm text-gray-500">{store.homepage}</p>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}

      
    </div>
  );
};

export default InfiniteScrollComponent;

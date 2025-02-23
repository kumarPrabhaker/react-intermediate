import React, { useState, useEffect } from "react";

const AllStores = ({ className }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Store search term
  const [cashbackEnabled, setCashbackEnabled] = useState(false); // Filter for cashback stores
  const [sortBy, setSortBy] = useState(""); // Sorting stores

  useEffect(() => {
    // Build query based on filters
    let query = `http://localhost:5000/stores?`;

    // Add search filter
    if (searchTerm) query += `name_like=${searchTerm}&`;

    // Add cashback filter
    if (cashbackEnabled) query += `cashback_enabled=1&`;

    // Add sorting filter
    if (sortBy) query += `_sort=${sortBy}&order=desc&`;

    // Remove trailing '&' if it exists
    if (query.endsWith("&")) query = query.slice(0, -1);

    // Fetch data with dynamic query
    fetch(query)
      .then((response) => response.json())
      .then((data) => setData(data));
  }, [searchTerm, cashbackEnabled, sortBy]);

  return (
    <div className={`my-[50px] ${className}`}>
      <h1 className="text-3xl font-semibold mb-6">All Stores</h1>

      {/* Filters */}
      <div className="mb-6">
        {/* Search by Store Name */}
        <input
          type="text"
          placeholder="Search by store name"
          className="p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
        
        {/* Cashback Enabled Filter */}
        <label>
          <input
            type="checkbox"
            checked={cashbackEnabled}
            onChange={() => setCashbackEnabled(!cashbackEnabled)} // Toggle cashback filter
          />
          Cashback Enabled
        </label>

        {/* Sorting Dropdown */}
        <select
          className="p-2 border rounded-md"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)} // Update sorting preference
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="clicks">Popularity</option>
        </select>
      </div>

      {/* Store Cards Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length > 0 ? (
          data.map((store) => (
            <div key={store.id} className="store-card p-4 border rounded-lg shadow-lg bg-white">
              <img
                src={store.logo}
                alt={store.name}
                className="w-full h-40 object-contain mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{store.name}</h3>
              <p className="text-sm text-gray-600">{store.slug}</p>
              <p className="text-sm text-gray-600">{store.homepage}</p>
              <div className="mt-4">
                <span
                  className={`inline-block px-4 py-1 text-white rounded-full ${
                    store.cashback_enabled ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {store.cashback_enabled ? `Cashback: ${store.cashback_percent}%` : "No Cashback"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No stores available</p>
        )}
      </div>
    </div>
  );
};

export default AllStores;

// upper  store

//2nd
import React, { useState, useEffect } from "react";

const AllStores = ({ className }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Store search term
  const [cashbackEnabled, setCashbackEnabled] = useState(false); // Filter for cashback stores
  const [sortBy, setSortBy] = useState(""); // Sorting stores
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(10); // Items per page
  const [totalStores, setTotalStores] = useState(0); // Total number of stores (for pagination)

  useEffect(() => {
    // Build query based on filters
    let query = `http://localhost:5000/stores?_page=${page}&_limit=${limit}`;

    // Add search filter
    if (searchTerm) query += `&name_like=${searchTerm}`;

    // Add cashback filter
    if (cashbackEnabled) query += `&cashback_enabled=1`;

    // Add sorting filter
    if (sortBy) query += `&_sort=${sortBy}&_order=desc`;

    // Fetch data with dynamic query
    fetch(query)
      .then((response) => {
        const totalCount = response.headers.get("X-Total-Count"); // Get total number of stores from headers
        setTotalStores(totalCount);
        return response.json();
      })
      .then((data) => setData(data));
  }, [searchTerm, cashbackEnabled, sortBy, page, limit]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalStores / limit)) {
      setPage(newPage);
    }
  };

  return (
    <div className={`my-[50px] ${className}`}>
      <h1 className="text-3xl font-semibold mb-6">All Stores</h1>

      {/* Filters */}
      <div className="mb-6">
        {/* Search by Store Name */}
        <input
          type="text"
          placeholder="Search by store name"
          className="p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
        
        {/* Cashback Enabled Filter */}
        <label className="ml-4">
          <input
            type="checkbox"
            checked={cashbackEnabled}
            onChange={() => setCashbackEnabled(!cashbackEnabled)} // Toggle cashback filter
          />
          Cashback Enabled
        </label>

        {/* Sorting Dropdown */}
        <select
          className="p-2 border rounded-md ml-4"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)} // Update sorting preference
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="clicks">Popularity</option>
        </select>
      </div>

      {/* Store Cards Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length > 0 ? (
          data.map((store) => (
            <div key={store.id} className="store-card p-4 border rounded-lg shadow-lg bg-white">
              <img
                src={store.logo}
                alt={store.name}
                className="w-full h-40 object-contain mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{store.name}</h3>
              <p className="text-sm text-gray-600">{store.slug}</p>
              <p className="text-sm text-gray-600">{store.homepage}</p>
              <div className="mt-4">
                <span
                  className={`inline-block px-4 py-1 text-white rounded-full ${store.cashback_enabled ? "bg-green-500" : "bg-gray-500"}`}
                >
                  {store.cashback_enabled ? `Cashback: ${store.cashback_percent}%` : "No Cashback"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No stores available</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {Math.ceil(totalStores / limit)}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= Math.ceil(totalStores / limit)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllStores;



//categories
import React, { useEffect, useState } from "react";

const Categories = ({ className }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/categories`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setList(data); // Storing the fetched categories in the state
      });
  }, []);

  return (
    <div className={`${className} my-[50px]`}>
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <ul className="list-none p-0">
        {list.length > 0 ? (
          list.map((category) => (
            <li
              key={category.id}
              className="category-card p-4 border-b border-gray-300 mb-4 bg-white rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.store_count} Stores</p>
            </li>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </ul>
    </div>
  );
};

export default Categories;




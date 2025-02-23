import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation

const AllStores = ({ className, selectedCategory }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cashbackEnabled, setCashbackEnabled] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalStores, setTotalStores] = useState(0);
  const [alphabet, setAlphabet] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [isPromoted, setIsPromoted] = useState(false);

  const navigate = useNavigate(); // Initialize navigate function from react-router-dom

  useEffect(() => {
    let query = `http://localhost:3001/stores?_page=${page}&_limit=${limit}`;

    if (selectedCategory) query += `&category_id=${selectedCategory}`;
    if (searchTerm) query += `&name_like=${searchTerm}`;
    if (alphabet) query += `&name_like=${alphabet}`;
    if (cashbackEnabled) query += `&cashback_enabled=1`;
    if (isPromoted) query += `&is_promoted=1`;

    if (sortBy) {
      const sortField = sortBy === "name" ? "name" : sortBy === "clicks" ? "clicks" : sortBy === "cashback" ? "cashback_percent" : "is_featured";
      query += `&_sort=${sortField}&_order=desc`;
    }

    fetch(query)
      .then((response) => {
        const totalCount = response.headers.get("X-Total-Count");
        setTotalStores(totalCount);
        return response.json();
      })
      .then((data) => setData(data));
  }, [searchTerm, cashbackEnabled, sortBy, page, limit, alphabet, isPromoted, selectedCategory]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalStores / limit)) setPage(newPage);
  };

  const toggleFavourite = (storeId) => {
    setFavourites((prev) => prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]);
  };

  const alphabetList = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

  const formatCashback = (store) => {
    if (store.cashback_enabled === 0) return "No cashback available";
    const rate = store.rate_type === "upto" ? "Upto" : "Flat";
    const amount = store.amount_type === "fixed" ? `$${store.cashback_amount.toFixed(2)}` : `${store.cashback_amount.toFixed(2)}%`;
    return `${rate} ${amount} cashback`;
  };

  const handleLoadMore = () => {
    // When clicking "Load More", navigate to the InfiniteScrollComponent
    navigate("/infinite-scroll");  // Navigates to InfiniteScrollComponent
  };

  return (
    <div className={`my-12 ${className}`}>
      <h1 className="text-3xl font-semibold mb-4">All Stores</h1>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setAlphabet("")} className={`p-2 px-4 border rounded-md ${alphabet === "" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>All</button>
          {alphabetList.map((letter) => (
            <button key={letter} onClick={() => setAlphabet(letter)} className={`p-2 px-4 border rounded-md ${alphabet === letter ? "bg-blue-500 text-white" : "bg-gray-200"}`}>{letter}</button>
          ))}
        </div>

        <div className="flex gap-4">
          <input type="text" placeholder="Search by store name" className="p-2 border rounded-md w-60" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <label className="flex items-center">
            <input type="checkbox" checked={cashbackEnabled} onChange={() => setCashbackEnabled(!cashbackEnabled)} />
            Cashback Enabled
          </label>
          <label className="flex items-center">
            <input type="checkbox" checked={isPromoted} onChange={() => setIsPromoted(!isPromoted)} />
            Promoted Stores
          </label>
          <select className="p-2 border rounded-md" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="clicks">Popularity</option>
            <option value="featured">Featured</option>
            <option value="cashback">Cashback</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length > 0 ? data.map((store) => (
          <div key={store.id} className="store-card p-4 border rounded-lg shadow-lg bg-white relative">
            <button onClick={() => toggleFavourite(store.id)} className="absolute top-2 right-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300">
              {favourites.includes(store.id) ? "❤️" : "🤍"}
            </button>
            <img src={store.logo} alt={store.name} className="w-full h-40 object-contain mb-4" />
            <h3 className="text-xl font-bold mb-2">{store.name}</h3>
            <p className="text-sm text-gray-600">{store.slug}</p>
            <p className="text-sm text-gray-600">{store.homepage}</p>
            <div className="mt-4">
              <span className={`inline-block px-4 py-1 text-white rounded-full ${store.cashback_enabled ? "bg-green-500" : "bg-gray-500"}`}>
                {formatCashback(store)}
              </span>
            </div>
            <a href={store.homepage} target="_blank" rel="noopener noreferrer" className="absolute inset-0" />
          </div>
        )) : <p>No stores available</p>}
      </div>

      

      <div className="mt-6 flex justify-center">
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2">Previous</button>
        <span className="px-4 py-2">Page {page} of {Math.ceil(totalStores / limit)}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page >= Math.ceil(totalStores / limit)} className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2">Next</button>
      </div>

      {page < Math.ceil(totalStores / limit) && (
        <div className="mt-6 flex justify-center">
          <button onClick={handleLoadMore} className="px-4 py-2 bg-blue-500 text-white rounded-md">Load More</button>
        </div>
      )}
    </div>
  );
};

export default AllStores;

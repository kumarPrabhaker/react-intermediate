import React, { useEffect, useState } from "react";

const Categories = ({ className }) => {
  const [list, setList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15); 
  const [allCategories, setAllCategories] = useState([]); 
  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((response) => response.json())
      .then((data) => {
        setAllCategories(data); 
        setList(data.slice(0, visibleCount)); 
      });
  }, [visibleCount]);

  const handleLoadMore = () => {
    const nextVisibleCount = visibleCount + 10; 
    setVisibleCount(nextVisibleCount);
    setList(allCategories.slice(0, nextVisibleCount)); 
  };

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

      {visibleCount < allCategories.length && (
        <button
          onClick={handleLoadMore}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Categories;




import React, { useState } from "react";

const SearchFilter = ({ data, onFilter }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    const filtered = data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(value.toLowerCase())
      )
    );
    onFilter(filtered);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Ara / Filtrele..."
      style={{padding:'0.5rem 1rem',borderRadius:8,border:'1px solid #ccc',marginBottom:16,width:'100%'}}
    />
  );
};

export default SearchFilter;

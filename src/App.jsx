import React, { useState, useEffect } from "react";
import "./index.css";
export const App = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({title: "",brand: "",price: "",rating: "",thumbnail: "",description: "",stock: ""});
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products/category/smartphones");
        const result = await response.json();
        if (!response.ok) {throw new Error("API Error");
        }
        setData(result.products || []);
      } 
      catch (error) {
        console.error("Error fetching smartphones:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, []);
  const addProduct = () => {
    if (
      !form.title.trim() ||
      !form.brand.trim() ||
      !form.price ||
      !form.thumbnail.trim()
    ) {
      alert("Please fill in the required fields");
      return;
    }
    const newProduct = {
      id: data.length? Math.max(...data.map((item) => item.id)) + 1: 1,
      title: form.title.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      rating: Number(form.rating) || 0,
      thumbnail: form.thumbnail.trim(),
      description: form.description.trim(),
      category: "smartphones",
      stock: Number(form.stock) || 0
    };
    setData((prevData) => [...prevData, newProduct]);
    setForm({title: "",brand: "",price: "",rating: "",thumbnail: "",description: "",stock: ""});
    setSearch("");
    setPage(Math.ceil((data.length + 1) / 6));
    setShowForm(false);
    alert("Product added successfully!");
  };
  const productsPerPage = 6;
  const filteredData = data.filter((items) =>
    items.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / productsPerPage);
  const lastIndex = page * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;
  const currentProducts = filteredData.slice(firstIndex, lastIndex);
  return (
    <div className="main">
      <h1>Smartphone Collection</h1>

      <div className="search">
        <button
          onClick={() => setShowForm(!showForm)}
          className="add">
          {showForm ? "Close Form ✕" : "+ Add Product"}
        </button>
        <input
          type="text"
          placeholder="Search smartphones by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {showForm && (
        <div className="add-quote">
          <h2>Add New Smartphone</h2>

          <input
            type="text"
            placeholder="Enter product name"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }/>

          <input
            type="text"
            placeholder="Enter brand"
            value={form.brand}
            onChange={(e) =>
              setForm({ ...form, brand: e.target.value })
            }/>

          <input
            type="number"
            placeholder="Enter price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }/>

          <input
            type="number"
            placeholder="Enter rating"
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: e.target.value })
            }/>

          <input
            type="text"
            placeholder="Enter image URL"
            value={form.thumbnail}
            onChange={(e) =>
              setForm({ ...form, thumbnail: e.target.value })
            }/>

          <input
            type="text"
            placeholder="Enter description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }/>

          <input
            type="number"
            placeholder="Enter stock"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }/>
            <button onClick={addProduct}>Add Product</button>
            </div>
          )}
      {selected && (
        <div className="details">
          <button onClick={() => setSelected(null)}>
            ← Back to Products
          </button>

          <h2>{selected.title}</h2>

          <img
            src={selected.thumbnail}
            alt={selected.title}
            className="detail-img"
          />

          <p>
            <span className="genre">Brand: </span>
            {selected.brand}
          </p>

          <p>
            <span className="genre">Price: </span>
            ${selected.price}
          </p>

          <p>
            <span className="genre">Rating: </span>
            {selected.rating}
          </p>

          <p>
            <span className="genre">Category: </span>
            {selected.category}
          </p>

          <p>
            <span className="genre">Description: </span>
            {selected.description}
          </p>

          <p>
            <span className="genre">Stock: </span>
            {selected.stock}
          </p>
        </div>
      )}
      {!selected && (
        <>
          <div className="container">
            {loading ? (
              <div className="loader-container">
                <div className="loader"></div>
                <p>Loading smartphones...</p>
              </div>
            ) : error ? (
              <p className="no-results">
                Something went wrong!
              </p>
            ) : filteredData.length === 0 ? (
              <p className="no-results">
                No smartphones found!
              </p>
            ) : (
              currentProducts.map((items) => (
                <div className="card" key={items.id}>
                  <h2>{items.title}</h2>

                  <img
                    src={items.thumbnail}
                    alt={items.title}
                    className="img"
                  />

                  <h3>
                    <span className="genre">Brand: </span>
                    {items.brand}
                  </h3>

                  <h3>
                    <span className="genre">Price: </span>
                    ${items.price}
                  </h3>

                  <h3>
                    <span className="genre">Rating: </span>
                    {items.rating}
                  </h3>

                  <button onClick={() => setSelected(items)}>
                    View Product
                  </button>
                </div>
              ))
            )}
          </div>

          {!loading && !error && totalPages > 0 && (
            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >← Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={page === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default App;

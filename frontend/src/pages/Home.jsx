import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../services/productService";

function Home() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingId) {
      await updateProduct(editingId, {
        name,
        price: Number(price),
        description,
      });

      setEditingId(null);
    } else {
      await addProduct({
        name,
        price: Number(price),
        description,
      });
    }

    setName("");
    setPrice("");
    setDescription("");

    fetchProducts();
  } catch (error) {
    console.error(error);
  }
};

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  const handleEdit = (product) => {
  setEditingId(product._id);

  setName(product.name);
  setPrice(product.price);
  setDescription(product.description);
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Management</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
  {editingId ? "Update Product" : "Add Product"}
</button>
      </form>

      <hr />

      <h3>Products</h3>

      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <strong>{product.name}</strong>

            <br />

            Price: ₹{product.price}

            <br />

            Description: {product.description}

            <br />
            <br />

            <button onClick={() => handleEdit(product)}>
  Edit
</button>

{" "}

<button onClick={() => handleDelete(product._id)}>
  Delete
</button>

            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
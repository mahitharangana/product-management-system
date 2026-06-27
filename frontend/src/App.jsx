import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import NotFound from "./pages/NotFound";

function App() {
  const [productCount, setProductCount] = useState(0);

  return (
    <div className="app-shell">
      <Navbar productCount={productCount} />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onCountChange={setProductCount}
              />
            }
          />
          <Route
            path="/add-product"
            element={<AddProduct onProductAdded={() => {}} />}
          />
          <Route
            path="/edit-product/:id"
            element={<EditProduct onProductUpdated={() => {}} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
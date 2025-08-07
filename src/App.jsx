import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/mainlayou.jsx";
import Home from "./pages/homepage/home.jsx";
import AdminLayout from "./pages/admin/adminlayout.jsx";
import NewArrival from "./pages/admin/product/newarrival/newarrival.jsx";
import TopSellers from "./pages/admin/product/topsellers/topsllers.jsx";
import BrowseStyle from "./pages/admin/product/Browsebydressstyle/dressstyle.jsx";
import Product from "./pages/product/product";
import ProductDetails from "./pages/product-details/ProductDetails";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="product" element={<Product />} />
          <Route path="product/:id" element={<ProductDetails />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div>Admin Dashboard Content</div>} />
          <Route path="newarrival" element={<NewArrival />} />
          <Route path="topsellers" element={<TopSellers />} />
          <Route path="browsestyle" element={<BrowseStyle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

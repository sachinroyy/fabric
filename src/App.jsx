import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext.jsx';
import MainLayout from "./layout/mainlayou.jsx";
import Home from "./pages/homepage/home.jsx";
import AdminLayout from "./pages/admin/adminlayout.jsx";
import NewArrival from "./pages/admin/product/newarrival/newarrival.jsx";
import TopSellers from "./pages/admin/product/topsellers/topsllers.jsx";
import BrowseStyle from "./pages/admin/product/Browsebydressstyle/dressstyle.jsx";
import Product from "./pages/product/product";
import ProductDetails from "./pages/product-details/ProductDetails";
import DressStyle from "./pages/Dressstyle/dreshstyle";
import DressStyleDetails from "./pages/Dressstyle/details";
import Topsellers from "./pages/topsellers/topsellers";
import TopsellerDetails from "./pages/topsellers/topsellerdetails.jsx";
import SignIn from "./pages/sigin/singin";
import Cart from "./pages/cart/Cart.jsx";

function App() {
  return (
    <GoogleOAuthProvider clientId="330609866345-0tir9es9jgovag6nrl221kl2mdrl6r0b.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="product" element={<Product />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="dressstyle" element={<DressStyle />} />
                <Route path="dressstyle/:id" element={<DressStyleDetails />} />
                <Route path="topsellers" element={<Topsellers />} />
                <Route path="topsellers/:id" element={<TopsellerDetails />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="cart" element={<Cart />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<div>Admin Dashboard Content</div>} />
                <Route path="newarrival" element={<NewArrival />} />
                <Route path="topsellers" element={<TopSellers />} />
                <Route path="browsestyle" element={<BrowseStyle />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

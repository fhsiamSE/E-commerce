import { Routes, Route } from 'react-router-dom'
import Home from './pages/users/landingPage/Home'
import AllProducts from './pages/users/product/AllProducts'
import Header from './components/Header'
import Footer from './components/Footer'
import ContactUs from './pages/users/companyInfo/ContactUs'
import Profile from './pages/users/user/Profile'
import WishList from './pages/users/product/WishList'
import Cart from './pages/users/product/Cart'

function App() {
  return (
    <div className="flex flex-col min-h-screen mt-18">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

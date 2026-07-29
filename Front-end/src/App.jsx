import { Routes, Route } from 'react-router-dom'
import Home from './pages/users/landingPage/Home'
import AllProducts from './pages/users/product/AllProducts'
import Header from './components/Header'
import Footer from './components/Footer'
import ContactUs from './pages/users/companyInfo/ContactUs'

function App() {
  return (
    <div className="flex flex-col min-h-screen mt-18">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

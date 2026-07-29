import { Routes, Route } from 'react-router-dom'
import Home from './pages/users/landingPage/Home'
import AllProducts from './pages/users/product/AllProducts'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

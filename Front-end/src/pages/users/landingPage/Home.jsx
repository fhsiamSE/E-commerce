import { useState } from 'react'
import CategoryBar from '../../../components/CategoryBar'
import Product from '../../../components/product'
import Banner from '../../../components/Banner'
import Review from '../../../components/ReviewSlider'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen from-white to-gray-200 bg-gradient-to-b">
    <div className="container mx-auto px-4 py-8">
      <Banner />
      <CategoryBar />
      <Product productType="New products" tag="New Product"/>
      <Product productType="Popular Items" tag="Popular"/>
      <Product productType="Best Sellers" tag="Best Seller"/>
      <Review />
    </div>
    </div>
  )
}

export default Home

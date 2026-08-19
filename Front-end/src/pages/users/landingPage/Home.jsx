import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CategoryBar from "../../../components/CategoryBar";
import Product from "../../../components/product";
import Banner from "../../../components/Banner";
import Review from "../../../components/ReviewSlider";

import { getHomeData } from "../../../store/homeSlice";

function Home() {
  const dispatch = useDispatch();

  const {
    newProducts,
    popularProducts,
    topSellingProducts,
    loading,
    error,
  } = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(getHomeData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          {error?.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-white to-gray-200 bg-gradient-to-b">

      <div className="container mx-auto px-4 py-8">

        <Banner />

        <CategoryBar />


        {/* =====================================
            NEW PRODUCTS
            Maximum 10
            5 products per screen
        ====================================== */}
        <Product
          productType="New Products"
          products={newProducts}
          slider={true}
          limit={10}
        />


        {/* =====================================
            POPULAR PRODUCTS
        ====================================== */}
        <Product
          productType="Popular Products"
          products={popularProducts}
          slider={true}
          limit={10}
        />


        {/* =====================================
            TOP SELLING PRODUCTS
        ====================================== */}
        <Product
          productType="Top Selling"
          products={topSellingProducts}
          slider={true}
          limit={10}
        />


        <Review />

      </div>

    </div>
  );
}

export default Home;
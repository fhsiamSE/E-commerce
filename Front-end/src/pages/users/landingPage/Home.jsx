import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CategoryBar from "../../../components/user/CategoryBar";
import CountryFilter from "../../../components/user/CountryFilter";
import Product from "../../../components/user/product";
import Banner from "../../../components/user/Banner";
import Review from "../../../components/user/ReviewSlider";
import Loader from "../../../components/Loader.jsx";

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

  return (
    <div className="min-h-screen from-white to-gray-200 bg-gradient-to-b">

      <div className="container mx-auto px-4 py-8">

        <Banner />

        <CategoryBar />

        <CountryFilter />

        {loading && (
          <Loader
            fullScreen={false}
            size={48}
            className="min-h-28"
            label="Loading products..."
          />
        )}

        {error && (
          <p className="py-6 text-center text-sm text-red-500">
            {error?.message || "Unable to load products right now."}
          </p>
        )}


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


        {/* <Review /> */}

      </div>

    </div>
  );
}

export default Home;
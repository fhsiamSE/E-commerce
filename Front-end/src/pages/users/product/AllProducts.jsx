import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Product from "../../../components/product";
import { getProducts } from "../../../store/productSlice";

function AllProducts() {
  const dispatch = useDispatch();

  const {
    products,
    loading,
    error,
  } = useSelector((state) => state.product);

  /*
  |--------------------------------------------------------------------------
  | Get All Products
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-600">
          Loading products...
        </p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-red-600">
          Failed to load products.
        </p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Products
  |--------------------------------------------------------------------------
  */

  return (
    <Product
      products={products}
      productType="All Products"
      slider={false}
    />
  );
}

export default AllProducts;
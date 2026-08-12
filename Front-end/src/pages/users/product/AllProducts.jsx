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

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p>Failed to load products.</p>
      </div>
    );
  }

  return (
    <Product
      products={products}
      productType="All Products"
    />
  );
}

export default AllProducts;
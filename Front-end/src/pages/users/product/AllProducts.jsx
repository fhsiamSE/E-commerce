import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import Product from "../../../components/user/product";
import { getProducts } from "../../../store/productSlice";

function AllProducts() {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    products,
    loading,
    error,
    currentPage,
    lastPage,
  } = useSelector((state) => state.product);

  const activeSearch =
    new URLSearchParams(location.search).get("search") || "";

  /*
  |--------------------------------------------------------------------------
  | Get Products
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(
      getProducts({
        page: 1,
        search: activeSearch,
      })
    );
  }, [dispatch, activeSearch]);

  /*
  |--------------------------------------------------------------------------
  | Change Page
  |--------------------------------------------------------------------------
  */

  const handlePageChange = (page) => {
    if (page < 1 || page > lastPage || loading) {
      return;
    }

    dispatch(
      getProducts({
        page,
        search: activeSearch,
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading && products.length === 0) {
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

  if (error && products.length === 0) {
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
    <>
      <Product
        products={products}
        productType="All Products"
        slider={false}
      />

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 py-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="rounded border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: lastPage }, (_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={loading}
                className={`rounded border px-3 py-2 text-sm ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === lastPage || loading}
            className="rounded border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default AllProducts;
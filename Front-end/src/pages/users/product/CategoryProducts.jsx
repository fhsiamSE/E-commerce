import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Product from "../../../components/product";
import api from "../../../api/axios.js";

function CategoryProducts() {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Category Name
  |--------------------------------------------------------------------------
  */

  const categoryName = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Products";

  /*
  |--------------------------------------------------------------------------
  | Get Category Products
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const getCategoryProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products", {
          params: {
            category: category,
          },
        });

        console.log("Category products response:", response.data);

        const productData =
          response.data?.data ||
          response.data?.products ||
          response.data ||
          [];

        setProducts(
          Array.isArray(productData)
            ? productData
            : []
        );
      } catch (error) {
        console.error("Category products error:", error);

        setError(
          error?.response?.data?.message ||
            "Unable to load products."
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      getCategoryProducts();
    }
  }, [category]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl">

          {/* Page Header */}

          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-200" />
          </div>

          {/* Product Skeleton */}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">

            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4"
              >

                {/* Image */}

                <div className="aspect-square w-full animate-pulse rounded-xl bg-gray-200" />

                {/* Name */}

                <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-gray-200" />

                {/* Description */}

                <div className="mt-2 h-3 w-full animate-pulse rounded bg-gray-200" />

                <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-gray-200" />

                {/* Price */}

                <div className="mt-4 h-5 w-20 animate-pulse rounded bg-gray-200" />

                {/* Button */}

                <div className="mt-4 h-8 w-full animate-pulse rounded-full bg-gray-200" />

              </div>
            ))}

          </div>
        </div>
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
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-2xl">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

            <div className="text-4xl">
              ⚠️
            </div>

            <h1 className="mt-4 text-xl font-semibold text-red-800">
              Something went wrong
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

          </div>

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | No Products
  |--------------------------------------------------------------------------
  */

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-2xl">

          <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-200">

            <div className="text-5xl">
              🛍️
            </div>

            <h1 className="mt-5 text-2xl font-semibold text-gray-900">
              No Products Found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              There are currently no products available in the{" "}
              <span className="font-semibold">
                {categoryName}
              </span>{" "}
              category.
            </p>

          </div>

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Products
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-white">

      <Product
        products={products}
        productType={`${categoryName} Products`}
        slider={false}
      />

    </div>
  );
}

export default CategoryProducts;
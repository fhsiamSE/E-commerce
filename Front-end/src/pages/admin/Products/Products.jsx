import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getAdminProducts,
  deleteAdminProduct,
  clearAdminProductError,
  clearDeleteProductError,
} from "../../../store/admin/adminProductSlice";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    products,
    pagination,
    statistics,
    loading,
    deleteLoading,
    error,
    deleteError,
  } = useSelector((state) => state.adminProducts);

  // --------------------------------------------------
  // Local States
  // --------------------------------------------------

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [sort, setSort] = useState("latest");

  const [deleteId, setDeleteId] = useState(null);

  // --------------------------------------------------
  // Initial Fetch
  // --------------------------------------------------

  useEffect(() => {
    dispatch(
      getAdminProducts({
        page: 1,
        per_page: 10,
      })
    );
  }, [dispatch]);

  // --------------------------------------------------
  // Fetch Products
  // --------------------------------------------------

  const fetchProducts = (extraParams = {}) => {
    dispatch(
      getAdminProducts({
        page: extraParams.page || 1,
        per_page: 10,

        search,
        category,
        stock,
        sort,

        ...extraParams,
      })
    );
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const handleSearch = (e) => {
    e.preventDefault();

    fetchProducts({
      page: 1,
    });
  };

  // --------------------------------------------------
  // Category Filter
  // --------------------------------------------------

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setCategory(value);

    dispatch(
      getAdminProducts({
        page: 1,
        per_page: 10,

        search,
        category: value,
        stock,
        sort,
      })
    );
  };

  // --------------------------------------------------
  // Stock Filter
  // --------------------------------------------------

  const handleStockChange = (e) => {
    const value = e.target.value;

    setStock(value);

    dispatch(
      getAdminProducts({
        page: 1,
        per_page: 10,

        search,
        category,
        stock: value,
        sort,
      })
    );
  };

  // --------------------------------------------------
  // Sort
  // --------------------------------------------------

  const handleSortChange = (e) => {
    const value = e.target.value;

    setSort(value);

    dispatch(
      getAdminProducts({
        page: 1,
        per_page: 10,

        search,
        category,
        stock,
        sort: value,
      })
    );
  };

  // --------------------------------------------------
  // Clear Filters
  // --------------------------------------------------

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setStock("");
    setSort("latest");

    dispatch(
      getAdminProducts({
        page: 1,
        per_page: 10,
      })
    );
  };

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > pagination.last_page ||
      loading
    ) {
      return;
    }

    fetchProducts({
      page,
    });
  };

  // --------------------------------------------------
  // Delete Product
  // --------------------------------------------------

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const result = await dispatch(
        deleteAdminProduct(deleteId)
      );

      if (deleteAdminProduct.fulfilled.match(result)) {
        setDeleteId(null);

        // If current page has only one product
        // and it is not the first page,
        // go to previous page.
        if (
          products.length === 1 &&
          pagination.current_page > 1
        ) {
          fetchProducts({
            page: pagination.current_page - 1,
          });
        } else {
          // Otherwise refresh current page
          fetchProducts({
            page: pagination.current_page,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --------------------------------------------------
  // Product Image
  // --------------------------------------------------

  const getProductImage = (product) => {
    if (
      product?.images &&
      product.images.length > 0
    ) {
      const image = product.images[0];

      if (typeof image === "string") {
        if (image.startsWith("http")) {
          return image;
        }

        return `http://127.0.0.1:8000/storage/${image}`;
      }

      if (image?.image) {
        if (image.image.startsWith("http")) {
          return image.image;
        }

        return `http://127.0.0.1:8000/storage/${image.image}`;
      }
    }

    return "https://via.placeholder.com/80";
  };

  // --------------------------------------------------
  // Stock Status
  // --------------------------------------------------

  const getStockStatus = (stockValue) => {
    const stockNumber = Number(stockValue || 0);

    if (stockNumber <= 0) {
      return {
        text: "Out of stock",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
    }

    if (stockNumber <= 5) {
      return {
        text: "Low stock",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      };
    }

    return {
      text: "In stock",
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
  };

  // --------------------------------------------------
  // Global Statistics
  // --------------------------------------------------

  const totalProducts =
    statistics?.total_products ?? 0;

  const inStockProducts =
    statistics?.in_stock_products ?? 0;

  const outOfStockProducts =
    statistics?.out_of_stock_products ?? 0;

  const totalStock =
    statistics?.total_stock ?? 0;

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 dark:text-gray-300">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your store products
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/admin/products/add")
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <span className="text-lg">+</span>
          Add Product
        </button>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">

          <span>{error}</span>

          <button
            onClick={() =>
              dispatch(clearAdminProductError())
            }
            className="font-medium hover:underline"
          >
            Close
          </button>
        </div>
      )}

      {/* ==================================================
          DELETE ERROR
      ================================================== */}

      {deleteError && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">

          <span>{deleteError}</span>

          <button
            onClick={() =>
              dispatch(clearDeleteProductError())
            }
            className="font-medium hover:underline"
          >
            Close
          </button>
        </div>
      )}

      {/* ==================================================
          STATISTICS
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Products */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Products
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {totalProducts}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-xl dark:bg-blue-900/30">
              📦
            </div>

          </div>
        </div>

        {/* In Stock */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                In Stock
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {inStockProducts}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-xl dark:bg-green-900/30">
              ✓
            </div>

          </div>
        </div>

        {/* Out Of Stock */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Out of Stock
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {outOfStockProducts}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-xl dark:bg-red-900/30">
              !
            </div>

          </div>
        </div>

        {/* Total Stock */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Stock
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {totalStock}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-xl dark:bg-purple-900/30">
              📊
            </div>

          </div>
        </div>

      </div>

      {/* ==================================================
          FILTERS
      ================================================== */}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* Search */}

          <form
            onSubmit={handleSearch}
            className="lg:col-span-1"
          >
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>

            <div className="flex">

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white"
              />

              <button
                type="submit"
                className="ml-2 rounded-lg bg-gray-900 px-4 text-white transition hover:bg-black dark:bg-white dark:text-black"
              >
                🔍
              </button>

            </div>
          </form>

          {/* Category */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>

            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white"
            >
              <option value="">
                All Categories
              </option>

              <option value="Men">
                Men
              </option>

              <option value="Woman">
                Woman
              </option>

              <option value="Kids">
                Kids
              </option>

              <option value="Accessories">
                Accessories
              </option>
            </select>
          </div>

          {/* Stock */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Stock
            </label>

            <select
              value={stock}
              onChange={handleStockChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white"
            >
              <option value="">
                All Stock
              </option>

              <option value="in_stock">
                In Stock
              </option>

              <option value="low_stock">
                Low Stock
              </option>

              <option value="out_of_stock">
                Out of Stock
              </option>
            </select>
          </div>

          {/* Sort */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort By
            </label>

            <select
              value={sort}
              onChange={handleSortChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white"
            >
              <option value="latest">
                Latest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="price_low">
                Price: Low to High
              </option>

              <option value="price_high">
                Price: High to Low
              </option>

              <option value="popular">
                Most Viewed
              </option>

              <option value="sales">
                Best Selling
              </option>
            </select>
          </div>

        </div>

        {/* Clear Filters */}

        {(search ||
          category ||
          stock ||
          sort !== "latest") && (
          <div className="mt-4 flex justify-end">

            <button
              onClick={handleClearFilters}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Clear Filters
            </button>

          </div>
        )}

      </div>

      {/* ==================================================
          PRODUCTS TABLE
      ================================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        {/* Table Header */}

        <div className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Product List
            </h2>

            {pagination?.total > 0 && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Showing{" "}
                {pagination.from || 0}-
                {pagination.to || 0} of{" "}
                {pagination.total} products
              </p>
            )}
          </div>

          {loading && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </span>
          )}

        </div>

        {/* Desktop Table */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full text-left">

            <thead className="bg-gray-50 dark:bg-gray-800/50">

              <tr>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Product
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Category
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Price
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Stock
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">

              {products.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No products found.
                  </td>
                </tr>

              ) : (

                products.map((product) => {

                  const stockStatus =
                    getStockStatus(product.stock);

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >

                      {/* Product */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-4">

                          <img
                            src={getProductImage(product)}
                            alt={
                              product.product_name
                            }
                            className="h-14 w-14 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/80";
                            }}
                          />

                          <div className="min-w-0">

                            <p className="truncate font-medium text-gray-900 dark:text-white">
                              {product.product_name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              ID: #{product.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Category */}

                      <td className="px-5 py-4">

                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {product.category ||
                            "Uncategorized"}
                        </span>

                      </td>

                      {/* Price */}

                      <td className="px-5 py-4">

                        <span className="font-medium text-gray-900 dark:text-white">
                          ৳{" "}
                          {Number(
                            product.price || 0
                          ).toLocaleString()}
                        </span>

                      </td>

                      {/* Stock */}

                      <td className="px-5 py-4">

                        <div className="flex flex-col items-start gap-1">

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${stockStatus.className}`}
                          >
                            {stockStatus.text}
                          </span>

                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {Number(
                              product.stock || 0
                            )}{" "}
                            units
                          </span>

                        </div>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              navigate(
                                `/admin/products/edit/${product.id}`
                              )
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              setDeleteId(product.id)
                            }
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

        {/* ==================================================
            MOBILE PRODUCT CARDS
        ================================================== */}

        <div className="divide-y divide-gray-200 md:hidden dark:divide-gray-800">

          {products.length === 0 ? (

            <div className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No products found.
            </div>

          ) : (

            products.map((product) => {

              const stockStatus =
                getStockStatus(product.stock);

              return (
                <div
                  key={product.id}
                  className="p-4"
                >

                  <div className="flex gap-4">

                    <img
                      src={getProductImage(product)}
                      alt={product.product_name}
                      className="h-20 w-20 flex-shrink-0 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/80";
                      }}
                    />

                    <div className="min-w-0 flex-1">

                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {product.product_name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        ID: #{product.id}
                      </p>

                      <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                        ৳{" "}
                        {Number(
                          product.price || 0
                        ).toLocaleString()}
                      </p>

                      <div className="mt-2 flex items-center gap-2">

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${stockStatus.className}`}
                        >
                          {stockStatus.text}
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {Number(
                            product.stock || 0
                          )}{" "}
                          units
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Mobile Actions */}

                  <div className="mt-4 grid grid-cols-3 gap-2">

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/products/edit/${product.id}`
                        )
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setDeleteId(product.id)
                      }
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              );
            })

          )}

        </div>

        {/* ==================================================
            PAGINATION
        ================================================== */}

        {pagination &&
          pagination.last_page > 1 && (
            <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {pagination.current_page}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {pagination.last_page}
                </span>
              </p>

              <div className="flex items-center gap-1">

                {/* Previous */}

                <button
                  onClick={() =>
                    handlePageChange(
                      pagination.current_page - 1
                    )
                  }
                  disabled={
                    pagination.current_page <= 1 ||
                    loading
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Previous
                </button>

                {/* Page Numbers */}

                {Array.from(
                  {
                    length:
                      pagination.last_page,
                  },
                  (_, index) => index + 1
                )
                  .filter((page) => {

                    const current =
                      pagination.current_page;

                    const last =
                      pagination.last_page;

                    return (
                      page === 1 ||
                      page === last ||
                      Math.abs(
                        page - current
                      ) <= 1
                    );
                  })
                  .map((page, index, pages) => {

                    const previousPage =
                      pages[index - 1];

                    const showDots =
                      previousPage &&
                      page - previousPage > 1;

                    return (
                      <div
                        key={page}
                        className="flex items-center gap-1"
                      >

                        {showDots && (
                          <span className="px-1 text-gray-400">
                            ...
                          </span>
                        )}

                        <button
                          onClick={() =>
                            handlePageChange(page)
                          }
                          disabled={loading}
                          className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium transition ${
                            page ===
                            pagination.current_page
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                          }`}
                        >
                          {page}
                        </button>

                      </div>
                    );
                  })}

                {/* Next */}

                <button
                  onClick={() =>
                    handlePageChange(
                      pagination.current_page + 1
                    )
                  }
                  disabled={
                    pagination.current_page >=
                      pagination.last_page ||
                    loading
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Next
                </button>

              </div>
            </div>
          )}

      </div>

      {/* ==================================================
          DELETE CONFIRMATION MODAL
      ================================================== */}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Product
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this
              product? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setDeleteId(null)}
                disabled={deleteLoading}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Delete Product"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Products;
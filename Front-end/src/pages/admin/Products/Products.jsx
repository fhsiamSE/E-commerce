import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Demo Products
  |--------------------------------------------------------------------------
  | Later we will replace this with Laravel API data.
  */

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      category: "Men",
      price: 1200,
      stock: 37,
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
    },
    {
      id: 2,
      name: "Classic Hoodie",
      category: "Men",
      price: 2200,
      stock: 12,
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300",
    },
    {
      id: 3,
      name: "Party Silk Saree",
      category: "Women",
      price: 4500,
      stock: 8,
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300",
    },
    {
      id: 4,
      name: "Oversized Graphic Shirt",
      category: "Men",
      price: 1500,
      stock: 0,
      status: "Out of Stock",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300",
    },
    {
      id: 5,
      name: "Stretch Skirt",
      category: "Women",
      price: 1800,
      stock: 24,
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=300",
    },
    {
      id: 6,
      name: "Classic Sneakers",
      category: "Shoes",
      price: 3200,
      stock: 15,
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
    },
    {
      id: 7,
      name: "Leather Handbag",
      category: "Accessories",
      price: 2800,
      stock: 6,
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300",
    },
    {
      id: 8,
      name: "Classic Wrist Watch",
      category: "Accessories",
      price: 5500,
      stock: 0,
      status: "Out of Stock",
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300",
    },
  ]);

  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = (id) => {
    const product = products.find((item) => item.id === id);

    if (!product) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setProducts((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(products.map((product) => product.category)),
    ];
  }, [products]);

  /*
  |--------------------------------------------------------------------------
  | Filter Products
  |--------------------------------------------------------------------------
  */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.category
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" && product.stock > 0) ||
        (stockFilter === "Out of Stock" &&
          product.stock === 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock
      );
    });
  }, [products, search, category, stockFilter]);

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.stock > 0
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.stock === 0
  ).length;

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-900 transition-colors dark:bg-gray-950 dark:text-white sm:p-6 lg:p-8">

      {/* =========================================================
          PAGE HEADER
      ========================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your store products
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/products/add")
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <span className="text-lg leading-none">
            +
          </span>

          Add Product
        </button>

      </div>

      {/* =========================================================
          STATISTICS
      ========================================================== */}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

        {/* Total */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Products
              </p>

              <p className="mt-2 text-2xl font-bold">
                {totalProducts}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-xl dark:bg-gray-800">
              📦
            </div>

          </div>

        </div>

        {/* Active */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                In Stock
              </p>

              <p className="mt-2 text-2xl font-bold">
                {activeProducts}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-xl dark:bg-green-900/20">
              ✓
            </div>

          </div>

        </div>

        {/* Out of Stock */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Out of Stock
              </p>

              <p className="mt-2 text-2xl font-bold">
                {outOfStockProducts}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-xl dark:bg-red-900/20">
              !
            </div>

          </div>

        </div>

        {/* Stock */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Stock
              </p>

              <p className="mt-2 text-2xl font-bold">
                {totalStock}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl dark:bg-blue-900/20">
              📊
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================
          PRODUCT TABLE CARD
      ========================================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        {/* =======================================================
            FILTER HEADER
        ======================================================== */}

        <div className="border-b border-gray-200 p-4 dark:border-gray-800 sm:p-5">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}

            <div className="relative w-full lg:max-w-md">

              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white"
              />

            </div>

            {/* Filters */}

            <div className="grid grid-cols-2 gap-3 sm:flex">

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={stockFilter}
                onChange={(event) =>
                  setStockFilter(event.target.value)
                }
                className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              >
                <option value="All">
                  All Stock
                </option>

                <option value="In Stock">
                  In Stock
                </option>

                <option value="Out of Stock">
                  Out of Stock
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* =======================================================
            DESKTOP TABLE
        ======================================================== */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full text-left">

            <thead className="bg-gray-50 dark:bg-gray-950">

              <tr className="border-b border-gray-200 dark:border-gray-800">

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Product
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Category
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Price
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Stock
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-16 text-center text-sm text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>

              ) : (

                filteredProducts.map((product) => (

                  <tr
                    key={product.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >

                    {/* Product */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            ID: #{product.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Category */}

                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {product.category}
                    </td>

                    {/* Price */}

                    <td className="px-5 py-4 text-sm font-medium">
                      ৳{Number(product.price).toFixed(2)}
                    </td>

                    {/* Stock */}

                    <td className="px-5 py-4 text-sm">
                      {product.stock}
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">

                      {product.stock > 0 ? (

                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>

                      ) : (

                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Out of Stock
                        </span>

                      )}

                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/products/edit/${product.id}`
                            )
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product.id)
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* =======================================================
            MOBILE PRODUCTS
        ======================================================== */}

        <div className="divide-y divide-gray-200 md:hidden dark:divide-gray-800">

          {filteredProducts.length === 0 ? (

            <div className="px-5 py-16 text-center text-sm text-gray-500">
              No products found.
            </div>

          ) : (

            filteredProducts.map((product) => (

              <div
                key={product.id}
                className="p-4"
              >

                <div className="flex gap-3">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <h3 className="truncate text-sm font-semibold">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {product.category}
                        </p>

                      </div>

                      {product.stock > 0 ? (

                        <span className="flex-shrink-0 rounded-full bg-green-100 px-2 py-1 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>

                      ) : (

                        <span className="flex-shrink-0 rounded-full bg-red-100 px-2 py-1 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Out
                        </span>

                      )}

                    </div>

                    <div className="mt-3 flex items-center justify-between">

                      <div>

                        <p className="text-sm font-semibold">
                          ৳{Number(product.price).toFixed(2)}
                        </p>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Stock: {product.stock}
                        </p>

                      </div>

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/products/edit/${product.id}`
                            )
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium dark:border-gray-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product.id)
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

        {/* =======================================================
            FOOTER / PAGINATION
        ======================================================== */}

        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 text-sm dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {products.length}
            </span>{" "}
            products
          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-400 dark:border-gray-800"
            >
              Previous
            </button>

            <button
              type="button"
              className="rounded-lg bg-black px-3 py-2 text-xs font-medium text-white dark:bg-white dark:text-black"
            >
              1
            </button>

            <button
              type="button"
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300"
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Products;


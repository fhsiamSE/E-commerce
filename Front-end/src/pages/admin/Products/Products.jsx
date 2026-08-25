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

  /*
  |--------------------------------------------------------------------------
  | REDUX
  |--------------------------------------------------------------------------
  */

  const {
    products,
    pagination,
    loading,
    deleteLoading,
    error,
    deleteError,
  } = useSelector((state) => state.adminProducts);

  /*
  |--------------------------------------------------------------------------
  | LOCAL STATE
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [sort, setSort] = useState("latest");

  const [deleteId, setDeleteId] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | FETCH PRODUCTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(
      getAdminProducts({
        page: 1,
        per_page: 10,
      })
    );
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | FETCH WITH FILTERS
  |--------------------------------------------------------------------------
  */

  const fetchProducts = ({
    newSearch = search,
    newCategory = category,
    newStock = stock,
    newSort = sort,
    page = 1,
  } = {}) => {
    dispatch(
      getAdminProducts({
        search: newSearch || undefined,
        category: newCategory || undefined,
        stock: newStock || undefined,
        sort: newSort || undefined,
        page,
        per_page: 10,
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    fetchProducts({
      page: 1,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | CATEGORY
  |--------------------------------------------------------------------------
  */

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setCategory(value);

    fetchProducts({
      newCategory: value,
      page: 1,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | STOCK
  |--------------------------------------------------------------------------
  */

  const handleStockChange = (e) => {
    const value = e.target.value;

    setStock(value);

    fetchProducts({
      newStock: value,
      page: 1,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | SORT
  |--------------------------------------------------------------------------
  */

  const handleSortChange = (e) => {
    const value = e.target.value;

    setSort(value);

    fetchProducts({
      newSort: value,
      page: 1,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | CLEAR FILTERS
  |--------------------------------------------------------------------------
  */

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setStock("");
    setSort("latest");

    dispatch(
      getAdminProducts({
        page: 1,
        per_page: 10,
        sort: "latest",
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }

    const result = await dispatch(
      deleteAdminProduct(deleteId)
    );

    if (deleteAdminProduct.fulfilled.match(result)) {
      setDeleteId(null);

      /*
      |--------------------------------------------------------------------------
      | If current page becomes empty after deletion,
      | go to previous page.
      |--------------------------------------------------------------------------
      */

      if (
        products.length === 1 &&
        pagination.current_page > 1
      ) {
        fetchProducts({
          page: pagination.current_page - 1,
        });
      } else {
        /*
        |--------------------------------------------------------------------------
        | Refresh current page
        |--------------------------------------------------------------------------
        */

        fetchProducts({
          page: pagination.current_page,
        });
      }
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PRODUCT IMAGE
  |--------------------------------------------------------------------------
  */

  const getProductImage = (product) => {
    const image =
      product?.images?.find(
        (item) => item.is_primary
      ) ||
      product?.images?.[0];

    if (!image?.image) {
      return null;
    }

    if (
      image.image.startsWith("http://") ||
      image.image.startsWith("https://")
    ) {
      return image.image;
    }

    return `http://127.0.0.1:8000/storage/${image.image}`;
  };

  /*
  |--------------------------------------------------------------------------
  | STOCK STATUS
  |--------------------------------------------------------------------------
  */

  const getStockStatus = (stockValue) => {
    if (stockValue <= 0) {
      return {
        text: "Out of stock",
        className:
          "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
      };
    }

    if (stockValue <= 5) {
      return {
        text: "Low stock",
        className:
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
      };
    }

    return {
      text: "In stock",
      className:
        "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400",
    };
  };

  /*
  |--------------------------------------------------------------------------
  | PRODUCT STATISTICS
  |--------------------------------------------------------------------------
  |
  | Total Products uses Laravel pagination total.
  |
  | The other three values are based on the products currently
  | loaded on the page.
  |
  */

  const totalProducts =
    pagination?.total || 0;

  const inStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) > 0
  ).length;

  const outOfStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) <= 0
  ).length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Loading products...
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">

      {/* =========================================================
          PAGE HEADER
      ========================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage all products in your store.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/products/add")
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-black
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-gray-800
            dark:bg-white
            dark:text-black
            dark:hover:bg-gray-200
          "
        >
          <span className="text-lg">
            +
          </span>

          Add Product
        </button>

      </div>


      {/* =========================================================
          PRODUCT STATISTICS
      ========================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        {/* =======================================================
            TOTAL PRODUCTS
        ======================================================== */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Products
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {totalProducts.toLocaleString()}
              </p>

            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-lg
                bg-gray-100
                text-xl
                dark:bg-gray-800
              "
            >
              📦
            </div>

          </div>

        </div>


        {/* =======================================================
            IN STOCK
        ======================================================== */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                In Stock
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {inStockProducts.toLocaleString()}
              </p>

            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-lg
                bg-green-50
                text-xl
                dark:bg-green-950/30
              "
            >
              ✓
            </div>

          </div>

        </div>


        {/* =======================================================
            OUT OF STOCK
        ======================================================== */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Out of Stock
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {outOfStockProducts.toLocaleString()}
              </p>

            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-lg
                bg-red-50
                text-xl
                dark:bg-red-950/30
              "
            >
              !
            </div>

          </div>

        </div>


        {/* =======================================================
            TOTAL STOCK
        ======================================================== */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Stock
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {totalStock.toLocaleString()}
              </p>

            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-lg
                bg-blue-50
                text-xl
                dark:bg-blue-950/30
              "
            >
              📊
            </div>

          </div>

        </div>

      </div>


      {/* =========================================================
          ERROR
      ========================================================== */}

      {error && (
        <div
          className="
            flex
            items-center
            justify-between
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            dark:border-red-900
            dark:bg-red-950/30
          "
        >

          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              dispatch(clearAdminProductError())
            }
            className="
              text-xs
              font-medium
              text-red-600
              hover:underline
              dark:text-red-400
            "
          >
            Close
          </button>

        </div>
      )}


      {/* =========================================================
          DELETE ERROR
      ========================================================== */}

      {deleteError && (
        <div
          className="
            flex
            items-center
            justify-between
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            dark:border-red-900
            dark:bg-red-950/30
          "
        >

          <p className="text-sm text-red-600 dark:text-red-400">
            {deleteError}
          </p>

          <button
            type="button"
            onClick={() =>
              dispatch(clearDeleteProductError())
            }
            className="
              text-xs
              font-medium
              text-red-600
              hover:underline
              dark:text-red-400
            "
          >
            Close
          </button>

        </div>
      )}


      {/* =========================================================
          FILTERS
      ========================================================== */}

      <div
        className="
          rounded-xl
          border
          border-gray-200
          bg-white
          p-4
          dark:border-gray-800
          dark:bg-gray-900
        "
      >

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

          {/* SEARCH */}

          <form
            onSubmit={handleSearchSubmit}
            className="md:col-span-2 xl:col-span-1"
          >

            <div className="relative">

              <span
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              >
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search products..."
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  py-2.5
                  pl-10
                  pr-4
                  text-sm
                  text-gray-900
                  outline-none
                  focus:border-black
                  focus:ring-2
                  focus:ring-black/10
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-white
                  dark:placeholder-gray-500
                  dark:focus:border-white
                "
              />

            </div>

          </form>


          {/* CATEGORY */}

          <select
            value={category}
            onChange={handleCategoryChange}
            className="
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2.5
              text-sm
              text-gray-700
              outline-none
              focus:border-black
              dark:border-gray-700
              dark:bg-gray-800
              dark:text-gray-300
              dark:focus:border-white
            "
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


          {/* STOCK */}

          <select
            value={stock}
            onChange={handleStockChange}
            className="
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2.5
              text-sm
              text-gray-700
              outline-none
              focus:border-black
              dark:border-gray-700
              dark:bg-gray-800
              dark:text-gray-300
              dark:focus:border-white
            "
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


          {/* SORT */}

          <select
            value={sort}
            onChange={handleSortChange}
            className="
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2.5
              text-sm
              text-gray-700
              outline-none
              focus:border-black
              dark:border-gray-700
              dark:bg-gray-800
              dark:text-gray-300
              dark:focus:border-white
            "
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


        {/* CLEAR FILTERS */}

        {(search ||
          category ||
          stock ||
          sort !== "latest") && (
          <div className="mt-3 flex justify-end">

            <button
              type="button"
              onClick={handleClearFilters}
              className="
                text-sm
                font-medium
                text-gray-500
                hover:text-black
                dark:text-gray-400
                dark:hover:text-white
              "
            >
              Clear filters
            </button>

          </div>
        )}

      </div>


      {/* =========================================================
          PRODUCT TABLE
      ========================================================== */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          dark:border-gray-800
          dark:bg-gray-900
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            {/* TABLE HEADER */}

            <thead
              className="
                border-b
                border-gray-200
                bg-gray-50
                dark:border-gray-800
                dark:bg-gray-800/50
              "
            >

              <tr>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Product
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Category
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Price
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Stock
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Views
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Sales
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Action
                </th>

              </tr>

            </thead>


            {/* TABLE BODY */}

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">

              {products.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="px-5 py-16 text-center"
                  >

                    <div className="text-4xl">
                      🛍️
                    </div>

                    <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                      No products found
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                products.map((product) => {

                  const image =
                    getProductImage(product);

                  const stockStatus =
                    getStockStatus(
                      Number(product.stock || 0)
                    );

                  return (
                    <tr
                      key={product.id}
                      className="
                        transition
                        hover:bg-gray-50
                        dark:hover:bg-gray-800/40
                      "
                    >

                      {/* PRODUCT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              h-14
                              w-14
                              shrink-0
                              overflow-hidden
                              rounded-lg
                              border
                              border-gray-200
                              bg-gray-100
                              dark:border-gray-700
                              dark:bg-gray-800
                            "
                          >

                            {image ? (

                              <img
                                src={image}
                                alt={product.product_name}
                                className="h-full w-full object-cover"
                              />

                            ) : (

                              <div className="flex h-full w-full items-center justify-center text-xl">
                                🛍️
                              </div>

                            )}

                          </div>


                          <div className="min-w-0">

                            <p className="max-w-[220px] truncate text-sm font-semibold text-gray-900 dark:text-white">
                              {product.product_name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              ID: #{product.id}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* CATEGORY */}

                      <td className="px-5 py-4">

                        <span
                          className="
                            rounded-full
                            bg-gray-100
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            text-gray-700
                            dark:bg-gray-800
                            dark:text-gray-300
                          "
                        >
                          {product.category ||
                            "Uncategorized"}
                        </span>

                      </td>


                      {/* PRICE */}

                      <td className="px-5 py-4">

                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ৳
                          {Number(
                            product.price || 0
                          ).toLocaleString()}
                        </span>

                      </td>


                      {/* STOCK */}

                      <td className="px-5 py-4">

                        <div className="flex flex-col items-start gap-1">

                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.stock || 0}
                          </span>

                          <span
                            className={`
                              rounded-full
                              px-2
                              py-0.5
                              text-[10px]
                              font-medium
                              ${stockStatus.className}
                            `}
                          >
                            {stockStatus.text}
                          </span>

                        </div>

                      </td>


                      {/* VIEWS */}

                      <td className="px-5 py-4">

                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {Number(
                            product.views_count || 0
                          ).toLocaleString()}
                        </span>

                      </td>


                      {/* SALES */}

                      <td className="px-5 py-4">

                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {Number(
                            product.sales_count || 0
                          ).toLocaleString()}
                        </span>

                      </td>


                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-end gap-2">

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/products/edit/${product.id}`
                              )
                            }
                            className="
                              rounded-lg
                              border
                              border-gray-200
                              px-3
                              py-1.5
                              text-xs
                              font-medium
                              text-gray-700
                              transition
                              hover:border-gray-400
                              hover:text-black
                              dark:border-gray-700
                              dark:text-gray-300
                              dark:hover:border-gray-500
                              dark:hover:text-white
                            "
                          >
                            Edit
                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteId(product.id)
                            }
                            disabled={deleteLoading}
                            className="
                              rounded-lg
                              border
                              border-red-200
                              px-3
                              py-1.5
                              text-xs
                              font-medium
                              text-red-600
                              transition
                              hover:bg-red-50
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                              dark:border-red-900
                              dark:text-red-400
                              dark:hover:bg-red-950/30
                            "
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


        {/* =========================================================
            PAGINATION
        ========================================================== */}

        {products.length > 0 && (
          <div
            className="
              flex
              flex-col
              gap-3
              border-t
              border-gray-200
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
              dark:border-gray-800
            "
          >

            <p className="text-xs text-gray-500 dark:text-gray-400">

              Showing{" "}

              <span className="font-medium text-gray-700 dark:text-gray-300">
                {pagination.from || 0}
              </span>

              {" "}to{" "}

              <span className="font-medium text-gray-700 dark:text-gray-300">
                {pagination.to || 0}
              </span>

              {" "}of{" "}

              <span className="font-medium text-gray-700 dark:text-gray-300">
                {pagination.total || 0}
              </span>

              {" "}products

            </p>


            <div className="flex items-center gap-1">

              {/* PREVIOUS */}

              <button
                type="button"
                disabled={
                  pagination.current_page <= 1 ||
                  loading
                }
                onClick={() =>
                  handlePageChange(
                    pagination.current_page - 1
                  )
                }
                className="
                  rounded-lg
                  border
                  border-gray-200
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-gray-600
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  dark:border-gray-700
                  dark:text-gray-300
                "
              >
                Previous
              </button>


              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length:
                    pagination.last_page || 1,
                },
                (_, index) => index + 1
              )
                .filter((page) => {

                  const current =
                    pagination.current_page;

                  return (
                    page === 1 ||
                    page ===
                      pagination.last_page ||
                    Math.abs(page - current) <= 1
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
                        type="button"
                        onClick={() =>
                          handlePageChange(page)
                        }
                        disabled={loading}
                        className={`
                          h-8
                          min-w-8
                          rounded-lg
                          px-2
                          text-xs
                          font-medium
                          transition

                          ${
                            page ===
                            pagination.current_page
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                          }
                        `}
                      >
                        {page}
                      </button>

                    </div>
                  );
                })}


              {/* NEXT */}

              <button
                type="button"
                disabled={
                  pagination.current_page >=
                    pagination.last_page ||
                  loading
                }
                onClick={() =>
                  handlePageChange(
                    pagination.current_page + 1
                  )
                }
                className="
                  rounded-lg
                  border
                  border-gray-200
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-gray-600
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  dark:border-gray-700
                  dark:text-gray-300
                "
              >
                Next
              </button>

            </div>

          </div>
        )}

      </div>


      {/* =========================================================
          DELETE MODAL
      ========================================================== */}

      {deleteId && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            px-4
          "
        >

          <div
            className="
              w-full
              max-w-sm
              rounded-2xl
              bg-white
              p-6
              shadow-xl
              dark:bg-gray-900
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-red-50
                text-lg
                dark:bg-red-950/30
              "
            >
              ⚠️
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Delete product?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              This action cannot be undone. The product and
              its related images and variants will be deleted.
            </p>


            <div className="mt-6 flex justify-end gap-3">

              {/* CANCEL */}

              <button
                type="button"
                onClick={() =>
                  setDeleteId(null)
                }
                disabled={deleteLoading}
                className="
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-gray-50
                  disabled:opacity-50
                  dark:border-gray-700
                  dark:text-gray-300
                  dark:hover:bg-gray-800
                "
              >
                Cancel
              </button>


              {/* CONFIRM DELETE */}

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="
                  rounded-lg
                  bg-red-600
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
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
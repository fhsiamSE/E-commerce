import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios.js";

function OrderList() {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Get Orders
  |--------------------------------------------------------------------------
  */

  const getOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      console.log("Orders API response:", response.data);

      const orderData =
        response.data?.data ||
        response.data?.orders ||
        response.data ||
        [];

      setOrders(
        Array.isArray(orderData)
          ? orderData
          : []
      );

    } catch (error) {
      console.error("Get orders error:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to load your orders."
      );

      setOrders([]);

    } finally {
      setLoading(false);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Load Orders
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    getOrders();
  }, []);


  /*
  |--------------------------------------------------------------------------
  | Product Name
  |--------------------------------------------------------------------------
  */

  const getProductName = (item) => {
    return (
      item?.product?.product_name ||
      item?.product?.name ||
      "Product"
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Product Image
  |--------------------------------------------------------------------------
  */

  const getProductImage = (item) => {
    const image =
      item?.product?.images?.[0]?.image_url ||
      item?.product?.images?.[0]?.image ||
      item?.product?.image ||
      null;

    /*
    |--------------------------------------------------------------------------
    | No Image
    |--------------------------------------------------------------------------
    */

    if (!image) {
      return "https://via.placeholder.com/500";
    }


    /*
    |--------------------------------------------------------------------------
    | Already Complete URL
    |--------------------------------------------------------------------------
    */

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }


    /*
    |--------------------------------------------------------------------------
    | Laravel Storage Image
    |--------------------------------------------------------------------------
    */

    return `http://127.0.0.1:8000/storage/${image}`;
  };


  /*
  |--------------------------------------------------------------------------
  | Product Price
  |--------------------------------------------------------------------------
  */

  const getProductPrice = (item) => {
    return Number(item?.price || 0);
  };


  /*
  |--------------------------------------------------------------------------
  | Product Quantity
  |--------------------------------------------------------------------------
  */

  const getProductQuantity = (item) => {
    return Number(item?.quantity || 0);
  };


  /*
  |--------------------------------------------------------------------------
  | Format Currency
  |--------------------------------------------------------------------------
  */

  const formatPrice = (price) => {
    return `$${Number(price || 0).toFixed(2)}`;
  };


  /*
  |--------------------------------------------------------------------------
  | Format Date
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Order Status Style
  |--------------------------------------------------------------------------
  */

  const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {

      case "completed":
        return "bg-green-100 text-green-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-amber-100 text-amber-700";
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-8 pb-16">

        <div className="mx-auto max-w-7xl">

          {/* Header Skeleton */}

          <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">

            <div className="animate-pulse">

              <div className="h-4 w-24 rounded bg-stone-200" />

              <div className="mt-3 h-8 w-64 rounded bg-stone-200" />

              <div className="mt-3 h-4 w-80 max-w-full rounded bg-stone-200" />

            </div>

          </div>


          {/* Order Skeleton */}

          <div className="space-y-6">

            {[1, 2].map((item) => (

              <div
                key={item}
                className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200"
              >

                <div className="animate-pulse">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <div className="h-5 w-32 rounded bg-stone-200" />

                      <div className="mt-2 h-4 w-24 rounded bg-stone-200" />

                    </div>

                    <div className="h-7 w-20 rounded-full bg-stone-200" />

                  </div>


                  <div className="mt-6 space-y-4">

                    {[1, 2].map((product) => (

                      <div
                        key={product}
                        className="flex gap-4"
                      >

                        <div className="h-24 w-24 rounded-2xl bg-stone-200" />

                        <div className="flex-1">

                          <div className="h-5 w-48 rounded bg-stone-200" />

                          <div className="mt-3 h-4 w-20 rounded bg-stone-200" />

                          <div className="mt-3 h-4 w-16 rounded bg-stone-200" />

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 pb-16">

      <div className="mx-auto max-w-7xl">


        {/* =========================================================
            HEADER
        ========================================================== */}

        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm uppercase tracking-[0.35em] text-stone-500">
                Orders
              </p>

              <h1 className="mt-2 text-3xl font-semibold text-stone-900">
                My Orders
              </h1>

              <p className="mt-2 text-sm text-stone-600">
                View your previous orders and their details.
              </p>

            </div>


            {/* Order Count */}

            <span className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700">

              {orders.length}{" "}
              {orders.length === 1
                ? "order"
                : "orders"}

            </span>

          </div>

        </div>


        {/* =========================================================
            ERROR
        ========================================================== */}

        {error && (

          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">

            {error}

          </div>

        )}


        {/* =========================================================
            EMPTY ORDERS
        ========================================================== */}

        {orders.length === 0 ? (

          <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm ring-1 ring-stone-200">

            <div className="text-5xl">
              🛍️
            </div>

            <h2 className="mt-5 text-xl font-semibold text-stone-900">
              No orders yet
            </h2>

            <p className="mt-3 text-sm text-stone-500">
              Your completed orders will appear here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-900"
            >
              Browse Products
            </button>

          </div>

        ) : (

          /* =======================================================
             ORDERS
          ======================================================== */

          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md sm:p-8"
              >

                {/* =================================================
                    ORDER HEADER
                ================================================== */}

                <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-lg font-semibold text-stone-900">
                        Order #{order.id}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>

                    </div>


                    <p className="mt-2 text-sm text-stone-500">

                      Placed on{" "}

                      {formatDate(
                        order.created_at
                      )}

                    </p>

                  </div>


                  {/* Total */}

                  <div className="sm:text-right">

                    <p className="text-xs uppercase tracking-wider text-stone-400">
                      Total
                    </p>

                    <p className="mt-1 text-xl font-bold text-stone-900">
                      {formatPrice(order.total)}
                    </p>

                  </div>

                </div>


                {/* =================================================
                    ORDER ITEMS
                ================================================== */}

                <div className="mt-6 space-y-5">

                  {Array.isArray(order.items) &&
                    order.items.map((item) => (

                      <div
                        key={item.id}
                        className="flex flex-col gap-4 rounded-2xl bg-stone-50 p-4 sm:flex-row sm:items-center"
                      >

                        {/* Product Image */}

                        <img
                          src={getProductImage(item)}
                          alt={getProductName(item)}
                          className="h-28 w-full rounded-2xl object-cover sm:h-24 sm:w-24"
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://via.placeholder.com/500";
                          }}
                        />


                        {/* Product Information */}

                        <div className="min-w-0 flex-1">

                          <h3 className="line-clamp-2 text-base font-semibold text-stone-900">

                            {getProductName(item)}

                          </h3>


                          {/* Variant */}

                          {item?.variant && (

                            <p className="mt-1 text-sm text-stone-500">

                              SKU:{" "}

                              {item.variant.sku ||
                                "N/A"}

                            </p>

                          )}


                          {/* Quantity */}

                          <p className="mt-2 text-sm text-stone-600">

                            Quantity:{" "}

                            <span className="font-semibold text-stone-900">

                              {getProductQuantity(
                                item
                              )}

                            </span>

                          </p>

                        </div>


                        {/* Price */}

                        <div className="sm:text-right">

                          <p className="text-xs uppercase tracking-wider text-stone-400">
                            Price
                          </p>

                          <p className="mt-1 text-base font-semibold text-stone-900">

                            {formatPrice(
                              getProductPrice(
                                item
                              )
                            )}

                          </p>


                          <p className="mt-1 text-xs text-stone-500">

                            {getProductQuantity(
                              item
                            )}{" "}

                            ×{" "}

                            {formatPrice(
                              getProductPrice(
                                item
                              )
                            )}

                          </p>

                        </div>

                      </div>

                    ))}

                </div>


                {/* =================================================
                    ORDER SUMMARY
                ================================================== */}

                <div className="mt-6 border-t border-stone-200 pt-6">

                  <div className="ml-auto w-full max-w-sm space-y-3">

                    {/* Subtotal */}

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-stone-500">
                        Subtotal
                      </span>

                      <span className="font-medium text-stone-900">

                        {formatPrice(
                          order.subtotal
                        )}

                      </span>

                    </div>


                    {/* Shipping */}

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-stone-500">
                        Shipping
                      </span>

                      <span className="font-medium text-stone-900">

                        {formatPrice(
                          order.shipping
                        )}

                      </span>

                    </div>


                    {/* Discount */}

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-stone-500">
                        Discount
                      </span>

                      <span className="font-medium text-green-600">

                        -{formatPrice(
                          order.discount
                        )}

                      </span>

                    </div>


                    {/* Divider */}

                    <div className="border-t border-stone-200 pt-3">


                      {/* Total */}

                      <div className="flex items-center justify-between">

                        <span className="text-base font-semibold text-stone-900">
                          Total
                        </span>

                        <span className="text-xl font-bold text-stone-900">

                          {formatPrice(
                            order.total
                          )}

                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default OrderList;
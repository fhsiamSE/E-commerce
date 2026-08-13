import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  updateCart,
  removeFromCart,
} from "../../../store/cartSlice.js";
import api from "../../../api/axios.js";

function Cart() {
  const dispatch = useDispatch();

  const { items: cartItems, loading, error } = useSelector(
    (state) => state.cart
  );

  const [showCheckout, setShowCheckout] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const getProductName = (item) => {
    return (
      item.product?.product_name ||
      item.product?.name ||
      item.product_name ||
      "Product"
    );
  };

  const getProductImage = (item) => {
    const image =
      item.product?.images?.find((img) => img.is_primary)?.image_url ||
      item.product?.images?.[0]?.image_url ||
      item.product?.images?.[0]?.image ||
      item.image_url ||
      item.image;

    if (!image) {
      return "https://via.placeholder.com/500";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `http://127.0.0.1:8000/storage/${image}`;
  };

  const getProductPrice = (item) => {
    return Number(
      item.variant?.price ||
        item.product?.price ||
        item.price ||
        0
    );
  };

  const getQuantity = (item) => {
    return Number(item.quantity || item.qty || 1);
  };

  const getColor = (item) => {
    return (
      item.variant?.color ||
      item.variant?.color_name ||
      item.color ||
      null
    );
  };

  const getSize = (item) => {
    return (
      item.variant?.size ||
      item.variant?.size_name ||
      item.size ||
      null
    );
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + getProductPrice(item) * getQuantity(item);
  }, 0);

  const shipping = cartItems.length > 0 ? 100 : 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handleIncrease = (item) => {
    dispatch(
      updateCart({
        id: item.id,
        quantity: getQuantity(item) + 1,
      })
    );
  };

  const handleDecrease = (item) => {
    const quantity = getQuantity(item);

    if (quantity <= 1) {
      return;
    }

    dispatch(
      updateCart({
        id: item.id,
        quantity: quantity - 1,
      })
    );
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart(item.id));
  };

  const handleProceedToCheckout = () => {
    if (!cartItems.length) {
      return;
    }

    setShowCheckout(true);
  };

  const handleConfirmOrder = async () => {
    if (!cartItems.length) {
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await api.post("/orders");

      console.log("Order response:", response.data);

      setOrderSuccess(true);

      await dispatch(getCart());

      setTimeout(() => {
        setShowCheckout(false);
        setOrderSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Order error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-stone-50 pt-8 pb-16">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-stone-500">
                  Shopping cart
                </p>

                <h1 className="mt-2 text-3xl font-semibold text-stone-900">
                  Your cart
                </h1>

                <p className="mt-2 text-sm text-stone-600">
                  Review items, update quantity, and proceed to checkout.
                </p>
              </div>

              <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                {cartItems.length} items in cart
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
              {error.message || "Something went wrong."}
            </div>
          )}

          {loading && cartItems.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
              <p className="text-sm text-stone-500">
                Loading your cart...
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm ring-1 ring-stone-200">
              <h2 className="text-2xl font-semibold text-stone-900">
                Your cart is empty
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                Add some products to your cart and they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">

              {/* Cart Items */}
              <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
                <div className="overflow-hidden rounded-[1.75rem] border border-stone-200">

                  <div className="bg-stone-100 px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-stone-600">
                    Cart items
                  </div>

                  <div className="divide-y divide-stone-200">
                    {cartItems.map((item) => {
                      const price = getProductPrice(item);
                      const quantity = getQuantity(item);
                      const color = getColor(item);
                      const size = getSize(item);

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                        >

                          {/* Product */}
                          <div className="flex items-center gap-4">

                            <img
                              src={getProductImage(item)}
                              alt={getProductName(item)}
                              className="h-24 w-24 rounded-3xl object-cover"
                            />

                            <div>
                              <h2 className="text-lg font-semibold text-stone-900">
                                {getProductName(item)}
                              </h2>

                              {(color || size) && (
                                <p className="mt-2 text-sm text-stone-500">
                                  {color && `Color: ${color}`}
                                  {color && size && " · "}
                                  {size && `Size: ${size}`}
                                </p>
                              )}

                              <p className="mt-2 text-sm font-semibold text-stone-900">
                                ${price.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between gap-4 sm:w-72">

                            <div className="flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-2">

                              <button
                                onClick={() => handleDecrease(item)}
                                disabled={quantity <= 1 || loading}
                                className="text-stone-500 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                                type="button"
                              >
                                −
                              </button>

                              <span className="mx-4 text-sm font-semibold text-stone-900">
                                {quantity}
                              </span>

                              <button
                                onClick={() => handleIncrease(item)}
                                disabled={loading}
                                className="text-stone-500 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                                type="button"
                              >
                                +
                              </button>

                            </div>

                            <button
                              onClick={() => handleRemove(item)}
                              disabled={loading}
                              className="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                              type="button"
                            >
                              Remove
                            </button>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Order Summary */}
              <aside className="space-y-6">

                <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">

                  <h2 className="text-xl font-semibold text-stone-900">
                    Order summary
                  </h2>

                  <div className="mt-6 space-y-4">

                    <div className="flex items-center justify-between text-sm text-stone-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-stone-600">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-stone-600">
                      <span>Discount</span>

                      <span className="text-emerald-700">
                        -${discount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-lg font-semibold text-stone-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    className="mt-6 w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-900"
                    type="button"
                  >
                    Proceed to checkout
                  </button>

                </section>

                {/* Promo */}
                <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">

                  <h3 className="text-lg font-semibold text-stone-900">
                    Promo code
                  </h3>

                  <p className="mt-2 text-sm text-stone-500">
                    Apply a discount code to your order before checkout.
                  </p>

                  <div className="mt-4 flex gap-3">

                    <input
                      type="text"
                      placeholder="Enter code"
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-black"
                    />

                    <button
                      className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-900"
                      type="button"
                    >
                      Apply
                    </button>

                  </div>

                </section>

              </aside>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">

            {!orderSuccess ? (
              <>
                {/* Modal Header */}
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
                      Checkout
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                      Confirm your order
                    </h2>

                    <p className="mt-2 text-sm text-stone-500">
                      Please review your order before placing it.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowCheckout(false)}
                    disabled={placingOrder}
                    className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-600 hover:bg-stone-200"
                    type="button"
                  >
                    ✕
                  </button>

                </div>

                {/* Items */}
                <div className="mt-6 rounded-2xl border border-stone-200">

                  <div className="bg-stone-100 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-stone-600">
                    Your order
                  </div>

                  <div className="divide-y divide-stone-200">

                    {cartItems.map((item) => {
                      const price = getProductPrice(item);
                      const quantity = getQuantity(item);
                      const color = getColor(item);
                      const size = getSize(item);

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 p-4"
                        >

                          <div className="flex items-center gap-3">

                            <img
                              src={getProductImage(item)}
                              alt={getProductName(item)}
                              className="h-16 w-16 rounded-2xl object-cover"
                            />

                            <div>

                              <p className="text-sm font-semibold text-stone-900">
                                {getProductName(item)}
                              </p>

                              {(color || size) && (
                                <p className="mt-1 text-xs text-stone-500">
                                  {color && `Color: ${color}`}
                                  {color && size && " · "}
                                  {size && `Size: ${size}`}
                                </p>
                              )}

                              <p className="mt-1 text-xs text-stone-500">
                                Qty: {quantity}
                              </p>

                            </div>
                          </div>

                          <p className="text-sm font-semibold text-stone-900">
                            ${(price * quantity).toFixed(2)}
                          </p>

                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 rounded-2xl bg-stone-50 p-5">

                  <div className="space-y-3">

                    <div className="flex justify-between text-sm text-stone-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-stone-600">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-stone-600">
                      <span>Discount</span>
                      <span className="text-emerald-700">
                        -${discount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-stone-200 pt-3 text-lg font-semibold text-stone-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() => setShowCheckout(false)}
                    disabled={placingOrder}
                    className="w-full rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-black hover:text-black disabled:opacity-50"
                    type="button"
                  >
                    Back to cart
                  </button>

                  <button
                    onClick={handleConfirmOrder}
                    disabled={placingOrder}
                    className="w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
                    type="button"
                  >
                    {placingOrder ? "Placing order..." : "Confirm order"}
                  </button>

                </div>
              </>
            ) : (
              /* Success */
              <div className="py-12 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                  ✓
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-stone-900">
                  Order placed successfully!
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  Thank you for your order.
                </p>

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
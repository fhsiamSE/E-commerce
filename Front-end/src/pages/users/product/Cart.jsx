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

  const { user } = useSelector((state) => state.auth);

  const [showCheckout, setShowCheckout] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(
      item.variant?.price ||
        item.product?.price ||
        item.price ||
        0
    );

    return sum + price * Number(item.quantity || 0);
  }, 0);

  const shipping = cartItems.length > 0 ? 12.5 : 0;
  const discount = 15.0;
  const total = subtotal + shipping - discount;

  const handleIncrease = (item) => {
    dispatch(
      updateCart({
        id: item.id,
        quantity: Number(item.quantity) + 1,
      })
    );
  };

  const handleDecrease = (item) => {
    const quantity = Number(item.quantity);

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
      alert("Your cart is empty.");
      return;
    }

    setOrderSuccess(false);
    setShowCheckout(true);
  };

  const handleConfirmOrder = async () => {
    if (!cartItems.length) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      const orderData = {
        items: cartItems.map((item) => ({
          cart_id: item.id,
          product_id: item.product_id || item.product?.id,
          variant_id: item.variant_id || item.variant?.id,
          quantity: Number(item.quantity),
        })),
        shipping: shipping,
        discount: discount,
        subtotal: subtotal,
        total: total,
      };

      const response = await api.post("/orders", orderData);

      console.log("Order response:", response.data);

      setOrderSuccess(true);

      await dispatch(getCart());

      setTimeout(() => {
        setShowCheckout(false);
        setOrderSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Order error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="text-sm text-stone-500">
          Loading cart...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-stone-50 pt-8 pb-16">
        <div className="container mx-auto px-4">
          {/* HEADER */}
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
                  Review items, update quantity, and proceed to
                  checkout.
                </p>
              </div>

              <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                {cartItems.length} items in cart
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
              {error?.message || "Failed to load cart."}
            </div>
          )}

          {/* EMPTY CART */}
          {cartItems.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm ring-1 ring-stone-200">
              <h2 className="text-2xl font-semibold text-stone-900">
                Your cart is empty
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                Add some products to your cart to continue.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
              {/* CART ITEMS */}
              <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
                <div className="overflow-hidden rounded-[1.75rem] border border-stone-200">
                  <div className="bg-stone-100 px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-stone-600">
                    Cart items
                  </div>

                  <div className="divide-y divide-stone-200">
                    {cartItems.map((item) => {
                      const product = item.product;
                      const variant = item.variant;

                      const image =
                        product?.images?.[0]?.image_url ||
                        product?.images?.[0]?.image ||
                        item.image ||
                        "https://via.placeholder.com/500";

                      const name =
                        product?.product_name ||
                        item.product_name ||
                        item.name ||
                        "Product";

                      const price = Number(
                        variant?.price ||
                          product?.price ||
                          item.price ||
                          0
                      );

                      const color =
                        variant?.color ||
                        item.color ||
                        "N/A";

                      const size =
                        variant?.size ||
                        item.size ||
                        "N/A";

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={image}
                              alt={name}
                              className="h-24 w-24 rounded-3xl object-cover"
                            />

                            <div>
                              <h2 className="text-lg font-semibold text-stone-900">
                                {name}
                              </h2>

                              <p className="mt-2 text-sm text-stone-500">
                                Color: {color} · Size: {size}
                              </p>

                              <p className="mt-2 text-sm font-semibold text-stone-900">
                                ৳{price.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:w-72">
                            <div className="flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDecrease(item)
                                }
                                className="text-stone-500 hover:text-stone-700"
                              >
                                −
                              </button>

                              <span className="mx-4 text-sm font-semibold text-stone-900">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleIncrease(item)
                                }
                                className="text-stone-500 hover:text-stone-700"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemove(item)
                              }
                              className="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
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

              {/* SUMMARY */}
              <aside className="space-y-6">
                <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Order summary
                  </h2>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between text-sm text-stone-600">
                      <span>Subtotal</span>
                      <span>৳{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-stone-600">
                      <span>Shipping</span>
                      <span>৳{shipping.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-stone-600">
                      <span>Discount</span>

                      <span className="text-emerald-700">
                        -৳{discount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-lg font-semibold text-stone-900">
                      <span>Total</span>

                      <span>৳{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="mt-6 w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-900"
                  >
                    Proceed to checkout
                  </button>
                </section>

                {/* PROMO */}
                <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
                  <h3 className="text-lg font-semibold text-stone-900">
                    Promo code
                  </h3>

                  <p className="mt-2 text-sm text-stone-500">
                    Apply a discount code to your order before
                    checkout.
                  </p>

                  <div className="mt-4 flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-black"
                    />

                    <button
                      type="button"
                      className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-900"
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

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-stone-200 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                  Checkout
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-stone-900">
                  Confirm your order
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-xl text-stone-600 transition hover:bg-stone-200"
              >
                ×
              </button>
            </div>

            {/* SUCCESS */}
            {orderSuccess ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                  ✓
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-stone-900">
                  Order placed successfully!
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  Thank you for your order.
                </p>
              </div>
            ) : (
              <>
                {/* CUSTOMER DETAILS */}
                <div className="p-6">
                  <div className="rounded-2xl bg-stone-50 p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-600">
                      Customer details
                    </h3>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-stone-500">
                          Name
                        </p>

                        <p className="mt-1 text-sm font-semibold text-stone-900">
                          {user?.name || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500">
                          Email
                        </p>

                        <p className="mt-1 text-sm font-semibold text-stone-900">
                          {user?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ORDER ITEMS */}
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-600">
                      Order details
                    </h3>

                    <div className="mt-4 divide-y divide-stone-200 rounded-2xl border border-stone-200">
                      {cartItems.map((item) => {
                        const product = item.product;
                        const variant = item.variant;

                        const image =
                          product?.images?.[0]?.image_url ||
                          product?.images?.[0]?.image ||
                          item.image ||
                          "https://via.placeholder.com/500";

                        const name =
                          product?.product_name ||
                          item.product_name ||
                          item.name ||
                          "Product";

                        const price = Number(
                          variant?.price ||
                            product?.price ||
                            item.price ||
                            0
                        );

                        const color =
                          variant?.color ||
                          item.color ||
                          "N/A";

                        const size =
                          variant?.size ||
                          item.size ||
                          "N/A";

                        return (
                          <div
                            key={item.id}
                            className="flex gap-4 p-4"
                          >
                            <img
                              src={image}
                              alt={name}
                              className="h-20 w-20 rounded-2xl object-cover"
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex justify-between gap-3">
                                <h4 className="truncate text-sm font-semibold text-stone-900">
                                  {name}
                                </h4>

                                <p className="whitespace-nowrap text-sm font-semibold">
                                  ৳
                                  {(
                                    price *
                                    Number(item.quantity)
                                  ).toFixed(2)}
                                </p>
                              </div>

                              <p className="mt-1 text-xs text-stone-500">
                                Color: {color}
                              </p>

                              <p className="mt-1 text-xs text-stone-500">
                                Size: {size}
                              </p>

                              <p className="mt-1 text-xs text-stone-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* PRICE DETAILS */}
                  <div className="mt-6 rounded-2xl bg-stone-50 p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-600">
                      Payment summary
                    </h3>

                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between text-sm text-stone-600">
                        <span>Subtotal</span>
                        <span>
                          ৳{subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm text-stone-600">
                        <span>Shipping</span>
                        <span>
                          ৳{shipping.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm text-emerald-700">
                        <span>Discount</span>
                        <span>
                          -৳{discount.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between border-t border-stone-200 pt-4 text-lg font-semibold text-stone-900">
                        <span>Total</span>
                        <span>
                          ৳{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CONFIRM */}
                  <button
                    type="button"
                    onClick={handleConfirmOrder}
                    disabled={placingOrder}
                    className="mt-6 w-full rounded-full bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {placingOrder
                      ? "Placing order..."
                      : "Confirm Order"}
                  </button>

                  <p className="mt-3 text-center text-xs text-stone-500">
                    By confirming, you agree to place this order
                    with the details shown above.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
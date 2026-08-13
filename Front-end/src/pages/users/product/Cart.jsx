import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  updateCart,
  removeFromCart,
  clearCartError,
} from "../../../store/cartSlice.js";


function Cart() {
  const dispatch = useDispatch();

  const {
    items: cartItems,
    loading,
    error,
  } = useSelector((state) => state.cart);


  /*
  |--------------------------------------------------------------------------
  | Load Cart
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);


  /*
  |--------------------------------------------------------------------------
  | Get Product Image
  |--------------------------------------------------------------------------
  */

  const getProductImage = (product) => {
    if (!product) {
      return "";
    }

    // If product has direct image
    if (product.image) {
      return product.image;
    }

    // If product has image_url
    if (product.image_url) {
      return product.image_url;
    }

    // If product has images array
    if (product.images?.length > 0) {
      const image = product.images[0];

      if (typeof image === "string") {
        return image;
      }

      if (image.image_url) {
        return image.image_url;
      }

      if (image.url) {
        return image.url;
      }

      if (image.image) {
        return image.image;
      }

      if (image.path) {
        return image.path;
      }
    }

    return "";
  };


  /*
  |--------------------------------------------------------------------------
  | Quantity
  |--------------------------------------------------------------------------
  */

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      return;
    }

    dispatch(
      updateCart({
        id: item.id,
        quantity: item.quantity - 1,
      })
    );
  };


  const handleIncrease = (item) => {
    dispatch(
      updateCart({
        id: item.id,
        quantity: item.quantity + 1,
      })
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Remove
  |--------------------------------------------------------------------------
  */

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };


  /*
  |--------------------------------------------------------------------------
  | Subtotal
  |--------------------------------------------------------------------------
  */

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.product?.price || 0);
    const quantity = Number(item.quantity || 0);

    return sum + price * quantity;
  }, 0);


  /*
  |--------------------------------------------------------------------------
  | Shipping / Discount
  |--------------------------------------------------------------------------
  |
  | These will be calculated later by backend/checkout.
  |
  */

  const shipping = 0;
  const discount = 0;

  const total = subtotal + shipping - discount;


  /*
  |--------------------------------------------------------------------------
  | Total Items
  |--------------------------------------------------------------------------
  */

  const totalItems = cartItems.reduce((sum, item) => {
    return sum + Number(item.quantity || 0);
  }, 0);


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 pt-8 pb-16">
        <div className="container mx-auto px-4">

          <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">
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
          </div>

          <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm ring-1 ring-stone-200">
            <p className="text-sm text-stone-500">
              Loading your cart...
            </p>
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

  if (error && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 pt-8 pb-16">
        <div className="container mx-auto px-4">

          <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">
            <p className="text-sm uppercase tracking-[0.35em] text-stone-500">
              Shopping cart
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-stone-900">
              Your cart
            </h1>
          </div>

          <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm ring-1 ring-stone-200">

            <p className="text-sm text-rose-600">
              {error?.message || "Failed to load cart."}
            </p>

            <button
              onClick={() => {
                dispatch(clearCartError());
                dispatch(getCart());
              }}
              className="mt-5 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-900"
            >
              Try again
            </button>

          </div>

        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-stone-50 pt-8 pb-16">
      <div className="container mx-auto px-4">

        {/* ---------------------------------------------------------------- */}
        {/* Header */}
        {/* ---------------------------------------------------------------- */}

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
              {totalItems} {totalItems === 1 ? "item" : "items"} in cart
            </span>

          </div>

        </div>


        {/* ---------------------------------------------------------------- */}
        {/* Empty Cart */}
        {/* ---------------------------------------------------------------- */}

        {cartItems.length === 0 ? (

          <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm ring-1 ring-stone-200">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
              <svg
                className="h-9 w-9 text-stone-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4h13m-11 0a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-stone-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              Add some products to your cart and they will appear here.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">

            {/* ---------------------------------------------------------------- */}
            {/* Cart Items */}
            {/* ---------------------------------------------------------------- */}

            <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">

              <div className="overflow-hidden rounded-[1.75rem] border border-stone-200">

                <div className="bg-stone-100 px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-stone-600">
                  Cart items
                </div>

                <div className="divide-y divide-stone-200">

                  {cartItems.map((item) => {

                    const product = item.product;

                    const price = Number(product?.price || 0);

                    const quantity = Number(item.quantity || 0);

                    const image = getProductImage(product);

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                      >

                        {/* Product */}
                        <div className="flex items-center gap-4">

                          {image ? (
                            <img
                              src={image}
                              alt={product?.name || "Product"}
                              className="h-24 w-24 rounded-3xl object-cover"
                            />
                          ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-stone-100 text-xs text-stone-400">
                              No image
                            </div>
                          )}

                          <div>

                            <h2 className="text-lg font-semibold text-stone-900">
                              {product?.name || "Product"}
                            </h2>

                            {/* Optional color / size */}
                            {(item.color || item.size) && (
                              <p className="mt-2 text-sm text-stone-500">
                                {item.color && `Color: ${item.color}`}
                                {item.color && item.size && " · "}
                                {item.size && `Size: ${item.size}`}
                              </p>
                            )}

                            <p className="mt-2 text-sm font-semibold text-stone-900">
                              ${price.toFixed(2)}
                            </p>

                          </div>

                        </div>


                        {/* Quantity + Remove */}
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
                            onClick={() => handleRemove(item.id)}
                            disabled={loading}
                            className="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
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


            {/* ---------------------------------------------------------------- */}
            {/* Order Summary */}
            {/* ---------------------------------------------------------------- */}

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
                    <span>
                      {shipping === 0
                        ? "Free"
                        : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-stone-600">
                    <span>Discount</span>

                    <span className="text-emerald-700">
                      {discount > 0
                        ? `-$${discount.toFixed(2)}`
                        : "$0.00"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-lg font-semibold text-stone-900">

                    <span>Total</span>

                    <span>
                      ${total.toFixed(2)}
                    </span>

                  </div>

                </div>

                <button
                  className="mt-6 w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-900"
                >
                  Proceed to checkout
                </button>

              </section>


              {/* ---------------------------------------------------------------- */}
              {/* Promo */}
              {/* ---------------------------------------------------------------- */}

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
  );
}

export default Cart;
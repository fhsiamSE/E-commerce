function CheckoutModal({
  isOpen,
  onClose,
  cartItems = [],
  subtotal = 0,
  shipping = 0,
  discount = 0,
  total = 0,
  getProductName,
  getProductImage,
  getProductPrice,
  getQuantity,
  getColor,
  getSize,
  onConfirm,
  placingOrder = false,
  orderSuccess = false,
}) {
  if (!isOpen) {
    return null;
  }

  return (
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
                onClick={onClose}
                disabled={placingOrder}
                className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-600 hover:bg-stone-200 disabled:opacity-50"
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
                onClick={onClose}
                disabled={placingOrder}
                className="w-full rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-black hover:text-black disabled:opacity-50"
                type="button"
              >
                Back to cart
              </button>

              <button
                onClick={onConfirm}
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
  );
}

export default CheckoutModal;
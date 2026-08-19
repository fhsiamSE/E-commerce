import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios.js";

function WishList() {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Wishlist State
  |--------------------------------------------------------------------------
  */

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [removingId, setRemovingId] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | Get Wishlist
  |--------------------------------------------------------------------------
  */

  const getWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/wishlist");

      console.log("Wishlist API response:", response.data);

      /*
       * Supports:
       *
       * {
       *   success: true,
       *   data: [...]
       * }
       *
       * or:
       *
       * {
       *   wishlist: [...]
       * }
       *
       * or directly:
       *
       * [...]
       */

      const wishlistData =
        response.data?.data ||
        response.data?.wishlist ||
        response.data ||
        [];

      setWishlistItems(
        Array.isArray(wishlistData)
          ? wishlistData
          : []
      );

    } catch (error) {
      console.error(
        "Get wishlist error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to load your wishlist."
      );

      setWishlistItems([]);

    } finally {
      setLoading(false);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Load Wishlist
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    getWishlist();
  }, []);


  /*
  |--------------------------------------------------------------------------
  | Remove From Wishlist
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | item.id
  |     = wishlist table ID
  |
  | item.product_id
  |     = product ID
  |
  | Backend destroy() expects PRODUCT ID:
  |
  | DELETE /wishlist/{productId}
  |
  |--------------------------------------------------------------------------
  */

  const handleRemove = async (item) => {
    const productId =
      item?.product_id ||
      item?.product?.id;

    if (!productId) {
      console.error(
        "Product ID is missing:",
        item
      );

      setError(
        "Product ID is missing."
      );

      return;
    }

    try {
      /*
       * item.id is the wishlist row ID.
       * We use it only for UI loading state.
       */

      setRemovingId(item.id);

      setError("");
      setSuccessMessage("");

      /*
       * IMPORTANT:
       * Send product ID, NOT wishlist ID.
       */

      await api.delete(
        `/wishlist/${productId}`
      );

      /*
       * Remove the wishlist row from UI.
       *
       * Here we compare wishlist IDs,
       * because item.id belongs to the wishlist table.
       */

      setWishlistItems((current) =>
        current.filter(
          (wishlistItem) =>
            wishlistItem.id !== item.id
        )
      );

      setSuccessMessage(
        "Product removed from wishlist."
      );

      /*
       * Hide success message after 3 seconds.
       */

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to remove product from wishlist."
      );

    } finally {
      setRemovingId(null);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Show Product Details
  |--------------------------------------------------------------------------
  */

  const handleShowDetails = (item) => {
    const productId =
      item?.product?.id ||
      item?.product_id;

    if (!productId) {
      console.error(
        "Product ID is missing:",
        item
      );

      setError(
        "Product ID is missing."
      );

      return;
    }

    navigate(
      `/products/${productId}`
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Product Name
  |--------------------------------------------------------------------------
  */

  const getProductName = (item) => {
    return (
      item?.product?.product_name ||
      item?.product?.name ||
      item?.product_name ||
      item?.name ||
      "Product"
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Product Price
  |--------------------------------------------------------------------------
  */

  const getProductPrice = (item) => {
    return Number(
      item?.product?.price ||
        item?.price ||
        0
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Product Image
  |--------------------------------------------------------------------------
  */

  const getProductImage = (item) => {
    const image =
      item?.product?.images?.[0]
        ?.image_url ||
      item?.product?.images?.[0]
        ?.image ||
      item?.product?.image ||
      item?.image ||
      null;

    /*
     * No image
     */

    if (!image) {
      return "https://via.placeholder.com/500";
    }

    /*
     * Complete URL
     */

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    /*
     * Laravel storage image
     */

    return `http://127.0.0.1:8000/storage/${image}`;
  };


  /*
  |--------------------------------------------------------------------------
  | Product Badge
  |--------------------------------------------------------------------------
  */

  const getProductBadge = (item) => {
    return (
      item?.product?.tag ||
      item?.product?.category ||
      item?.tag ||
      "Favorite"
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-8 pb-16">

        <div className="container mx-auto px-4">

          {/* Header Skeleton */}

          <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">

            <div className="animate-pulse">

              <div className="h-4 w-24 rounded bg-stone-200" />

              <div className="mt-3 h-8 w-64 rounded bg-stone-200" />

              <div className="mt-3 h-4 w-80 max-w-full rounded bg-stone-200" />

            </div>

          </div>


          {/* Product Skeleton */}

          <div className="grid gap-6 lg:grid-cols-2">

            {[1, 2].map((item) => (

              <div
                key={item}
                className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200"
              >

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                  <div className="h-36 w-full animate-pulse rounded-3xl bg-stone-200 sm:w-40" />

                  <div className="flex-1">

                    <div className="h-5 w-24 animate-pulse rounded bg-stone-200" />

                    <div className="mt-4 h-7 w-48 animate-pulse rounded bg-stone-200" />

                    <div className="mt-3 h-6 w-20 animate-pulse rounded bg-stone-200" />

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
    <div className="min-h-screen bg-stone-50 pt-8 pb-16">

      <div className="container mx-auto px-4">

        {/* =========================================================
            HEADER
        ========================================================== */}

        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm uppercase tracking-[0.35em] text-stone-500">
                Wishlist
              </p>

              <h1 className="mt-2 text-3xl font-semibold text-stone-900">
                Saved favorites
              </h1>

              <p className="mt-2 text-sm text-stone-600">
                Keep track of items you love and move them to cart when ready.
              </p>

            </div>


            {/* Saved Items Count */}

            <span className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700">

              {wishlistItems.length} saved items

            </span>

          </div>

        </div>


        {/* =========================================================
            SUCCESS MESSAGE
        ========================================================== */}

        {successMessage && (

          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">

            {successMessage}

          </div>

        )}


        {/* =========================================================
            ERROR MESSAGE
        ========================================================== */}

        {error && (

          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">

            {error}

          </div>

        )}


        {/* =========================================================
            EMPTY WISHLIST
        ========================================================== */}

        {wishlistItems.length === 0 ? (

          <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm ring-1 ring-stone-200">

            <div className="text-5xl">
              ♡
            </div>

            <h2 className="mt-5 text-xl font-semibold text-stone-900">
              Your wishlist is empty
            </h2>

            <p className="mt-3 text-sm text-stone-500">
              Products you save will appear here.
            </p>

          </div>

        ) : (

          /* =======================================================
             WISHLIST PRODUCTS
          ======================================================== */

          <div className="grid gap-6 lg:grid-cols-2">

            {wishlistItems.map((item) => (

              <div
                key={item.id}
                className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                  {/* =================================================
                      IMAGE
                  ================================================== */}

                  <img
                    src={getProductImage(item)}
                    alt={getProductName(item)}
                    className="h-36 w-full rounded-3xl object-cover sm:w-40"
                  />


                  {/* =================================================
                      PRODUCT INFORMATION
                  ================================================== */}

                  <div className="flex-1">

                    {/* Badge */}

                    <span className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">

                      {getProductBadge(item)}

                    </span>


                    {/* Product Name */}

                    <h2 className="mt-4 text-xl font-semibold text-stone-900">

                      {getProductName(item)}

                    </h2>


                    {/* Price */}

                    <p className="mt-3 text-lg font-semibold text-stone-900">

                      $
                      {getProductPrice(item).toFixed(2)}

                    </p>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================== */}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">

                      {/* =================================================
                          SHOW DETAILS
                      ================================================== */}

                      <button
                        className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-900"
                        type="button"
                        onClick={() =>
                          handleShowDetails(item)
                        }
                      >
                        Show Details
                      </button>


                      {/* =================================================
                          REMOVE
                      ================================================== */}

                      <button
                        className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        disabled={
                          removingId === item.id
                        }
                        onClick={() =>
                          handleRemove(item)
                        }
                      >

                        {removingId === item.id
                          ? "Removing..."
                          : "Remove"}

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* =========================================================
            WISHLIST TIPS
        ========================================================== */}

        <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">

          <h2 className="text-xl font-semibold text-stone-900">
            Wishlist tips
          </h2>

          <p className="mt-3 text-sm text-stone-500">
            Check your favorites before sale events and move items to cart for faster checkout.
          </p>


          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            {/* Save Time */}

            <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">

              <h3 className="text-sm font-semibold text-stone-900">
                Save time
              </h3>

              <p className="mt-2 text-sm text-stone-600">
                Keep your preferred items ready for future promotions and restocks.
              </p>

            </div>


            {/* Stay Organized */}

            <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">

              <h3 className="text-sm font-semibold text-stone-900">
                Stay organized
              </h3>

              <p className="mt-2 text-sm text-stone-600">
                Group your wishlist picks by occasion or price range as you browse.
              </p>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default WishList;
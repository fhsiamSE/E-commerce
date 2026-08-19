import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../store/wishlistSlice.js";


function Products({
  products = [],
  productType = "Products",
  slider = false,
  limit = 10,
}) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const sliderRef = useRef(null);


  /*
  |--------------------------------------------------------------------------
  | Wishlist Redux
  |--------------------------------------------------------------------------
  */

  const {
    wishlistIds = [],
    loading: wishlistLoading,
    actionLoading,
    error: wishlistError,
    success: wishlistSuccess,
  } = useSelector(
    (state) => state.wishlist
  );


  /*
  |--------------------------------------------------------------------------
  | Local Message
  |--------------------------------------------------------------------------
  */

  const [message, setMessage] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | Load Wishlist From Database
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);


  /*
  |--------------------------------------------------------------------------
  | Show Redux Success / Error Message
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (wishlistSuccess) {
      setMessage({
        type: "success",
        text: wishlistSuccess,
      });

      const timer = setTimeout(() => {
        setMessage(null);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [wishlistSuccess]);


  useEffect(() => {
    if (wishlistError) {
      setMessage({
        type: "error",
        text: wishlistError,
      });

      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [wishlistError]);


  /*
  |--------------------------------------------------------------------------
  | Home = Maximum 10
  | All Products = Everything
  |--------------------------------------------------------------------------
  */

  const displayedProducts = slider
    ? products.slice(0, limit)
    : products;


  /*
  |--------------------------------------------------------------------------
  | Check If Product Is In Wishlist
  |--------------------------------------------------------------------------
  */

  const isWishlisted = (productId) => {
    return wishlistIds.some(
      (id) => Number(id) === Number(productId)
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Wishlist Toggle
  |--------------------------------------------------------------------------
  */

  const handleWishlist = async (
    event,
    product
  ) => {
    event.stopPropagation();

    if (!product?.id) {
      setMessage({
        type: "error",
        text: "Product ID is missing.",
      });

      return;
    }


    /*
     * Already in wishlist
     * => Remove
     */

    if (isWishlisted(product.id)) {
      await dispatch(
        removeFromWishlist(product.id)
      );

      return;
    }


    /*
     * Not in wishlist
     * => Add
     */

    await dispatch(
      addToWishlist(product.id)
    );
  };


  // ==========================================
  // DESKTOP SLIDER
  // ==========================================

  const scrollNext = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };


  const scrollPrevious = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: -sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };


  // ==========================================
  // PRODUCT CARD
  // ==========================================

  const ProductCard = ({
    product,
  }) => {

    const wishlisted = isWishlisted(
      product.id
    );


    return (
      <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-lg sm:p-4">

        {/* Image Container */}

        <div>

          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">

            <img
              src={
                product.images?.[0]?.image_url ||
                "https://via.placeholder.com/500"
              }
              alt={
                product.product_name ||
                product.name ||
                "Product"
              }
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />


            {/* Product Tag */}

            {product.tag && (
              <span className="absolute left-2 top-2 rounded-full bg-black px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
                {product.tag}
              </span>
            )}


            {/* ==================================================
                WISHLIST BUTTON
            =================================================== */}

            <button
              type="button"
              disabled={actionLoading}
              onClick={(e) =>
                handleWishlist(
                  e,
                  product
                )
              }
              aria-label={
                wishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className={`
                absolute
                right-2
                top-2
                rounded-full
                bg-white/90
                p-1.5
                text-xs
                shadow-sm
                transition
                sm:right-3
                sm:top-3
                sm:p-2
                sm:text-sm

                ${
                  wishlisted
                    ? "text-pink-500 hover:bg-pink-100"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                }

                disabled:cursor-not-allowed
                disabled:opacity-70
              `}
            >

              {/* Heart */}

              <span
                className={
                  wishlisted
                    ? "text-pink-500"
                    : "text-gray-400"
                }
              >
                ♥
              </span>

            </button>

          </div>


          {/* Product Info */}

          <div className="mt-3 sm:mt-4">

            <h3 className="line-clamp-1 text-xs font-semibold text-gray-900 sm:text-sm">
              {product.product_name ||
                product.name}
            </h3>


            <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-gray-600 sm:text-xs">
              {product.description}
            </p>


            {/* Price */}

            <div className="mt-2 flex items-center justify-between gap-2 sm:mt-3">

              <p className="text-sm font-bold text-gray-900 sm:text-base">
                $
                {Number(
                  product.price || 0
                ).toFixed(2)}
              </p>


              {/* Original Price */}

              {product.originalPrice && (
                <p className="text-[10px] text-gray-400 line-through sm:text-xs">
                  $
                  {Number(
                    product.originalPrice
                  ).toFixed(2)}
                </p>
              )}

            </div>

          </div>

        </div>


        {/* Action Button */}

        <div className="mt-3 sm:mt-4">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/products/${product.id}`
              )
            }
            className="w-full rounded-full bg-black px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-gray-800 sm:px-4 sm:py-2 sm:text-xs"
          >
            Show Details
          </button>

        </div>

      </div>
    );
  };


  return (
    <section className="relative mx-auto w-full max-w-7xl px-3 py-6 sm:px-4 sm:py-8">


      {/* =========================================================
          SUCCESS / ERROR MESSAGE
      ========================================================== */}

      {message && (
        <div
          className={`
            fixed
            right-4
            top-20
            z-50
            rounded-xl
            px-5
            py-3
            text-sm
            font-medium
            shadow-lg
            transition-all

            ${
              message.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }
          `}
        >
          {message.text}
        </div>
      )}


      {/* ==========================================
          SECTION HEADER
      =========================================== */}

      <div className="mb-4 flex items-center justify-between gap-2 sm:mb-5">

        {/* Section Title */}

        <h1 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
          {productType}
        </h1>


        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* =====================================
              DESKTOP SLIDER BUTTONS ONLY
          ====================================== */}

          {slider &&
            displayedProducts.length > 5 && (
              <div className="hidden items-center gap-1.5 lg:flex">

                <button
                  type="button"
                  onClick={scrollPrevious}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm text-gray-700 transition hover:border-black hover:bg-black hover:text-white"
                  aria-label="Previous products"
                >
                  ←
                </button>


                <button
                  type="button"
                  onClick={scrollNext}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm text-gray-700 transition hover:border-black hover:bg-black hover:text-white"
                  aria-label="Next products"
                >
                  →
                </button>

              </div>
            )}


          {/* =====================================
              SEE MORE
          ====================================== */}

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="
              rounded-full
              border
              border-gray-300
              px-2.5
              py-1
              text-[10px]
              font-semibold
              text-gray-700
              transition
              hover:border-black
              hover:text-black

              sm:px-3
              sm:py-1.5
              sm:text-xs

              lg:px-3.5
              lg:py-1.5
              lg:text-xs
            "
          >
            See More
          </button>

        </div>

      </div>


      {/* ==========================================
          MOBILE + TABLET

          NO SLIDER

          Show maximum 10 products
      =========================================== */}

      {slider ? (

        <>

          {/* Mobile + Tablet */}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:hidden">

            {displayedProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              )
            )}

          </div>


          {/* ======================================
              DESKTOP ONLY SLIDER
          ======================================= */}

          <div
            ref={sliderRef}
            className="hidden gap-4 overflow-hidden lg:flex"
          >

            {displayedProducts.map(
              (product) => (

                <div
                  key={product.id}
                  className="min-w-[calc(20%-13px)] flex-1"
                >

                  <ProductCard
                    product={product}
                  />

                </div>

              )
            )}

          </div>

        </>

      ) : (

        /* ==========================================
           ALL PRODUCTS PAGE

           NO SLIDER
           SHOW EVERYTHING
        =========================================== */

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">

          {products.map(
            (product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            )
          )}

        </div>

      )}

    </section>
  );
}


export default Products;
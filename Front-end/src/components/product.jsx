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


function Product({
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
    actionLoading = false,
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
  | Load Wishlist
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);


  /*
  |--------------------------------------------------------------------------
  | Wishlist Success Message
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!wishlistSuccess) return;

    setMessage({
      type: "success",
      text: wishlistSuccess,
    });

    const timer = setTimeout(() => {
      setMessage(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, [wishlistSuccess]);


  /*
  |--------------------------------------------------------------------------
  | Wishlist Error Message
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!wishlistError) return;

    setMessage({
      type: "error",
      text: wishlistError,
    });

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [wishlistError]);


  /*
  |--------------------------------------------------------------------------
  | Display Products
  |--------------------------------------------------------------------------
  */

  const displayedProducts = slider
    ? products.slice(0, limit)
    : products;


  /*
  |--------------------------------------------------------------------------
  | Check Wishlist
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

    try {
      if (isWishlisted(product.id)) {
        await dispatch(
          removeFromWishlist(product.id)
        ).unwrap();
      } else {
        await dispatch(
          addToWishlist(product.id)
        ).unwrap();
      }
    } catch (error) {
      console.error(
        "Wishlist action error:",
        error
      );

      setMessage({
        type: "error",
        text:
          typeof error === "string"
            ? error
            : "Wishlist action failed.",
      });

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Slider
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | Product Card
  |--------------------------------------------------------------------------
  */

  const ProductCard = ({
    product,
  }) => {
    const wishlisted = isWishlisted(
      product.id
    );

    const image =
      product.images?.[0]?.image_url ||
      product.images?.[0]?.image ||
      "https://via.placeholder.com/500";


    return (
      <div
        className="
          flex
          h-full
          flex-col
          justify-between
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-3
          shadow-sm
          transition
          hover:shadow-lg
          sm:p-4
        "
      >

        {/* ======================================================
            IMAGE
        ======================================================= */}

        <div>

          <div
            className="
              relative
              aspect-square
              w-full
              overflow-hidden
              rounded-xl
              bg-gray-100
            "
          >

            <img
              src={image}
              alt={
                product.product_name ||
                product.name ||
                "Product"
              }
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-300
                hover:scale-105
              "
            />


            {/* ==================================================
                PRODUCT TAG
            =================================================== */}

            {product.tag && (
              <span
                className="
                  absolute
                  left-2
                  top-2
                  rounded-full
                  bg-black
                  px-2
                  py-0.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-white
                  sm:left-3
                  sm:top-3
                  sm:px-2.5
                  sm:py-1
                  sm:text-[10px]
                "
              >
                {product.tag}
              </span>
            )}


            {/* ==================================================
                WISHLIST
            =================================================== */}

            <button
              type="button"
              disabled={actionLoading}
              onClick={(event) =>
                handleWishlist(
                  event,
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


          {/* ==================================================
              PRODUCT INFORMATION
          =================================================== */}

          <div className="mt-3 sm:mt-4">

            <h3
              className="
                line-clamp-1
                text-xs
                font-semibold
                text-gray-900
                sm:text-sm
              "
            >
              {product.product_name ||
                product.name ||
                "Product"}
            </h3>


            <p
              className="
                mt-1
                line-clamp-2
                text-[10px]
                leading-4
                text-gray-600
                sm:text-xs
              "
            >
              {product.description ||
                "No description available."}
            </p>


            {/* Price */}

            <div
              className="
                mt-2
                flex
                items-center
                justify-between
                gap-2
                sm:mt-3
              "
            >

              <p
                className="
                  text-sm
                  font-bold
                  text-gray-900
                  sm:text-base
                "
              >
                $
                {Number(
                  product.price || 0
                ).toFixed(2)}
              </p>


              {product.originalPrice && (
                <p
                  className="
                    text-[10px]
                    text-gray-400
                    line-through
                    sm:text-xs
                  "
                >
                  $
                  {Number(
                    product.originalPrice
                  ).toFixed(2)}
                </p>
              )}

            </div>

          </div>

        </div>


        {/* ======================================================
            SHOW DETAILS
        ======================================================= */}

        <div className="mt-3 sm:mt-4">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/products/${product.id}`
              )
            }
            className="
              w-full
              rounded-full
              bg-black
              px-3
              py-1.5
              text-[10px]
              font-semibold
              text-white
              transition
              hover:bg-gray-800
              sm:px-4
              sm:py-2
              sm:text-xs
            "
          >
            Show Details
          </button>

        </div>

      </div>
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <section
      className="
        relative
        mx-auto
        w-full
        max-w-7xl
        px-3
        py-6
        sm:px-4
        sm:py-8
      "
    >

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
            text-white
            shadow-lg

            ${
              message.type === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }
          `}
        >
          {message.text}
        </div>
      )}


      {/* =========================================================
          HEADER
      ========================================================== */}

      <div
        className="
          mb-4
          flex
          items-center
          justify-between
          gap-2
          sm:mb-5
        "
      >

        <h1
          className="
            text-lg
            font-bold
            text-gray-900
            sm:text-xl
            lg:text-2xl
          "
        >
          {productType}
        </h1>


        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Slider Buttons */}

          {slider &&
            displayedProducts.length > 5 && (
              <div
                className="
                  hidden
                  items-center
                  gap-1.5
                  lg:flex
                "
              >

                <button
                  type="button"
                  onClick={scrollPrevious}
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-gray-300
                    text-sm
                    text-gray-700
                    transition
                    hover:border-black
                    hover:bg-black
                    hover:text-white
                  "
                >
                  ←
                </button>


                <button
                  type="button"
                  onClick={scrollNext}
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-gray-300
                    text-sm
                    text-gray-700
                    transition
                    hover:border-black
                    hover:bg-black
                    hover:text-white
                  "
                >
                  →
                </button>

              </div>
            )}


          {/* See More */}

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


      {/* =========================================================
          SLIDER
      ========================================================== */}

      {slider ? (
        <>

          {/* Mobile + Tablet */}

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-3
              sm:gap-4
              lg:hidden
            "
          >
            {displayedProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              )
            )}
          </div>


          {/* Desktop */}

          <div
            ref={sliderRef}
            className="
              hidden
              gap-4
              overflow-hidden
              lg:flex
            "
          >
            {displayedProducts.map(
              (product) => (
                <div
                  key={product.id}
                  className="
                    min-w-[calc(20%-13px)]
                    flex-1
                  "
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

        /* =======================================================
           NORMAL PRODUCT GRID
        ======================================================== */

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            sm:gap-4
            lg:grid-cols-5
          "
        >
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

export default Product;
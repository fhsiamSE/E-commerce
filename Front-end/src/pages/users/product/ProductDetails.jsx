import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "../../../api/axios";
import { addToCart as addToCartAction } from "../../../store/cartSlice.js";

import {
  getReviews,
  addReview,
} from "../../../store/reviewSlice.js";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /*
  |--------------------------------------------------------------------------
  | AUTH
  |--------------------------------------------------------------------------
  */

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const { loading: cartLoading } = useSelector(
    (state) => state.cart
  );

  /*
  |--------------------------------------------------------------------------
  | REVIEW REDUX STATE
  |--------------------------------------------------------------------------
  */

  const {
    reviews,
    totalReviews,
    averageRating: reviewAverageRating,
    ratingCounts,
    loading: reviewLoading,
    submitting: reviewSubmitting,
    error: reviewError,
  } = useSelector((state) => state.review);

  /*
  |--------------------------------------------------------------------------
  | PRODUCT
  |--------------------------------------------------------------------------
  */

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | RELATED PRODUCTS
  |--------------------------------------------------------------------------
  */

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | PRODUCT OPTIONS
  |--------------------------------------------------------------------------
  */

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | DESCRIPTION / SHIPPING
  |--------------------------------------------------------------------------
  */

  const [openDescription, setOpenDescription] = useState(true);
  const [openShipping, setOpenShipping] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | BUY NOW
  |--------------------------------------------------------------------------
  */

  const [buyLoading, setBuyLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | REVIEW FORM
  |--------------------------------------------------------------------------
  */

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  /*
  |--------------------------------------------------------------------------
  | FETCH PRODUCT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/products/${id}`
        );

        const productData =
          response.data?.data;

        if (!productData) {
          throw new Error(
            "Product data not found."
          );
        }

        setProduct(productData);

        /*
        |--------------------------------------------------------------------------
        | RESET PRODUCT OPTIONS
        |--------------------------------------------------------------------------
        */

        setSelectedImage(0);

        setSelectedColor(
          productData.variants?.[0]?.color ||
            null
        );

        setSelectedSize(null);

        setQuantity(1);

      } catch (err) {
        console.error(
          "Product fetch error:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | FETCH REVIEWS
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | Reviews are NOT taken from /products/{id}.
  |
  | We call:
  |
  | GET /products/{id}/reviews
  |
  | This makes reviews appear after page refresh.
  |
  */

  useEffect(() => {
    if (!id) return;

    dispatch(getReviews(id));
  }, [id, dispatch]);

  /*
  |--------------------------------------------------------------------------
  | FETCH RELATED PRODUCTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.id) return;

      try {
        setRelatedLoading(true);

        const response = await api.get(
          "/products"
        );

        let products =
          response.data?.data || [];

        if (
          !Array.isArray(products) &&
          Array.isArray(products?.data)
        ) {
          products = products.data;
        }

        if (!Array.isArray(products)) {
          products = [];
        }

        const filtered = products.filter(
          (item) =>
            Number(item.id) !==
            Number(product.id)
        );

        const sameCategory =
          filtered.filter(
            (item) =>
              item.category ===
              product.category
          );

        const otherProducts =
          filtered.filter(
            (item) =>
              item.category !==
              product.category
          );

        setRelatedProducts(
          [
            ...sameCategory,
            ...otherProducts,
          ].slice(0, 4)
        );

      } catch (err) {
        console.error(
          "Related products error:",
          err
        );

        setRelatedProducts([]);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  /*
  |--------------------------------------------------------------------------
  | VARIANTS / IMAGES
  |--------------------------------------------------------------------------
  */

  const variants =
    product?.variants || [];

  const images =
    product?.images || [];

  /*
  |--------------------------------------------------------------------------
  | UNIQUE COLORS
  |--------------------------------------------------------------------------
  */

  const colors = useMemo(() => {
    return [
      ...new Set(
        variants
          .map(
            (variant) =>
              variant.color
          )
          .filter(Boolean)
      ),
    ];
  }, [variants]);

  /*
  |--------------------------------------------------------------------------
  | UNIQUE SIZES
  |--------------------------------------------------------------------------
  */

  const sizes = useMemo(() => {
    return [
      ...new Set(
        variants
          .map(
            (variant) =>
              variant.size
          )
          .filter(Boolean)
      ),
    ];
  }, [variants]);

  /*
  |--------------------------------------------------------------------------
  | SELECTED VARIANT
  |--------------------------------------------------------------------------
  */

  const selectedVariant = useMemo(() => {
    if (!selectedSize) {
      return null;
    }

    return variants.find(
      (variant) =>
        variant.size ===
          selectedSize &&
        variant.color ===
          selectedColor
    );
  }, [
    variants,
    selectedSize,
    selectedColor,
  ]);

  /*
  |--------------------------------------------------------------------------
  | CURRENT PRICE
  |--------------------------------------------------------------------------
  */

  const currentPrice =
    selectedVariant?.price ||
    product?.price ||
    0;

  /*
  |--------------------------------------------------------------------------
  | IMAGE NAVIGATION
  |--------------------------------------------------------------------------
  */

  const previousImage = () => {
    if (images.length <= 1) {
      return;
    }

    setSelectedImage((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  };

  const nextImage = () => {
    if (images.length <= 1) {
      return;
    }

    setSelectedImage((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  };

  /*
  |--------------------------------------------------------------------------
  | COLOR SELECTION
  |--------------------------------------------------------------------------
  */

  const handleColorChange = (
    color
  ) => {
    setSelectedColor(color);

    const matchingVariant =
      variants.find(
        (variant) =>
          variant.color ===
            color &&
          variant.size ===
            selectedSize
      );

    if (!matchingVariant) {
      setSelectedSize(null);
    }

    setQuantity(1);
  };

  /*
  |--------------------------------------------------------------------------
  | SIZE SELECTION
  |--------------------------------------------------------------------------
  */

  const handleSizeChange = (
    size
  ) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  /*
  |--------------------------------------------------------------------------
  | GET VARIANT FOR SIZE
  |--------------------------------------------------------------------------
  */

  const getVariantForSize = (
    size
  ) => {
    return variants.find(
      (variant) =>
        variant.size === size &&
        variant.color ===
          selectedColor
    );
  };

  /*
  |--------------------------------------------------------------------------
  | QUANTITY
  |--------------------------------------------------------------------------
  */

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    if (!selectedVariant) {
      return;
    }

    const stock = Number(
      selectedVariant.stock || 0
    );

    setQuantity((current) =>
      Math.min(
        current + 1,
        stock
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | ADD TO CART
  |--------------------------------------------------------------------------
  */

  const handleAddToCart =
    async () => {
      if (!isAuthenticated) {
        alert(
          "Please login to add products to your cart."
        );

        navigate("/login");

        return;
      }

      if (!product?.id) {
        alert("Product not found.");
        return;
      }

      if (!selectedColor) {
        alert(
          "Please select a color."
        );
        return;
      }

      if (!selectedSize) {
        alert(
          "Please select a size."
        );
        return;
      }

      if (!selectedVariant) {
        alert(
          "This color and size combination is not available."
        );

        return;
      }

      const stock = Number(
        selectedVariant.stock || 0
      );

      if (stock <= 0) {
        alert(
          "This product is out of stock."
        );

        return;
      }

      if (quantity > stock) {
        alert(
          `Only ${stock} item(s) are available.`
        );

        return;
      }

      try {
        await dispatch(
          addToCartAction({
            product_id:
              product.id,
            variant_id:
              selectedVariant.id,
            quantity,
          })
        ).unwrap();

        alert(
          "Product added to cart successfully."
        );

      } catch (err) {
        console.error(
          "Add to cart error:",
          err
        );

        alert(
          err?.message ||
            err?.data?.message ||
            "Unable to add product to cart."
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | BUY NOW
  |--------------------------------------------------------------------------
  */

  const buyNow = async () => {
    if (!isAuthenticated) {
      alert(
        "Please login to continue."
      );

      navigate("/login");

      return;
    }

    if (!product?.id) {
      alert("Product not found.");
      return;
    }

    if (!selectedColor) {
      alert(
        "Please select a color."
      );
      return;
    }

    if (!selectedSize) {
      alert(
        "Please select a size."
      );
      return;
    }

    if (!selectedVariant) {
      alert(
        "This color and size combination is not available."
      );

      return;
    }

    const stock = Number(
      selectedVariant.stock || 0
    );

    if (stock <= 0) {
      alert(
        "This product is out of stock."
      );
      return;
    }

    if (quantity > stock) {
      alert(
        `Only ${stock} item(s) are available.`
      );

      return;
    }

    try {
      setBuyLoading(true);

      navigate(
        `/checkout?product=${product.id}&variant=${selectedVariant.id}&quantity=${quantity}`
      );

    } catch (err) {
      console.error(
        "Buy now error:",
        err
      );
    } finally {
      setBuyLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | AVERAGE RATING
  |--------------------------------------------------------------------------
  */

  const averageRating =
    Number(
      reviewAverageRating || 0
    ).toFixed(1);

  /*
  |--------------------------------------------------------------------------
  | RATING COUNT
  |--------------------------------------------------------------------------
  */

  const getRatingCount = (
    rating
  ) => {
    return (
      ratingCounts?.[rating] || 0
    );
  };

  /*
  |--------------------------------------------------------------------------
  | RATING PERCENTAGE
  |--------------------------------------------------------------------------
  */

  const getRatingPercentage = (
    rating
  ) => {
    if (!totalReviews) {
      return 0;
    }

    return (
      (getRatingCount(rating) /
        totalReviews) *
      100
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT REVIEW
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | We do NOT send the user's name.
  |
  | Laravel gets the authenticated user
  | using:
  |
  | $request->user()
  |
  */

  const submitReview = async (
    event
  ) => {
    event.preventDefault();

    if (!isAuthenticated) {
      alert(
        "Please login to submit a review."
      );

      navigate("/login");

      return;
    }

    if (!reviewRating) {
      alert(
        "Please select a rating."
      );

      return;
    }

    if (!reviewComment.trim()) {
      alert(
        "Please write your review."
      );

      return;
    }

    try {
      await dispatch(
        addReview({
          productId:
            product.id,
          rating:
            reviewRating,
          comment:
            reviewComment.trim(),
        })
      ).unwrap();

      /*
      |--------------------------------------------------------------------------
      | Clear form
      |--------------------------------------------------------------------------
      */

      setReviewRating(0);
      setReviewTitle("");
      setReviewComment("");

      /*
      |--------------------------------------------------------------------------
      | Fetch reviews again
      |--------------------------------------------------------------------------
      |
      | This is important.
      |
      | It gets the review from the database
      | including:
      |
      | review.user.name
      |
      */

      await dispatch(
        getReviews(product.id)
      );

      alert(
        "Your review has been submitted."
      );

    } catch (err) {
      console.error(
        "Review submission error:",
        err
      );

      alert(
        err?.message ||
          err?.data?.message ||
          "Unable to submit review."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />

          <p className="mt-4 text-sm text-gray-500">
            Loading product...
          </p>

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">

        <h1 className="text-2xl font-semibold">
          Product not found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {error ||
            "This product could not be loaded."}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/products")
          }
          className="mt-6 bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Back to Products
        </button>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10">

        {/* =========================================================
            PRODUCT DETAILS
        ========================================================== */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[80px_minmax(0,1fr)_420px] xl:gap-35">

          {/* =====================================================
              THUMBNAILS
          ====================================================== */}

          <div className="order-2 flex gap-12 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">

            {images.map(
              (image, index) => (
                <button
                  key={
                    image.id ||
                    index
                  }
                  type="button"
                  onClick={() =>
                    setSelectedImage(
                      index
                    )
                  }
                  className={`relative h-[80px] w-[80px] flex-shrink-0 overflow-hidden bg-gray-100 transition ${
                    selectedImage ===
                    index
                      ? "border-2 border-black"
                      : "border border-transparent"
                  }`}
                >

                  <img
                    src={
                      image.image_url
                    }
                    alt={`${product.product_name} ${
                      index + 1
                    }`}
                    className="h-full w-full object-cover"
                  />

                </button>
              )
            )}

          </div>

          {/* =====================================================
              MAIN IMAGE
          ====================================================== */}

          <div className="order-1 lg:order-2">

            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">

              {images.length >
              0 ? (
                <img
                  src={
                    images[
                      selectedImage
                    ]?.image_url
                  }
                  alt={
                    product.product_name
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  No image available
                </div>
              )}

              {images.length >
                1 && (
                <>
                  <button
                    type="button"
                    onClick={
                      previousImage
                    }
                    className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
                    aria-label="Previous image"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={
                      nextImage
                    }
                    className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
                    aria-label="Next image"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}

            </div>

          </div>

          {/* =====================================================
              PRODUCT INFORMATION
          ====================================================== */}

          <div className="order-3">

            <div className="flex items-start justify-between gap-4">

              <div>

                <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                  {
                    product.product_name
                  }
                </h1>

                {product.category && (
                  <p className="mt-2 text-sm text-gray-500">
                    {
                      product.category
                    }
                  </p>
                )}

              </div>

              <div className="flex flex-shrink-0 items-center gap-1 text-sm">

                <span className="text-yellow-500">
                  ★
                </span>

                <span>
                  {averageRating}
                </span>

              </div>

            </div>

            {/* PRICE */}

            <div className="mt-5">

              <span className="text-xl font-medium">
                ৳
                {Number(
                  currentPrice
                ).toFixed(2)}
              </span>

            </div>

            {/* STOCK */}

            <div className="mt-3">

              {selectedVariant ? (
                <p className="text-sm">

                  {Number(
                    selectedVariant.stock
                  ) > 0 ? (
                    <span className="text-green-600">
                      {
                        selectedVariant.stock
                      }{" "}
                      available
                    </span>
                  ) : (
                    <span className="text-red-500">
                      Out of stock
                    </span>
                  )}

                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Select color and
                  size to see
                  availability.
                </p>
              )}

            </div>

            {/* COLOR */}

            {colors.length >
              0 && (
              <div className="mt-9">

                <p className="mb-3 text-sm font-medium">
                  Select Color
                </p>

                <div className="flex flex-wrap gap-2">

                  {colors.map(
                    (color) => (
                      <button
                        key={
                          color
                        }
                        type="button"
                        onClick={() =>
                          handleColorChange(
                            color
                          )
                        }
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          selectedColor ===
                          color
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black"
                        }`}
                      >
                        {color}
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

            {/* SIZE */}

            {sizes.length >
              0 && (
              <div className="mt-7">

                <p className="mb-3 text-sm font-medium">
                  Select Size
                </p>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">

                  {sizes.map(
                    (size) => {

                      const variant =
                        getVariantForSize(
                          size
                        );

                      const stock =
                        Number(
                          variant?.stock ||
                            0
                        );

                      const outOfStock =
                        !variant ||
                        stock <= 0;

                      return (
                        <button
                          key={
                            size
                          }
                          type="button"
                          disabled={
                            outOfStock
                          }
                          onClick={() =>
                            handleSizeChange(
                              size
                            )
                          }
                          className={`h-10 border text-sm transition ${
                            outOfStock
                              ? "cursor-not-allowed bg-gray-50 text-gray-300 line-through"
                              : selectedSize ===
                                size
                              ? "border-black bg-black text-white"
                              : "border-gray-200 hover:border-black"
                          }`}
                        >
                          {
                            size
                          }
                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )}

            {/* QUANTITY */}

            <div className="mt-7">

              <p className="mb-3 text-sm font-medium">
                Quantity
              </p>

              <div className="flex h-10 w-[120px] items-center border border-gray-200">

                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  className="flex h-full w-10 items-center justify-center text-lg hover:bg-gray-50"
                >
                  −
                </button>

                <div className="flex-1 text-center text-sm">
                  {String(
                    quantity
                  ).padStart(
                    2,
                    "0"
                  )}
                </div>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  disabled={
                    !selectedVariant ||
                    quantity >=
                      Number(
                        selectedVariant.stock ||
                          0
                      )
                  }
                  className="flex h-full w-10 items-center justify-center text-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                >
                  +
                </button>

              </div>

            </div>

            {/* CART / BUY */}

            <div className="mt-6 grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={
                  cartLoading
                }
                className="h-12 border border-black bg-white text-sm font-medium transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cartLoading
                  ? "Adding..."
                  : "Add to cart"}
              </button>

              <button
                type="button"
                onClick={
                  buyNow
                }
                disabled={
                  buyLoading
                }
                className="h-12 bg-black text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {buyLoading
                  ? "Loading..."
                  : "Buy it now"}
              </button>

            </div>

            {/* DESCRIPTION */}

            <div className="mt-6 border-b border-gray-200">

              <button
                type="button"
                onClick={() =>
                  setOpenDescription(
                    !openDescription
                  )
                }
                className="flex w-full items-center justify-between py-5 text-left"
              >

                <span className="text-base font-medium">
                  Description
                </span>

                <svg
                  className={`h-4 w-4 transition-transform ${
                    openDescription
                      ? "rotate-180"
                      : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>

              </button>

              {openDescription && (
                <div className="pb-5 text-sm leading-6 text-gray-600">
                  {
                    product.description
                  }
                </div>
              )}

            </div>

            {/* SHIPPING */}

            <div className="border-b border-gray-200">

              <button
                type="button"
                onClick={() =>
                  setOpenShipping(
                    !openShipping
                  )
                }
                className="flex w-full items-center justify-between py-5 text-left"
              >

                <span className="text-base font-medium">
                  Shipping &
                  Returns
                </span>

                <svg
                  className={`h-4 w-4 transition-transform ${
                    openShipping
                      ? "rotate-180"
                      : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>

              </button>

              {openShipping && (
                <div className="pb-5 text-sm leading-6 text-gray-600">

                  <p>
                    Free shipping
                    on eligible
                    orders.
                  </p>

                  <p className="mt-2">
                    Orders are
                    processed
                    within 1–3
                    business days.
                  </p>

                  <p className="mt-2">
                    Items can be
                    returned
                    according to
                    our return
                    policy.
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* =========================================================
            REVIEWS
        ========================================================== */}

        <section className="mt-20 border-t border-gray-200 pt-16">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_minmax(0,1fr)]">

            {/* =====================================================
                REVIEW SUMMARY
            ====================================================== */}

            <div>

              <h2 className="text-2xl font-semibold tracking-tight">
                Customer Reviews
              </h2>

              <div className="mt-6 flex items-center gap-4">

                <div className="text-5xl font-semibold tracking-tight">
                  {averageRating}
                </div>

                <div>

                  <div className="flex text-lg">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <span
                          key={
                            star
                          }
                          className={
                            Number(
                              averageRating
                            ) >=
                            star
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      )
                    )}

                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Based on{" "}
                    {totalReviews}{" "}
                    reviews
                  </p>

                </div>

              </div>

              {/* RATING BREAKDOWN */}

              <div className="mt-8 space-y-3">

                {[5, 4, 3, 2, 1].map(
                  (rating) => {

                    const count =
                      getRatingCount(
                        rating
                      );

                    const percentage =
                      getRatingPercentage(
                        rating
                      );

                    return (
                      <div
                        key={
                          rating
                        }
                        className="flex items-center gap-3 text-sm"
                      >

                        <span className="w-3">
                          {
                            rating
                          }
                        </span>

                        <span className="text-yellow-500">
                          ★
                        </span>

                        <div className="h-2 flex-1 bg-gray-100">

                          <div
                            className="h-full bg-black transition-all"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />

                        </div>

                        <span className="w-6 text-right text-gray-500">
                          {
                            count
                          }
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            {/* =====================================================
                REVIEWS
            ====================================================== */}

            <div>

              <div className="space-y-8">

                {reviewLoading ? (
                  <div className="border-b border-gray-200 pb-8">

                    <p className="text-sm text-gray-500">
                      Loading
                      reviews...
                    </p>

                  </div>
                ) : reviewError ? (
                  <div className="border-b border-gray-200 pb-8">

                    <p className="text-sm text-red-500">
                      {reviewError?.message ||
                        "Unable to load reviews."}
                    </p>

                  </div>
                ) : reviews.length ===
                  0 ? (
                  <div className="border-b border-gray-200 pb-8">

                    <p className="text-sm text-gray-500">
                      No reviews yet.
                      Be the first
                      person to
                      review this
                      product.
                    </p>

                  </div>
                ) : (
                  reviews.map(
                    (review) => (
                      <div
                        key={
                          review.id
                        }
                        className="border-b border-gray-200 pb-8"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            {/* USER NAME FROM DATABASE */}

                            {review
                              .user
                              ?.name && (
                              <p className="mb-2 text-xs font-medium text-gray-900">
                                {
                                  review
                                    .user
                                    .name
                                }
                              </p>
                            )}

                            {/* STARS */}

                            <div className="flex text-sm">

                              {[1, 2, 3, 4, 5].map(
                                (
                                  star
                                ) => (
                                  <span
                                    key={
                                      star
                                    }
                                    className={
                                      star <=
                                      Number(
                                        review.rating
                                      )
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                    }
                                  >
                                    ★
                                  </span>
                                )
                              )}

                            </div>

                            {/* TITLE */}

                            {review.title && (
                              <h3 className="mt-2 font-medium">
                                {
                                  review.title
                                }
                              </h3>
                            )}

                          </div>

                          <span className="text-xs text-gray-400">

                            {review.created_at
                              ? new Date(
                                  review.created_at
                                ).toLocaleDateString()
                              : "Recently"}

                          </span>

                        </div>

                        {/* COMMENT */}

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          {
                            review.comment
                          }
                        </p>

                      </div>
                    )
                  )
                )}

              </div>

              {/* =================================================
                  REVIEW FORM
              ================================================== */}

              <div className="mt-12">

                <h3 className="text-xl font-semibold">
                  Write a review
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Share your
                  experience with
                  this product.
                </p>

                {!isAuthenticated ? (

                  <div className="mt-6 border border-gray-200 p-5">

                    <p className="text-sm text-gray-600">
                      Please login
                      to write a
                      review.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/login"
                        )
                      }
                      className="mt-4 bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
                    >
                      Login
                    </button>

                  </div>

                ) : (

                  <form
                    onSubmit={
                      submitReview
                    }
                    className="mt-6"
                  >

                    {/* RATING */}

                    <div>

                      <label className="text-sm font-medium">
                        Your rating
                      </label>

                      <div className="mt-2 flex gap-1">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <button
                              key={
                                star
                              }
                              type="button"
                              onClick={() =>
                                setReviewRating(
                                  star
                                )
                              }
                              className="text-2xl transition hover:scale-110"
                            >

                              <span
                                className={
                                  star <=
                                  reviewRating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }
                              >
                                ★
                              </span>

                            </button>
                          )
                        )}

                      </div>

                    </div>

                    {/* REVIEW TITLE */}

                    <div className="mt-6">

                      <label className="text-sm font-medium">
                        Review title
                      </label>

                      <input
                        type="text"
                        value={
                          reviewTitle
                        }
                        onChange={(
                          event
                        ) =>
                          setReviewTitle(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Give your review a title"
                        className="mt-2 h-11 w-full border border-gray-300 px-3 text-sm outline-none transition focus:border-black"
                      />

                    </div>

                    {/* COMMENT */}

                    <div className="mt-4">

                      <label className="text-sm font-medium">
                        Your review
                      </label>

                      <textarea
                        value={
                          reviewComment
                        }
                        onChange={(
                          event
                        ) =>
                          setReviewComment(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Tell us what you think about this product..."
                        rows={5}
                        className="mt-2 w-full resize-none border border-gray-300 p-3 text-sm outline-none transition focus:border-black"
                      />

                    </div>

                    {/* SUBMIT */}

                    <button
                      type="submit"
                      disabled={
                        reviewSubmitting
                      }
                      className="mt-5 h-12 bg-black px-8 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {reviewSubmitting
                        ? "Submitting..."
                        : "Submit review"}
                    </button>

                  </form>

                )}

              </div>

            </div>

          </div>

        </section>

        {/* =========================================================
            RELATED PRODUCTS
        ========================================================== */}

        <section className="mt-20 border-t border-gray-200 pt-16">

          <div className="flex items-end justify-between">

            <div>

              <h2 className="text-2xl font-semibold tracking-tight">
                You may also
                like
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                More products
                you might be
                interested in.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
              className="hidden text-sm font-medium underline underline-offset-4 sm:block"
            >
              View all
            </button>

          </div>

          {relatedLoading ? (

            <div className="mt-8 py-10 text-center text-sm text-gray-500">
              Loading related
              products...
            </div>

          ) : relatedProducts.length ===
            0 ? (

            <div className="mt-8 py-10 text-center text-sm text-gray-500">
              No related products
              available.
            </div>

          ) : (

            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">

              {relatedProducts.map(
                (item) => {

                  const image =
                    item.images?.[0]
                      ?.image_url ||
                    item.image_url ||
                    item.image;

                  return (

                    <div
                      key={
                        item.id
                      }
                      className="group cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/products/${item.id}`
                        )
                      }
                    >

                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">

                        {image ? (

                          <img
                            src={
                              image
                            }
                            alt={
                              item.product_name ||
                              item.name ||
                              "Product"
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                        ) : (

                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No image
                          </div>

                        )}

                        <button
                          type="button"
                          onClick={(
                            event
                          ) => {
                            event.stopPropagation();

                            navigate(
                              `/products/${item.id}`
                            );
                          }}
                          className="absolute bottom-3 left-3 right-3 hidden h-10 bg-white text-sm font-medium transition hover:bg-black hover:text-white sm:block sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          View
                          product
                        </button>

                      </div>

                      <div className="mt-4">

                        <div className="flex items-start justify-between gap-3">

                          <h3 className="text-sm font-medium">
                            {
                              item.product_name
                            }
                          </h3>

                          <span className="flex-shrink-0 text-sm font-medium">
                            ৳
                            {Number(
                              item.price ||
                                0
                            ).toFixed(
                              2
                            )}
                          </span>

                        </div>

                        {item.category && (
                          <p className="mt-1 text-xs text-gray-500">
                            {
                              item.category
                            }
                          </p>
                        )}

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/products"
              )
            }
            className="mt-8 block w-full border border-black py-3 text-sm font-medium sm:hidden"
          >
            View all
            products
          </button>

        </section>

      </div>

    </div>
  );
};

export default ProductDetails;
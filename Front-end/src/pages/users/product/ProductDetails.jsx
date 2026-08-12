import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const ProductDetails = ({ product }) => {
    /*
    |--------------------------------------------------------------------------
    | Product Data
    |--------------------------------------------------------------------------
    */

    const defaultImages = [
        "/images/product-1.jpg",
        "/images/product-2.jpg",
        "/images/product-3.jpg",
        "/images/product-4.jpg",
        "/images/product-5.jpg",
    ];

    const defaultColors = [
        {
            id: 1,
            name: "Purple",
            hex_code: "#7777e8",
        },
        {
            id: 2,
            name: "Green",
            hex_code: "#233b37",
        },
        {
            id: 3,
            name: "Black",
            hex_code: "#111111",
        },
        {
            id: 4,
            name: "Pink",
            hex_code: "#f3a0a0",
        },
    ];

    const defaultSizes = [
        {
            id: 1,
            name: "S",
            stock: 10,
        },
        {
            id: 2,
            name: "M",
            stock: 10,
        },
        {
            id: 3,
            name: "L",
            stock: 10,
        },
        {
            id: 4,
            name: "XL",
            stock: 10,
        },
        {
            id: 5,
            name: "XXL",
            stock: 10,
        },
        {
            id: 6,
            name: "3XL",
            stock: 10,
        },
    ];

    const images =
        product?.images?.length > 0
            ? product.images
            : defaultImages;

    const colors =
        product?.colors?.length > 0
            ? product.colors
            : defaultColors;

    const sizes =
        product?.sizes?.length > 0
            ? product.sizes
            : defaultSizes;

    /*
    |--------------------------------------------------------------------------
    | Main Product States
    |--------------------------------------------------------------------------
    */

    const [selectedImage, setSelectedImage] = useState(0);

    const [selectedColor, setSelectedColor] = useState(
        colors[0]?.id || null
    );

    const [selectedSize, setSelectedSize] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const [openDescription, setOpenDescription] =
        useState(true);

    const [openShipping, setOpenShipping] =
        useState(false);

    /*
    |--------------------------------------------------------------------------
    | Review States
    |--------------------------------------------------------------------------
    */

    const [reviews, setReviews] = useState(
        product?.reviews || []
    );

    const [reviewRating, setReviewRating] = useState(0);

    const [reviewName, setReviewName] = useState("");

    const [reviewTitle, setReviewTitle] = useState("");

    const [reviewComment, setReviewComment] =
        useState("");

    const [reviewSubmitting, setReviewSubmitting] =
        useState(false);

    /*
    |--------------------------------------------------------------------------
    | Update Reviews When Product Changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setReviews(product?.reviews || []);
    }, [product]);

    /*
    |--------------------------------------------------------------------------
    | Reset Image When Product Changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setSelectedImage(0);

        setSelectedColor(
            product?.colors?.[0]?.id ||
                defaultColors[0].id
        );

        setSelectedSize(null);

        setQuantity(1);
    }, [product]);

    /*
    |--------------------------------------------------------------------------
    | Rating
    |--------------------------------------------------------------------------
    */

    const averageRating = useMemo(() => {
        if (product?.rating) {
            return Number(product.rating).toFixed(1);
        }

        if (!reviews.length) {
            return "0.0";
        }

        const total = reviews.reduce(
            (sum, review) =>
                sum + Number(review.rating || 0),
            0
        );

        return (total / reviews.length).toFixed(1);
    }, [product?.rating, reviews]);

    /*
    |--------------------------------------------------------------------------
    | Rating Count
    |--------------------------------------------------------------------------
    */

    const getRatingCount = (rating) => {
        return reviews.filter(
            (review) =>
                Number(review.rating) === Number(rating)
        ).length;
    };

    /*
    |--------------------------------------------------------------------------
    | Rating Percentage
    |--------------------------------------------------------------------------
    */

    const getRatingPercentage = (rating) => {
        if (!reviews.length) {
            return 0;
        }

        return (
            (getRatingCount(rating) /
                reviews.length) *
            100
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Previous Image
    |--------------------------------------------------------------------------
    */

    const previousImage = () => {
        setSelectedImage((current) => {
            if (current === 0) {
                return images.length - 1;
            }

            return current - 1;
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Next Image
    |--------------------------------------------------------------------------
    */

    const nextImage = () => {
        setSelectedImage((current) => {
            if (current === images.length - 1) {
                return 0;
            }

            return current + 1;
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Quantity
    |--------------------------------------------------------------------------
    */

    const decreaseQuantity = () => {
        setQuantity((current) =>
            Math.max(1, current - 1)
        );
    };

    const increaseQuantity = () => {
        setQuantity((current) => current + 1);
    };

    /*
    |--------------------------------------------------------------------------
    | Add To Cart
    |--------------------------------------------------------------------------
    */

    const addToCart = async () => {
        if (!product?.id) {
            alert("Product ID is missing.");
            return;
        }

        if (!selectedSize) {
            alert("Please select a size.");
            return;
        }

        try {
            await axios.post("/api/cart", {
                product_id: product.id,
                color_id: selectedColor,
                size_id: selectedSize,
                quantity: quantity,
            });

            alert("Product added to cart.");
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                    "Unable to add product to cart."
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Buy Now
    |--------------------------------------------------------------------------
    */

    const buyNow = async () => {
        if (!product?.id) {
            alert("Product ID is missing.");
            return;
        }

        if (!selectedSize) {
            alert("Please select a size.");
            return;
        }

        try {
            /*
             * You can replace this with your checkout
             * logic later.
             */

            window.location.href = `/checkout?product=${product.id}&size=${selectedSize}&color=${selectedColor}&quantity=${quantity}`;
        } catch (error) {
            console.error(error);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Submit Review
    |--------------------------------------------------------------------------
    */

    const submitReview = async (event) => {
        event.preventDefault();

        if (!reviewRating) {
            alert("Please select a rating.");
            return;
        }

        if (!reviewName.trim()) {
            alert("Please enter your name.");
            return;
        }

        if (!reviewComment.trim()) {
            alert("Please write your review.");
            return;
        }

        setReviewSubmitting(true);

        try {
            /*
             * Laravel API
             *
             * POST:
             * /api/products/{product}/reviews
             */

            const response = await axios.post(
                `/api/products/${product.id}/reviews`,
                {
                    name: reviewName,
                    rating: reviewRating,
                    title: reviewTitle,
                    comment: reviewComment,
                }
            );

            /*
             * If Laravel returns the created review,
             * add it immediately to the list.
             */

            if (response.data?.review) {
                setReviews((current) => [
                    response.data.review,
                    ...current,
                ]);
            } else {
                /*
                 * Temporary local fallback
                 */

                const newReview = {
                    id: Date.now(),
                    name: reviewName,
                    rating: reviewRating,
                    title: reviewTitle,
                    comment: reviewComment,
                    date: "Just now",
                };

                setReviews((current) => [
                    newReview,
                    ...current,
                ]);
            }

            /*
             * Reset form
             */

            setReviewRating(0);
            setReviewName("");
            setReviewTitle("");
            setReviewComment("");

            alert("Your review has been submitted.");
        } catch (error) {
            console.error(
                "Review submission error:",
                error
            );

            /*
             * If your Laravel endpoint is not ready yet,
             * this fallback allows the UI to still work.
             */

            const newReview = {
                id: Date.now(),
                name: reviewName,
                rating: reviewRating,
                title: reviewTitle,
                comment: reviewComment,
                date: "Just now",
            };

            setReviews((current) => [
                newReview,
                ...current,
            ]);

            setReviewRating(0);
            setReviewName("");
            setReviewTitle("");
            setReviewComment("");

            alert(
                "Review added locally. Connect the Laravel review API to save it permanently."
            );
        } finally {
            setReviewSubmitting(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-screen bg-white">

            <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10">

                {/* =====================================================
                    PRODUCT DETAILS
                ====================================================== */}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[80px_minmax(0,1fr)_420px] xl:gap-10">

                    {/* =================================================
                        THUMBNAILS
                    ================================================== */}

                    <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">

                        {images.map(
                            (image, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() =>
                                        setSelectedImage(
                                            index
                                        )
                                    }
                                    className={`
                                        relative
                                        h-[80px]
                                        w-[80px]
                                        flex-shrink-0
                                        overflow-hidden
                                        bg-gray-100
                                        transition
                                        ${
                                            selectedImage ===
                                            index
                                                ? "border-2 border-black"
                                                : "border border-transparent"
                                        }
                                    `}
                                >
                                    <img
                                        src={image}
                                        alt={`${product?.name || "Product"} ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            )
                        )}

                    </div>


                    {/* =================================================
                        MAIN PRODUCT IMAGE
                    ================================================== */}

                    <div className="order-1 lg:order-2">

                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e7e7f5]">

                            <img
                                src={
                                    images[
                                        selectedImage
                                    ]
                                }
                                alt={
                                    product?.name ||
                                    "Product"
                                }
                                className="h-full w-full object-cover"
                            />

                            {/* Previous Button */}

                            {images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={
                                        previousImage
                                    }
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        flex
                                        h-9
                                        w-9
                                        -translate-y-1/2
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white
                                        shadow-sm
                                        transition
                                        hover:scale-105
                                    "
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
                            )}

                            {/* Next Button */}

                            {images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={nextImage}
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        flex
                                        h-9
                                        w-9
                                        -translate-y-1/2
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white
                                        shadow-sm
                                        transition
                                        hover:scale-105
                                    "
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
                            )}

                        </div>

                    </div>


                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================== */}

                    <div className="order-3">

                        {/* Product title */}

                        <div className="flex items-start justify-between gap-4">

                            <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                                {product?.name ||
                                    'Nike ACG "Wolf Tree" Polartec'}
                            </h1>

                            <div className="flex flex-shrink-0 items-center gap-1 text-sm">

                                <span className="text-yellow-500">
                                    ★
                                </span>

                                <span>
                                    {averageRating}
                                </span>

                            </div>

                        </div>


                        {/* Price */}

                        <div className="mt-4">

                            <span className="text-xl font-medium">
                                $
                                {Number(
                                    product?.price ||
                                        250
                                ).toFixed(2)}
                            </span>

                        </div>


                        {/* Payment information */}

                        <div className="mt-3 text-xs text-gray-500">

                            Pay in 4 interest-free
                            installments for orders
                            over $500 with{" "}

                            <span className="font-semibold text-black">
                                ShopPay
                            </span>{" "}

                            <span className="cursor-pointer underline">
                                Learn more
                            </span>

                        </div>


                        {/* =================================================
                            COLOR
                        ================================================== */}

                        <div className="mt-9">

                            <p className="mb-3 text-sm font-medium">
                                Select Color
                            </p>

                            <div className="flex gap-3">

                                {colors.map(
                                    (color) => (
                                        <button
                                            key={
                                                color.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                setSelectedColor(
                                                    color.id
                                                )
                                            }
                                            title={
                                                color.name
                                            }
                                            style={{
                                                backgroundColor:
                                                    color.hex_code ||
                                                    color.hex ||
                                                    color,
                                            }}
                                            className={`
                                                h-7
                                                w-7
                                                rounded-full
                                                transition
                                                ${
                                                    selectedColor ===
                                                    color.id
                                                        ? "ring-1 ring-black ring-offset-2"
                                                        : "ring-1 ring-gray-200"
                                                }
                                            `}
                                        />
                                    )
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            SIZE
                        ================================================== */}

                        <div className="mt-7">

                            <p className="mb-3 text-sm font-medium">
                                Select Size
                            </p>

                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">

                                {sizes.map(
                                    (size) => {

                                        const outOfStock =
                                            Number(
                                                size.stock
                                            ) <= 0;

                                        return (
                                            <button
                                                key={
                                                    size.id
                                                }
                                                type="button"
                                                disabled={
                                                    outOfStock
                                                }
                                                onClick={() =>
                                                    setSelectedSize(
                                                        size.id
                                                    )
                                                }
                                                className={`
                                                    h-10
                                                    border
                                                    text-sm
                                                    transition
                                                    ${
                                                        outOfStock
                                                            ? "cursor-not-allowed bg-gray-50 text-gray-300 line-through"
                                                            : selectedSize ===
                                                              size.id
                                                            ? "border-black bg-black text-white"
                                                            : "border-gray-200 hover:border-black"
                                                    }
                                                `}
                                            >
                                                {
                                                    size.name
                                                }
                                            </button>
                                        );
                                    }
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            QUANTITY
                        ================================================== */}

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
                                    className="
                                        flex
                                        h-full
                                        w-10
                                        items-center
                                        justify-center
                                        text-lg
                                        hover:bg-gray-50
                                    "
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
                                    className="
                                        flex
                                        h-full
                                        w-10
                                        items-center
                                        justify-center
                                        text-lg
                                        hover:bg-gray-50
                                    "
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            CART / BUY BUTTONS
                        ================================================== */}

                        <div className="mt-6 grid grid-cols-2 gap-2">

                            <button
                                type="button"
                                onClick={addToCart}
                                className="
                                    h-12
                                    border
                                    border-black
                                    bg-white
                                    text-sm
                                    font-medium
                                    transition
                                    hover:bg-black
                                    hover:text-white
                                "
                            >
                                Add to cart
                            </button>

                            <button
                                type="button"
                                onClick={buyNow}
                                className="
                                    h-12
                                    bg-black
                                    text-sm
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-gray-800
                                "
                            >
                                Buy it now
                            </button>

                        </div>


                        {/* =================================================
                            DESCRIPTION ACCORDION
                        ================================================== */}

                        <div className="border-b border-gray-200">

                            <button
                                type="button"
                                onClick={() =>
                                    setOpenDescription(
                                        !openDescription
                                    )
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    py-5
                                    text-left
                                "
                            >
                                <span className="text-base font-medium">
                                    Description
                                </span>

                                <svg
                                    className={`
                                        h-4
                                        w-4
                                        transition-transform
                                        ${
                                            openDescription
                                                ? "rotate-180"
                                                : ""
                                        }
                                    `}
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
                                    {product?.description ||
                                        "This product combines comfort, durability and everyday style. Designed for outdoor use and casual everyday wear."}
                                </div>
                            )}

                        </div>


                        {/* =================================================
                            SHIPPING & RETURNS
                        ================================================== */}

                        <div className="border-b border-gray-200">

                            <button
                                type="button"
                                onClick={() =>
                                    setOpenShipping(
                                        !openShipping
                                    )
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    py-5
                                    text-left
                                "
                            >
                                <span className="text-base font-medium">
                                    Shipping & Returns
                                </span>

                                <svg
                                    className={`
                                        h-4
                                        w-4
                                        transition-transform
                                        ${
                                            openShipping
                                                ? "rotate-180"
                                                : ""
                                        }
                                    `}
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
                                        Free shipping on
                                        eligible orders.
                                    </p>

                                    <p className="mt-2">
                                        Orders are
                                        processed within
                                        1–3 business days.
                                    </p>

                                    <p className="mt-2">
                                        Items can be
                                        returned according
                                        to our return
                                        policy.
                                    </p>

                                </div>
                            )}

                        </div>

                    </div>

                </div>


                {/* =========================================================
                    REVIEWS SECTION
                ========================================================== */}

                <section className="mt-20 border-t border-gray-200 pt-16">

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_minmax(0,1fr)]">

                        {/* =================================================
                            REVIEW SUMMARY
                        ================================================== */}

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
                                                    className="text-yellow-500"
                                                >
                                                    ★
                                                </span>
                                            )
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Based on{" "}
                                        {
                                            reviews.length
                                        }{" "}
                                        reviews
                                    </p>

                                </div>

                            </div>


                            {/* Rating bars */}

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


                        {/* =================================================
                            REVIEW LIST + FORM
                        ================================================== */}

                        <div>

                            {/* Existing Reviews */}

                            <div className="space-y-8">

                                {reviews.length ===
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
                                        (
                                            review
                                        ) => (
                                            <div
                                                key={
                                                    review.id
                                                }
                                                className="border-b border-gray-200 pb-8"
                                            >

                                                <div className="flex items-start justify-between gap-4">

                                                    <div>

                                                        {/* Stars */}

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

                                                        {/* Review title */}

                                                        {review.title && (
                                                            <h3 className="mt-2 font-medium">
                                                                {
                                                                    review.title
                                                                }
                                                            </h3>
                                                        )}

                                                    </div>


                                                    {/* Date */}

                                                    <span className="text-xs text-gray-400">
                                                        {review.date ||
                                                            review.created_at ||
                                                            "Recently"}
                                                    </span>

                                                </div>


                                                {/* Comment */}

                                                <p className="mt-3 text-sm leading-6 text-gray-600">
                                                    {
                                                        review.comment
                                                    }
                                                </p>


                                                {/* Reviewer */}

                                                <p className="mt-3 text-xs font-medium text-gray-900">
                                                    {
                                                        review.name
                                                    }
                                                </p>

                                            </div>
                                        )
                                    )
                                )}

                            </div>


                            {/* =================================================
                                WRITE REVIEW
                            ================================================== */}

                            <div className="mt-12">

                                <h3 className="text-xl font-semibold">
                                    Write a review
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Share your experience
                                    with this product.
                                </p>


                                <form
                                    onSubmit={
                                        submitReview
                                    }
                                    className="mt-6"
                                >

                                    {/* Rating */}

                                    <div>

                                        <label className="text-sm font-medium">
                                            Your rating
                                        </label>

                                        <div className="mt-2 flex gap-1">

                                            {[
                                                1,
                                                2,
                                                3,
                                                4,
                                                5,
                                            ].map(
                                                (
                                                    star
                                                ) => (
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
                                                        className="
                                                            text-2xl
                                                            transition
                                                            hover:scale-110
                                                        "
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


                                    {/* Name + Title */}

                                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                                        <div>

                                            <label className="text-sm font-medium">
                                                Name
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    reviewName
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setReviewName(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Your name"
                                                className="
                                                    mt-2
                                                    h-11
                                                    w-full
                                                    border
                                                    border-gray-300
                                                    px-3
                                                    text-sm
                                                    outline-none
                                                    transition
                                                    focus:border-black
                                                "
                                            />

                                        </div>


                                        <div>

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
                                                className="
                                                    mt-2
                                                    h-11
                                                    w-full
                                                    border
                                                    border-gray-300
                                                    px-3
                                                    text-sm
                                                    outline-none
                                                    transition
                                                    focus:border-black
                                                "
                                            />

                                        </div>

                                    </div>


                                    {/* Comment */}

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
                                            className="
                                                mt-2
                                                w-full
                                                resize-none
                                                border
                                                border-gray-300
                                                p-3
                                                text-sm
                                                outline-none
                                                transition
                                                focus:border-black
                                            "
                                        />

                                    </div>


                                    {/* Submit */}

                                    <button
                                        type="submit"
                                        disabled={
                                            reviewSubmitting
                                        }
                                        className="
                                            mt-5
                                            h-12
                                            bg-black
                                            px-8
                                            text-sm
                                            font-medium
                                            text-white
                                            transition
                                            hover:bg-gray-800
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        {reviewSubmitting
                                            ? "Submitting..."
                                            : "Submit review"}
                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================================================
                    YOU MAY ALSO LIKE
                ========================================================== */}

                <section className="mt-20 border-t border-gray-200 pt-16">

                    {/* Section Heading */}

                    <div className="flex items-end justify-between">

                        <div>

                            <h2 className="text-2xl font-semibold tracking-tight">
                                You may also like
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                More products you might
                                be interested in.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                (window.location.href =
                                    "/products")
                            }
                            className="
                                hidden
                                text-sm
                                font-medium
                                underline
                                underline-offset-4
                                sm:block
                            "
                        >
                            View all
                        </button>

                    </div>


                    {/* Product Grid */}

                    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">

                        {(
                            product?.related_products ||
                            [
                                {
                                    id: 1,
                                    name: "ACG Fleece Jacket",
                                    price: 180,
                                    image: "/images/product-1.jpg",
                                    category:
                                        "ACG Collection",
                                },
                                {
                                    id: 2,
                                    name: "Trail Running Jacket",
                                    price: 220,
                                    image: "/images/product-2.jpg",
                                    category:
                                        "ACG Collection",
                                },
                                {
                                    id: 3,
                                    name: "Outdoor Fleece Hoodie",
                                    price: 195,
                                    image: "/images/product-3.jpg",
                                    category:
                                        "ACG Collection",
                                },
                                {
                                    id: 4,
                                    name: "ACG Therma-FIT Jacket",
                                    price: 240,
                                    image: "/images/product-4.jpg",
                                    category:
                                        "ACG Collection",
                                },
                            ]
                        ).map((item) => (

                            <div
                                key={item.id}
                                className="group cursor-pointer"
                                onClick={() => {
                                    window.location.href = `/products/${item.id}`;
                                }}
                            >

                                {/* Product Image */}

                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">

                                    <img
                                        src={
                                            item.image
                                        }
                                        alt={
                                            item.name
                                        }
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                            transition
                                            duration-500
                                            group-hover:scale-105
                                        "
                                    />


                                    {/* Quick Add */}

                                    <button
                                        type="button"
                                        onClick={(
                                            event
                                        ) => {
                                            event.stopPropagation();

                                            /*
                                             * Add quick cart
                                             * logic here.
                                             */
                                        }}
                                        className="
                                            absolute
                                            bottom-3
                                            left-3
                                            right-3
                                            hidden
                                            h-10
                                            bg-white
                                            text-sm
                                            font-medium
                                            transition
                                            hover:bg-black
                                            hover:text-white
                                            sm:block
                                            sm:opacity-0
                                            sm:group-hover:opacity-100
                                        "
                                    >
                                        Quick add
                                    </button>

                                </div>


                                {/* Product Information */}

                                <div className="mt-4">

                                    <div className="flex items-start justify-between gap-3">

                                        <h3 className="text-sm font-medium">
                                            {
                                                item.name
                                            }
                                        </h3>

                                        <span className="flex-shrink-0 text-sm font-medium">
                                            $
                                            {Number(
                                                item.price
                                            ).toFixed(
                                                2
                                            )}
                                        </span>

                                    </div>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {item.category ||
                                            "ACG Collection"}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>


                    {/* Mobile View All */}

                    <button
                        type="button"
                        onClick={() =>
                            (window.location.href =
                                "/products")
                        }
                        className="
                            mt-8
                            block
                            w-full
                            border
                            border-black
                            py-3
                            text-sm
                            font-medium
                            sm:hidden
                        "
                    >
                        View all products
                    </button>

                </section>

            </div>

        </div>
    );
};

export default ProductDetails;